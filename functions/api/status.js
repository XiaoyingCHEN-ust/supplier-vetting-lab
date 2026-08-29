function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

export async function onRequestGet({ request, env }) {
  if (!env.ENTITLEMENTS) return json({ error: "Delivery is not configured." }, 503);

  const sessionId = new URL(request.url).searchParams.get("session_id") || "";
  if (!/^cs_(?:(?:test|live)_)?[A-Za-z0-9]+$/.test(sessionId)) {
    return json({ error: "Invalid order reference." }, 400);
  }

  const entitlementValue = await env.ENTITLEMENTS.get(`entitlement:${sessionId}`);
  if (!entitlementValue) return json({ ready: false }, 202);

  try {
    const entitlement = JSON.parse(entitlementValue);
    return json({
      ready: true,
      productName: entitlement?.product?.label || "Your purchase",
    });
  } catch {
    return json({ error: "Order delivery record is invalid." }, 503);
  }
}
