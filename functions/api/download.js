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

  const entitlement = await env.ENTITLEMENTS.get(`entitlement:${sessionId}`);
  if (!entitlement) {
    return json(
      { error: "Payment confirmation is still pending." },
      425,
      { "retry-after": "3" },
    );
  }

  const objectKey = env.PRODUCT_OBJECT_KEY || "China-Supplier-Vetting-Kit-v1.2.zip";
  const object = await env.PRODUCT_FILES.get(objectKey);
  if (!object) return json({ error: "Product file is unavailable." }, 503);

  const filename = env.PRODUCT_DOWNLOAD_NAME || "China-Supplier-Vetting-Kit-v1.2.zip";
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("content-type", "application/zip");
  headers.set("content-disposition", `attachment; filename="${filename}"`);
  headers.set("content-length", String(object.size));
  headers.set("cache-control", "private, no-store, max-age=0");
  headers.set("referrer-policy", "no-referrer");
  headers.set("x-content-type-options", "nosniff");

  return new Response(object.body, { headers });
}
