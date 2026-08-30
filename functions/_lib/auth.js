const encoder = new TextEncoder();

export const GUIDE_ID = "phuket-2026-v1";
export const AUTH_COOKIE = "driftwise_session";

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlToBytes(value) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function sha256(value) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

export function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export async function emailKey(email) {
  return `account:${bytesToBase64Url(await sha256(normalizeEmail(email)))}`;
}

export async function passwordRecord(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hash = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: 120000 },
    keyMaterial,
    256,
  ));
  return { salt: bytesToBase64Url(salt), hash: bytesToBase64Url(hash), iterations: 120000 };
}

export async function verifyPassword(password, record) {
  if (!record?.salt || !record?.hash || !record?.iterations) return false;
  const salt = base64UrlToBytes(record.salt);
  const expected = base64UrlToBytes(record.hash);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const actual = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: record.iterations },
    keyMaterial,
    expected.length * 8,
  ));
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) {
    difference |= actual[index] ^ expected[index];
  }
  return difference === 0;
}

export function validPassword(password) {
  return typeof password === "string" && password.length >= 10 && password.length <= 128;
}

export function cookieValue(request, name) {
  const cookies = request.headers.get("cookie") || "";
  for (const part of cookies.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return "";
}

export function sessionCookie(token) {
  return `${AUTH_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`;
}

export function clearSessionCookie() {
  return `${AUTH_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function createLoginSession(env, accountKeyValue) {
  const token = bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32)));
  await env.ENTITLEMENTS.put(
    `auth-session:${token}`,
    JSON.stringify({ accountKey: accountKeyValue, createdAt: new Date().toISOString() }),
    { expirationTtl: 60 * 60 * 24 * 365 },
  );
  return token;
}

export async function currentAccount(request, env) {
  const token = cookieValue(request, AUTH_COOKIE);
  if (!token || !env.ENTITLEMENTS) return null;
  const sessionValue = await env.ENTITLEMENTS.get(`auth-session:${token}`);
  if (!sessionValue) return null;
  try {
    const session = JSON.parse(sessionValue);
    const accountValue = await env.ENTITLEMENTS.get(session.accountKey);
    if (!accountValue) return null;
    return { token, key: session.accountKey, account: JSON.parse(accountValue) };
  } catch {
    return null;
  }
}

export async function hasGuideAccess(request, env, sessionId = "") {
  if (/^cs_(?:(?:test|live)_)?[A-Za-z0-9]+$/.test(sessionId)) {
    const value = await env.ENTITLEMENTS.get(`entitlement:${sessionId}`);
    if (value) {
      try {
        const entitlement = JSON.parse(value);
        if (entitlement?.product?.guideId === GUIDE_ID) {
          return { allowed: true, source: "purchase", entitlement };
        }
      } catch {
        return { allowed: false };
      }
    }
  }

  const signedIn = await currentAccount(request, env);
  if (signedIn?.account?.guideIds?.includes(GUIDE_ID)) {
    return { allowed: true, source: "account", account: signedIn.account };
  }
  return { allowed: false };
}
