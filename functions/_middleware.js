const OLD_HOST = "supplier-vetting-lab.pages.dev";
const NEW_ORIGIN = "https://driftwise-travel.pages.dev";
const OLD_SCENIC_PATH = "/presentation-backgrounds";
const NEW_SCENIC_PATH = "/phuket-scenic-studio";
const COMPATIBILITY_PATHS = new Set(["/api/stripe-webhook"]);

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.pathname === OLD_SCENIC_PATH || url.pathname.startsWith(`${OLD_SCENIC_PATH}/`)) {
    const suffix = url.pathname.slice(OLD_SCENIC_PATH.length);
    return Response.redirect(`${NEW_ORIGIN}${NEW_SCENIC_PATH}${suffix}${url.search}`, 301);
  }

  if (url.hostname === OLD_HOST && !COMPATIBILITY_PATHS.has(url.pathname)) {
    return Response.redirect(`${NEW_ORIGIN}${url.pathname}${url.search}`, 301);
  }

  return context.next();
}
