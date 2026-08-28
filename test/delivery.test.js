import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";

import { onRequestGet as download } from "../functions/api/download.js";
import { onRequestGet as status } from "../functions/api/status.js";
import { onRequestPost as webhook } from "../functions/api/stripe-webhook.js";

class MemoryKV {
  constructor() {
    this.values = new Map();
  }

  async put(key, value) {
    this.values.set(key, value);
  }

  async get(key) {
    return this.values.get(key) ?? null;
  }

  async delete(key) {
    this.values.delete(key);
  }
}

function signedRequest(event, secret) {
  const body = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");

  return new Request("https://example.com/api/stripe-webhook", {
    method: "POST",
    headers: { "stripe-signature": `t=${timestamp},v1=${signature}` },
    body,
  });
}

const session = {
  id: "cs_test_abc123",
  payment_link: "plink_test_allowed",
  payment_status: "paid",
  payment_intent: "pi_test_abc123",
  currency: "usd",
  amount_total: 1900,
};

test("verified payment grants status and download access", async () => {
  const kv = new MemoryKV();
  const secret = "whsec_test_example";
  const env = {
    ENTITLEMENTS: kv,
    PRODUCT_FILES: {
      async get(key) {
        assert.equal(key, "China-Supplier-Vetting-Kit-v1.0.zip");
        return {
          body: "zip",
          size: 3,
          writeHttpMetadata() {},
        };
      },
    },
    STRIPE_WEBHOOK_TEST_SECRET: secret,
    ALLOWED_PAYMENT_LINK_IDS: "plink_test_allowed",
  };

  const event = { type: "checkout.session.completed", data: { object: session } };
  const webhookResponse = await webhook({ request: signedRequest(event, secret), env });
  assert.equal(webhookResponse.status, 200);

  const statusResponse = await status({
    request: new Request("https://example.com/api/status?session_id=cs_test_abc123"),
    env,
  });
  assert.equal(statusResponse.status, 200);
  assert.deepEqual(await statusResponse.json(), { ready: true });

  const downloadResponse = await download({
    request: new Request("https://example.com/api/download?session_id=cs_test_abc123"),
    env,
  });
  assert.equal(downloadResponse.status, 200);
  assert.equal(downloadResponse.headers.get("content-type"), "application/zip");
  assert.equal(await downloadResponse.text(), "zip");
});

test("invalid signatures are rejected", async () => {
  const response = await webhook({
    request: new Request("https://example.com/api/stripe-webhook", {
      method: "POST",
      headers: { "stripe-signature": "t=1,v1=bad" },
      body: "{}",
    }),
    env: {
      ENTITLEMENTS: new MemoryKV(),
      STRIPE_WEBHOOK_TEST_SECRET: "whsec_test_example",
      ALLOWED_PAYMENT_LINK_IDS: "plink_test_allowed",
    },
  });
  assert.equal(response.status, 400);
});

test("refund events revoke an existing entitlement", async () => {
  const kv = new MemoryKV();
  await kv.put("entitlement:cs_test_abc123", "granted");
  await kv.put("payment-intent:pi_test_abc123", "cs_test_abc123");
  const secret = "whsec_test_example";
  const event = {
    type: "charge.refunded",
    data: { object: { payment_intent: "pi_test_abc123" } },
  };

  const response = await webhook({
    request: signedRequest(event, secret),
    env: {
      ENTITLEMENTS: kv,
      STRIPE_WEBHOOK_TEST_SECRET: secret,
      ALLOWED_PAYMENT_LINK_IDS: "plink_test_allowed",
    },
  });

  assert.equal(response.status, 200);
  assert.equal(await kv.get("entitlement:cs_test_abc123"), null);
  assert.equal(await kv.get("payment-intent:pi_test_abc123"), null);
});
