import { GUIDE_ID, hasGuideAccess } from "../_lib/auth.js";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "private, no-store, max-age=0",
      "x-content-type-options": "nosniff",
      "referrer-policy": "same-origin",
    },
  });
}

export async function onRequestGet({ request, env }) {
  if (!env.ENTITLEMENTS || !env.PRODUCT_FILES) {
    return json({ error: "Guide access is not configured." }, 503);
  }
  const sessionId = new URL(request.url).searchParams.get("session_id") || "";
  const access = await hasGuideAccess(request, env, sessionId);
  if (!access.allowed) {
    return json(
      { error: sessionId ? "Payment confirmation is still pending." : "Sign in or purchase the guide to continue." },
      sessionId ? 425 : 401,
    );
  }

  const object = await env.PRODUCT_FILES.get("Phuket-Travel-Brief-v1.json");
  if (!object) return json({ error: "The guide content is unavailable." }, 503);
  try {
    const guide = JSON.parse(await object.text());
    if (guide?.meta?.id !== GUIDE_ID) throw new Error("Guide mismatch");
    return json({ access: access.source, guide });
  } catch {
    return json({ error: "The guide content is invalid." }, 503);
  }
}
