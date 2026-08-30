# Driftwise / Supplier Vetting Lab

Public product pages, private guide access, and secure post-payment delivery for the Driftwise travel brief and the Presentation Background collection.

The paid product files are intentionally not included in this repository. Only public marketing assets, policy pages, and the payment-verification code are published.

## Public acquisition pages

- `/` is the Phuket travel-review landing page, free area matcher, account entry, and paid in-browser guide.
- `/presentation-backgrounds/` sells individually downloadable PNG backgrounds and a six-image business bundle with an editable PowerPoint template.
- `/sitemap.xml` and `/robots.txt` expose the public discovery surface to search engines.

Payment links use page-specific `client_reference_id` values so completed purchases can be attributed to the originating guide or call to action.

## Cloudflare Pages bindings

The Pages project requires these production bindings before checkout is enabled:

- KV namespace binding: `ENTITLEMENTS`
- R2 bucket binding: `PRODUCT_FILES`
- Secret: `STRIPE_WEBHOOK_TEST_SECRET` (test endpoint signing secret)
- Secret: `STRIPE_WEBHOOK_LIVE_SECRET` (live endpoint signing secret; add before launch)
- Backward-compatible optional secret: `STRIPE_WEBHOOK_SECRETS` (comma-separated endpoint secrets)
- Variable: `PRODUCT_CATALOG` (JSON object keyed by trusted Payment Link ID)

Each catalog entry contains the exact amount in cents and the R2 object delivered after payment:

```json
{
  "plink_example": {
    "amount": 100,
    "objectKey": "01-photorealistic-procurement.png",
    "filename": "Supplier-Vetting-Background-01-Procurement-Desk.png",
    "contentType": "image/png",
    "label": "Procurement Desk background"
  }
}
```

The webhook grants access only when the signed checkout session's Payment Link, USD currency, paid state, and exact amount all match the trusted catalog. Product files remain private in R2. Downloads are returned through `/api/download`; the Phuket guide is returned through `/api/guide` after a valid purchase session or account login.

Guide purchasers can register from the completed-payment URL. Passwords are PBKDF2-hashed, account entitlements do not expire, and sign-in sessions use secure HTTP-only cookies.

Configure Stripe to send `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, and `charge.refunded` to:

`https://supplier-vetting-lab.pages.dev/api/stripe-webhook`

Set each Payment Link's post-payment redirect to:

`https://supplier-vetting-lab.pages.dev/delivery.html?session_id={CHECKOUT_SESSION_ID}`

Before changing payment or delivery code, run `npm test` and complete a Stripe sandbox download check.
