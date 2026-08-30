import {
  AUTH_COOKIE,
  GUIDE_ID,
  clearSessionCookie,
  cookieValue,
  createLoginSession,
  currentAccount,
  emailKey,
  normalizeEmail,
  passwordRecord,
  sessionCookie,
  validPassword,
  verifyPassword,
} from "../_lib/auth.js";

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...headers,
    },
  });
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function rateLimited(request, env, email) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const key = `login-attempt:${ip}:${await emailKey(email)}`;
  const count = Number.parseInt(await env.ENTITLEMENTS.get(key) || "0", 10);
  if (count >= 8) return true;
  await env.ENTITLEMENTS.put(key, String(count + 1), { expirationTtl: 15 * 60 });
  return false;
}

export async function onRequestGet({ request, env }) {
  if (!env.ENTITLEMENTS) return json({ error: "Account access is not configured." }, 503);
  const signedIn = await currentAccount(request, env);
  if (!signedIn) return json({ signedIn: false });
  return json({
    signedIn: true,
    email: signedIn.account.email,
    guideAccess: signedIn.account.guideIds?.includes(GUIDE_ID) || false,
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.ENTITLEMENTS) return json({ error: "Account access is not configured." }, 503);
  const body = await readBody(request);
  if (!body || !["register", "login"].includes(body.action)) {
    return json({ error: "Invalid account request." }, 400);
  }

  if (!validPassword(body.password)) {
    return json({ error: "Use a password between 10 and 128 characters." }, 400);
  }

  if (body.action === "register") {
    const sessionId = String(body.sessionId || "");
    if (!/^cs_(?:(?:test|live)_)?[A-Za-z0-9]+$/.test(sessionId)) {
      return json({ error: "A valid paid order is required to register." }, 400);
    }
    const entitlementValue = await env.ENTITLEMENTS.get(`entitlement:${sessionId}`);
    if (!entitlementValue) return json({ error: "Payment confirmation is still pending." }, 425);

    let entitlement;
    try {
      entitlement = JSON.parse(entitlementValue);
    } catch {
      return json({ error: "The order record is invalid." }, 503);
    }
    const email = normalizeEmail(entitlement.customerEmail);
    if (entitlement?.product?.guideId !== GUIDE_ID || !email.includes("@")) {
      return json({ error: "This order cannot create a guide account." }, 403);
    }

    const key = await emailKey(email);
    if (await env.ENTITLEMENTS.get(key)) {
      return json({ error: "An account already exists for this payment email. Sign in instead." }, 409);
    }
    const account = {
      email,
      password: await passwordRecord(body.password),
      guideIds: [GUIDE_ID],
      createdAt: new Date().toISOString(),
    };
    await env.ENTITLEMENTS.put(key, JSON.stringify(account));
    const token = await createLoginSession(env, key);
    return json(
      { signedIn: true, email, guideAccess: true },
      201,
      { "set-cookie": sessionCookie(token) },
    );
  }

  const email = normalizeEmail(body.email);
  if (!email.includes("@") || await rateLimited(request, env, email)) {
    return json({ error: "Email or password is incorrect." }, 401);
  }
  const key = await emailKey(email);
  const accountValue = await env.ENTITLEMENTS.get(key);
  if (!accountValue) return json({ error: "Email or password is incorrect." }, 401);

  let account;
  try {
    account = JSON.parse(accountValue);
  } catch {
    return json({ error: "Account data is unavailable." }, 503);
  }
  if (!(await verifyPassword(body.password, account.password))) {
    return json({ error: "Email or password is incorrect." }, 401);
  }
  const token = await createLoginSession(env, key);
  return json(
    { signedIn: true, email: account.email, guideAccess: account.guideIds?.includes(GUIDE_ID) || false },
    200,
    { "set-cookie": sessionCookie(token) },
  );
}

export async function onRequestDelete({ request, env }) {
  if (!env.ENTITLEMENTS) return json({ signedIn: false }, 200, { "set-cookie": clearSessionCookie() });
  const token = cookieValue(request, AUTH_COOKIE);
  if (token) await env.ENTITLEMENTS.delete(`auth-session:${token}`);
  return json({ signedIn: false }, 200, { "set-cookie": clearSessionCookie() });
}
