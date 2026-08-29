function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...extraHeaders,
    },
  });
}

export async function onRequestGet({ request, env }) {
  if (!env.ENTITLEMENTS || !env.PRODUCT_FILES) {
    return json({ error: "Delivery is not configured." }, 503);
  }

  const sessionId = new URL(request.url).searchParams.get("session_id") || "";
  if (!/^cs_(?:(?:test|live)_)?[A-Za-z0-9]+$/.test(sessionId)) {
    return json({ error: "Invalid order reference." }, 400);
  }

  const entitlementValue = await env.ENTITLEMENTS.get(`entitlement:${sessionId}`);
  if (!entitlementValue) {
    return json(
      { error: "Payment confirmation is still pending." },
      425,
      { "retry-after": "3" },
    );
  }

  let entitlement;
  try {
    entitlement = JSON.parse(entitlementValue);
  } catch {
    return json({ error: "Order delivery record is invalid." }, 503);
  }

  const product = entitlement?.product;
  if (
    !product ||
    typeof product.objectKey !== "string" ||
    typeof product.filename !== "string"
  ) {
    return json({ error: "Order product is unavailable." }, 503);
  }

  const objectKey = product.objectKey;
  const object = await env.PRODUCT_FILES.get(objectKey);
  if (!object) return json({ error: "Product file is unavailable." }, 503);

  const filename = product.filename.replaceAll(/[\r\n"]/g, "_");
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("content-type", product.contentType || "application/octet-stream");
  headers.set("content-disposition", `attachment; filename="${filename}"`);
  headers.set("content-length", String(object.size));
  headers.set("cache-control", "private, no-store, max-age=0");
  headers.set("referrer-policy", "no-referrer");
  headers.set("x-content-type-options", "nosniff");

  return new Response(object.body, { headers });
}
