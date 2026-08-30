import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";

import { onRequestGet as download } from "../functions/api/download.js";
import { onRequestGet as status } from "../functions/api/status.js";
import { onRequestPost as webhook } from "../functions/api/stripe-webhook.js";
import {
  onRequestGet as accountStatus,
  onRequestPost as accountAction,
} from "../functions/api/account.js";
import { onRequestGet as guide } from "../functions/api/guide.js";

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
  amount_total: 100,
};

test("verified payment grants status and download access", async () => {
  const kv = new MemoryKV();
  const secret = "whsec_test_example";
  const env = {
    ENTITLEMENTS: kv,
    PRODUCT_FILES: {
      async get(key) {
        assert.equal(key, "presentation-backgrounds/01-photorealistic-procurement.png");
        return {
          body: "png",
          size: 3,
          writeHttpMetadata() {},
        };
      },
    },
    STRIPE_WEBHOOK_TEST_SECRET: secret,
    PRODUCT_CATALOG: JSON.stringify({
      plink_test_allowed: {
        amount: 100,
        objectKey: "presentation-backgrounds/01-photorealistic-procurement.png",
        filename: "Supplier-Vetting-Background-01.png",
        contentType: "image/png",
        label: "Photorealistic procurement background",
      },
    }),
  };

  const event = { type: "checkout.session.completed", data: { object: session } };
  const webhookResponse = await webhook({ request: signedRequest(event, secret), env });
  assert.equal(webhookResponse.status, 200);

  const statusResponse = await status({
    request: new Request("https://example.com/api/status?session_id=cs_test_abc123"),
    env,
  });
  assert.equal(statusResponse.status, 200);
  assert.deepEqual(await statusResponse.json(), {
    ready: true,
    productName: "Photorealistic procurement background",
  });

  const downloadResponse = await download({
    request: new Request("https://example.com/api/download?session_id=cs_test_abc123"),
    env,
  });
  assert.equal(downloadResponse.status, 200);
  assert.equal(downloadResponse.headers.get("content-type"), "image/png");
  assert.equal(
    downloadResponse.headers.get("content-disposition"),
    'attachment; filename="Supplier-Vetting-Background-01.png"',
  );
  assert.equal(await downloadResponse.text(), "png");
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
      PRODUCT_CATALOG: JSON.stringify({ plink_test_allowed: { amount: 100 } }),
    },
  });
  assert.equal(response.status, 400);
});

test("an unexpected amount never grants download access", async () => {
  const kv = new MemoryKV();
  const secret = "whsec_test_example";
  const event = {
    type: "checkout.session.completed",
    data: { object: { ...session, amount_total: 50 } },
  };

  const response = await webhook({
    request: signedRequest(event, secret),
    env: {
      ENTITLEMENTS: kv,
      STRIPE_WEBHOOK_TEST_SECRET: secret,
      PRODUCT_CATALOG: JSON.stringify({
        plink_test_allowed: {
          amount: 100,
          objectKey: "01-photorealistic-procurement.png",
          filename: "Supplier-Vetting-Background-01.png",
        },
      }),
    },
  });

  assert.equal(response.status, 200);
  assert.equal(await kv.get("entitlement:cs_test_abc123"), null);
});

test("a second catalog product is delivered from its own R2 object", async () => {
  const kv = new MemoryKV();
  const secret = "whsec_test_example";
  const bundleSession = {
    ...session,
    id: "cs_test_bundle123",
    payment_link: "plink_test_bundle",
    amount_total: 200,
    payment_intent: "pi_test_bundle123",
  };
  const env = {
    ENTITLEMENTS: kv,
    PRODUCT_FILES: {
      async get(key) {
        assert.equal(key, "Supplier-Vetting-Presentation-Background-Pack-v1.0.zip");
        return { body: "zip", size: 3, writeHttpMetadata() {} };
      },
    },
    STRIPE_WEBHOOK_TEST_SECRET: secret,
    PRODUCT_CATALOG: JSON.stringify({
      plink_test_bundle: {
        amount: 200,
        objectKey: "Supplier-Vetting-Presentation-Background-Pack-v1.0.zip",
        filename: "Supplier-Vetting-Presentation-Background-Pack-v1.0.zip",
        contentType: "application/zip",
        label: "Sourcing Presentation Background Pack",
      },
    }),
  };

  const event = { type: "checkout.session.completed", data: { object: bundleSession } };
  assert.equal((await webhook({ request: signedRequest(event, secret), env })).status, 200);

  const response = await download({
    request: new Request("https://example.com/api/download?session_id=cs_test_bundle123"),
    env,
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/zip");
  assert.equal(await response.text(), "zip");
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
      PRODUCT_CATALOG: JSON.stringify({ plink_test_allowed: { amount: 100 } }),
    },
  });

  assert.equal(response.status, 200);
  assert.equal(await kv.get("entitlement:cs_test_abc123"), null);
  assert.equal(await kv.get("payment-intent:pi_test_abc123"), null);
});

