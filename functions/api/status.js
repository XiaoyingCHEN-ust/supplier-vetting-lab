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

  const entitlement = await env.ENTITLEMENTS.get(`entitlement:${sessionId}`);
  return json({ ready: Boolean(entitlement) }, entitlement ? 200 : 202);
}
