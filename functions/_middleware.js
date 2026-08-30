const OLD_HOST = "supplier-vetting-lab.pages.dev";
const NEW_ORIGIN = "https://driftwise-travel.pages.dev";
const COMPATIBILITY_PATHS = new Set(["/api/stripe-webhook"]);

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === OLD_HOST && !COMPATIBILITY_PATHS.has(url.pathname)) {
    return Response.redirect(`${NEW_ORIGIN}${url.pathname}${url.search}`, 301);
  }

  return context.next();
}