test("a paid travel guide can be read, registered, and reopened from an account", async () => {
  const kv = new MemoryKV();
  const secret = "whsec_test_example";
  const guideSession = {
    ...session,
    id: "cs_test_phuket123",
    payment_link: "plink_test_phuket",
    amount_total: 200,
    payment_intent: "pi_test_phuket123",
    customer_details: { email: "reader@example.com" },
  };
  const guideData = {
    meta: { id: "phuket-2026-v1", title: "Phuket Stay & Eat Brief" },
    hotels: [],
  };
  const env = {
    ENTITLEMENTS: kv,
    PRODUCT_FILES: {
      async get(key) {
        assert.equal(key, "Phuket-Travel-Brief-v1.json");
        return { async text() { return JSON.stringify(guideData); } };
      },
    },
    STRIPE_WEBHOOK_TEST_SECRET: secret,
    PRODUCT_CATALOG: JSON.stringify({
      plink_test_phuket: {
        amount: 200,
        objectKey: "Phuket-Travel-Brief-v1.json",
        filename: "Phuket-Travel-Brief-v1.json",
        contentType: "application/json",
        label: "Phuket Stay & Eat Brief — 2026",
        guideId: "phuket-2026-v1",
        accessType: "guide",
      },
    }),
  };

  const paidEvent = { type: "checkout.session.completed", data: { object: guideSession } };
  assert.equal((await webhook({ request: signedRequest(paidEvent, secret), env })).status, 200);

  const paidGuide = await guide({
    request: new Request("https://example.com/api/guide?session_id=cs_test_phuket123"),
    env,
  });
  assert.equal(paidGuide.status, 200);
  assert.deepEqual((await paidGuide.json()).guide, guideData);

  const registration = await accountAction({
    request: new Request("https://example.com/api/account", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "register",
        sessionId: "cs_test_phuket123",
        password: "a-long-reader-password",
      }),
    }),
    env,
  });
  assert.equal(registration.status, 201);
  const cookie = registration.headers.get("set-cookie").split(";")[0];

  const signedIn = await accountStatus({
    request: new Request("https://example.com/api/account", { headers: { cookie } }),
    env,
  });
  assert.deepEqual(await signedIn.json(), {
    signedIn: true,
    email: "reader@example.com",
    guideAccess: true,
  });

  const accountGuide = await guide({
    request: new Request("https://example.com/api/guide", { headers: { cookie } }),
    env,
  });
  assert.equal(accountGuide.status, 200);
  assert.equal((await accountGuide.json()).access, "account");
});

