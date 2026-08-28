const statusElement = document.querySelector("#delivery-status");
const downloadLink = document.querySelector("#download-link");
const sessionId = new URLSearchParams(window.location.search).get("session_id") || "";

const validSessionId = /^cs_(?:(?:test|live)_)?[A-Za-z0-9]+$/.test(sessionId);

function showError(message) {
  statusElement.textContent = message;
  statusElement.dataset.state = "error";
}

async function waitForEntitlement() {
  if (!validSessionId) {
    showError("This download link is missing a valid order reference.");
    return;
  }

  const encodedSessionId = encodeURIComponent(sessionId);
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      const response = await fetch(`/api/status?session_id=${encodedSessionId}`, {
        credentials: "same-origin",
        cache: "no-store",
      });
      const result = await response.json();

      if (response.ok && result.ready) {
        statusElement.textContent = "Payment confirmed. Your download is ready.";
        statusElement.dataset.state = "ready";
        downloadLink.href = `/api/download?session_id=${encodedSessionId}`;
        downloadLink.hidden = false;
        return;
      }

      if (response.status >= 400 && response.status !== 425) {
        showError("We could not verify this order. Please contact support with your receipt.");
        return;
      }
    } catch {
      // A short network interruption should not strand a paid customer.
    }

    await new Promise((resolve) => window.setTimeout(resolve, 1500));
  }

  showError("Payment confirmation is taking longer than expected. Reload this page in a minute, or contact support with your receipt.");
}

waitForEntitlement();
