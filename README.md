# Supplier Vetting Lab

Public product page and secure post-payment delivery flow for the China Supplier Vetting Kit.

The paid product files are intentionally not included in this repository. Only public marketing assets, policy pages, and the payment-verification code are published.

## Public acquisition pages

- `/` includes the no-email five-point deposit gate and interactive product demonstration.
- `/alibaba-supplier-red-flags/` answers a high-intent supplier-risk question.
- `/supplier-bank-beneficiary-check/` provides a payment-identity decision path.
- `/landed-cost-calculator/` provides a browser-only landed-cost estimator.
- `/sitemap.xml` and `/robots.txt` expose the public discovery surface to search engines.

Payment links use page-specific `client_reference_id` values so completed purchases can be attributed to the originating guide or call to action.

## Cloudflare Pages bindings

The Pages project requires these production bindings before checkout is enabled:

- KV namespace binding: `ENTITLEMENTS`
- R2 bucket binding: `PRODUCT_FILES`
- Secret: `STRIPE_WEBHOOK_TEST_SECRET` (test endpoint signing secret)
- Secret: `STRIPE_WEBHOOK_LIVE_SECRET` (live endpoint signing secret; add before launch)
- Backward-compatible optional secret: `STRIPE_WEBHOOK_SECRETS` (comma-separated endpoint secrets)
- Variable: `ALLOWED_PAYMENT_LINK_IDS` (comma-separated test/live Payment Link IDs)
- Variable: `PRODUCT_OBJECT_KEY=China-Supplier-Vetting-Kit-v1.2.zip`
- Variable: `PRODUCT_DOWNLOAD_NAME=China-Supplier-Vetting-Kit-v1.2.zip`

Configure Stripe to send `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, and `charge.refunded` to:

`https://supplier-vetting-lab.pages.dev/api/stripe-webhook`

Set each Payment Link's post-payment redirect to:

`https://supplier-vetting-lab.pages.dev/delivery.html?session_id={CHECKOUT_SESSION_ID}`

Before changing payment or delivery code, run `npm test` and complete a Stripe sandbox download check.