test("a paid Bangkok guide uses its fixed R2 object and persists on its own account", async () => {
  const kv = new MemoryKV();
  const secret = "whsec_test_example";
  const bangkokSession = {
    ...session,
    id: "cs_test_bangkok123",
    payment_link: "plink_test_bangkok",
    amount_total: 200,
    payment_intent: "pi_test_bangkok123",
    customer_details: { email: "bangkok-reader@example.com" },
  };
  const guideData = {
    meta: { id: "bangkok-2026-v1", title: "Bangkok Stay, Eat & Move Brief" },
    areas: [],
  };
  const requestedObjects = [];
  const env = {
    ENTITLEMENTS: kv,
    PRODUCT_FILES: {
      async get(key) {
        requestedObjects.push(key);
        if (key !== "Bangkok-Travel-Brief-v1.json") return null;
        return { async text() { return JSON.stringify(guideData); } };
      },
    },
    STRIPE_WEBHOOK_TEST_SECRET: secret,
    PRODUCT_CATALOG: JSON.stringify({
      plink_test_bangkok: {
        amount: 200,
        objectKey: "Bangkok-Travel-Brief-v1.json",
        filename: "Bangkok-Travel-Brief-v1.json",
        contentType: "application/json",
        label: "Bangkok Stay, Eat & Move Brief — 2026",
        guideId: "bangkok-2026-v1",
        accessType: "guide",
      },
    }),
  };

  const paidEvent = { type: "checkout.session.completed", data: { object: bangkokSession } };
  assert.equal((await webhook({ request: signedRequest(paidEvent, secret), env })).status, 200);

  const paidGuide = await guide({
    request: new Request(
      "https://example.com/api/guide?guide_id=bangkok-2026-v1&session_id=cs_test_bangkok123",
    ),
    env,
  });
  assert.equal(paidGuide.status, 200);
  assert.deepEqual((await paidGuide.json()).guide, guideData);
  assert.deepEqual(requestedObjects, ["Bangkok-Travel-Brief-v1.json"]);

  const wrongGuide = await guide({
    request: new Request("https://example.com/api/guide?session_id=cs_test_bangkok123"),
    env,
  });
  assert.equal(wrongGuide.status, 425);
  assert.deepEqual(requestedObjects, ["Bangkok-Travel-Brief-v1.json"]);

  const registration = await accountAction({
    request: new Request("https://example.com/api/account", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "register",
        sessionId: "cs_test_bangkok123",
        password: "a-long-bangkok-password",
      }),
    }),
    env,
  });
  assert.equal(registration.status, 201);
  const cookie = registration.headers.get("set-cookie").split(";")[0];

  const bangkokAccount = await accountStatus({
    request: new Request("https://example.com/api/account?guide_id=bangkok-2026-v1", {
      headers: { cookie },
    }),
    env,
  });
  assert.deepEqual(await bangkokAccount.json(), {
    signedIn: true,
    email: "bangkok-reader@example.com",
    guideAccess: true,
  });

  const phuketAccount = await accountStatus({
    request: new Request("https://example.com/api/account", { headers: { cookie } }),
    env,
  });
  assert.deepEqual(await phuketAccount.json(), {
    signedIn: true,
    email: "bangkok-reader@example.com",
    guideAccess: false,
  });

  const accountGuide = await guide({
    request: new Request("https://example.com/api/guide?guide_id=bangkok-2026-v1", {
      headers: { cookie },
    }),
    env,
  });
  assert.equal(accountGuide.status, 200);
  assert.equal((await accountGuide.json()).access, "account");
});

test("guide access rejects unauthorised and unknown guide requests before R2", async () => {
  let objectReads = 0;
  const env = {
    ENTITLEMENTS: new MemoryKV(),
    PRODUCT_FILES: {
      async get() {
        objectReads += 1;
        throw new Error("R2 should not be read");
      },
    },
  };

  const unauthorized = await guide({
    request: new Request("https://example.com/api/guide?guide_id=bangkok-2026-v1"),
    env,
  });
  assert.equal(unauthorized.status, 401);

  const unknown = await guide({
    request: new Request(
      "https://example.com/api/guide?guide_id=Bangkok-Travel-Brief-v1.json&session_id=cs_test_abc123",
    ),
    env,
  });
  assert.equal(unknown.status, 404);
  assert.deepEqual(await unknown.json(), { error: "Unknown guide." });

  const inheritedName = await guide({
    request: new Request("https://example.com/api/guide?guide_id=toString"),
    env,
  });
  assert.equal(inheritedName.status, 404);
  assert.equal(objectReads, 0);
});

test("the webhook does not grant an unlisted guide id", async () => {
  const kv = new MemoryKV();
  const secret = "whsec_test_example";
  const event = {
    type: "checkout.session.completed",
    data: {
      object: {
        ...session,
        id: "cs_test_unknown123",
        payment_link: "plink_test_unknown",
        payment_intent: "pi_test_unknown123",
      },
    },
  };
  const response = await webhook({
    request: signedRequest(event, secret),
    env: {
      ENTITLEMENTS: kv,
      STRIPE_WEBHOOK_TEST_SECRET: secret,
      PRODUCT_CATALOG: JSON.stringify({
        plink_test_unknown: {
          amount: 100,
          objectKey: "Private-Object.json",
          filename: "Private-Object.json",
          guideId: "unlisted-guide",
          accessType: "guide",
        },
      }),
    },
  });

  assert.equal(response.status, 200);
  assert.equal(await kv.get("entitlement:cs_test_unknown123"), null);
});
