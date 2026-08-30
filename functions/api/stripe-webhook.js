const encoder = new TextEncoder();

function hexToBytes(value) {
  if (!/^[0-9a-f]{64}$/i.test(value)) return null;
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < value.length; index += 2) {
    bytes[index / 2] = Number.parseInt(value.slice(index, index + 2), 16);
  }
  return bytes;
}

async function verifyStripeSignature(payload, signatureHeader, secrets) {
  const parts = signatureHeader.split(",").map((part) => part.trim());
  const timestampPart = parts.find((part) => part.startsWith("t="));
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => hexToBytes(part.slice(3)))
    .filter(Boolean);

  if (!timestampPart || signatures.length === 0) return false;

  const timestamp = Number.parseInt(timestampPart.slice(2), 10);
  if (!Number.isFinite(timestamp)) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > 300) return false;

  const signedPayload = encoder.encode(`${timestamp}.${payload}`);
  for (const secret of secrets) {
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    for (const signature of signatures) {
      if (await crypto.subtle.verify("HMAC", key, signature, signedPayload)) {
        return true;
      }
    }
  }

  return false;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function parseProductCatalog(env) {
  try {
    const catalog = JSON.parse(env.PRODUCT_CATALOG || "{}");
    if (!catalog || Array.isArray(catalog) || typeof catalog !== "object") return {};
    return catalog;
  } catch {
    return {};
  }
}

function sessionProduct(session, catalog) {
  if (
    typeof session?.id !== "string" ||
    !session.id.startsWith("cs_") ||
    typeof session.payment_link !== "string" ||
    session.currency !== "usd"
  ) {
    return null;
  }

  const product = catalog[session.payment_link];
  if (
    !product ||
    !Number.isInteger(product.amount) ||
    product.amount !== session.amount_total ||
    typeof product.objectKey !== "string" ||
    typeof product.filename !== "string"
  ) {
    return null;
  }

  return {
    objectKey: product.objectKey,
    filename: product.filename,
    contentType: product.contentType || "application/octet-stream",
    label: product.label || "Your purchase",
    guideId: typeof product.guideId === "string" ? product.guideId : null,
    accessType: typeof product.accessType === "string" ? product.accessType : "download",
  };
}

async function grantEntitlement(session, product, env) {
  const entitlement = {
    sessionId: session.id,
    paymentIntent: session.payment_intent || null,
    customerEmail: session.customer_details?.email || session.customer_email || null,
    product,
    grantedAt: new Date().toISOString(),
  };
  const options = { expirationTtl: 60 * 60 * 24 * 365 };
  const entitlementKey = `entitlement:${session.id}`;
  const entitlementValue = JSON.stringify(entitlement);

  if (product.accessType === "guide") {
    await env.ENTITLEMENTS.put(entitlementKey, entitlementValue);
  } else {
    await env.ENTITLEMENTS.put(entitlementKey, entitlementValue, options);
  }

  if (session.payment_intent) {
    const paymentIntentKey = `payment-intent:${session.payment_intent}`;
    if (product.accessType === "guide") {
      await env.ENTITLEMENTS.put(paymentIntentKey, session.id);
    } else {
      await env.ENTITLEMENTS.put(paymentIntentKey, session.id, options);
    }
  }
}

async function revokeByPaymentIntent(paymentIntent, env) {
  if (!paymentIntent) return;
  const sessionId = await env.ENTITLEMENTS.get(`payment-intent:${paymentIntent}`);
  if (sessionId) {
    await env.ENTITLEMENTS.delete(`entitlement:${sessionId}`);
  }
  await env.ENTITLEMENTS.delete(`payment-intent:${paymentIntent}`);
}

export async function onRequestPost({ request, env }) {
  if (!env.ENTITLEMENTS) return json({ error: "Missing KV binding." }, 500);

  const secrets = [
    env.STRIPE_WEBHOOK_TEST_SECRET,
    env.STRIPE_WEBHOOK_LIVE_SECRET,
    env.STRIPE_WEBHOOK_SECRETS,
    env.STRIPE_WEBHOOK_SECRET,
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
  const signatureHeader = request.headers.get("stripe-signature") || "";
  const payload = await request.text();

  if (
    secrets.length === 0 ||
    !(await verifyStripeSignature(payload, signatureHeader, secrets))
  ) {
    return json({ error: "Invalid signature." }, 400);
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  const catalog = parseProductCatalog(env);
  if (Object.keys(catalog).length === 0) {
    return json({ error: "No product catalog configured." }, 500);
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data?.object;
    const product = sessionProduct(session, catalog);
    if (
      product &&
      session.payment_status === "paid"
    ) {
      await grantEntitlement(session, product, env);
    }
  }

  if (event.type === "checkout.session.async_payment_failed") {
    await revokeByPaymentIntent(event.data?.object?.payment_intent, env);
  }

  if (event.type === "charge.refunded") {
    await revokeByPaymentIntent(event.data?.object?.payment_intent, env);
  }

  return json({ received: true });
}
