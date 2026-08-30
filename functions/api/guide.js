import {
  GUIDE_CATALOG,
  GUIDE_ID,
  hasGuideAccess,
  isSupportedGuideId,
} from "../_lib/auth.js";

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
  const searchParams = new URL(request.url).searchParams;
  const guideId = searchParams.get("guide_id") || GUIDE_ID;
  if (!isSupportedGuideId(guideId)) return json({ error: "Unknown guide." }, 404);
  const guideDefinition = GUIDE_CATALOG[guideId];

  const sessionId = searchParams.get("session_id") || "";
  const access = await hasGuideAccess(request, env, guideId, sessionId);
  if (!access.allowed) {
    return json(
      { error: sessionId ? "Payment confirmation is still pending." : "Sign in or purchase the guide to continue." },
      sessionId ? 425 : 401,
    );
  }

  const object = await env.PRODUCT_FILES.get(guideDefinition.objectKey);
  if (!object) return json({ error: "The guide content is unavailable." }, 503);
  try {
    const guide = JSON.parse(await object.text());
    if (guide?.meta?.id !== guideId) throw new Error("Guide mismatch");
    return json({ access: access.source, guide });
  } catch {
    return json({ error: "The guide content is invalid." }, 503);
  }
}
