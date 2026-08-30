const publicAreas = {
  "nai-yang": {
    name: "Nai Yang",
    signal: "Quiet + airport",
    summary: "Late arrivals, early departures and calm-seeking travellers get a beach near Sirinat National Park without the usual airport-hotel feeling.",
    band: "฿3,000–7,500",
    mobility: "Low airport friction; plan cross-island sightseeing as a day trip.",
    fit: "Quiet stays · airport ease · slow travel",
  },
  patong: {
    name: "Patong",
    signal: "Energy + access",
    summary: "Beach, nightlife, shopping and many restaurants sit inside one busy district. It works when convenience matters more than quiet.",
    band: "฿1,100–5,800",
    mobility: "Direct Smart Bus corridor; many local trips are walkable once central.",
    fit: "Nightlife · first visits · social travel",
  },
  kata: {
    name: "Kata",
    signal: "Beach + balance",
    summary: "Couples and families get a good beach, restaurants and a calmer evening than Patong. Hills, heat and scattered entrances can make a short map distance feel longer.",
    band: "฿3,200–9,000",
    mobility: "Smart Bus corridor; check the walk from stop to lobby.",
    fit: "Families · couples · first beach stay",
  },
  "old-town": {
    name: "Phuket Old Town",
    signal: "Food + culture",
    summary: "A compact cultural base for architecture, cafés and local food. It is a strong short stay—but it is not a beach holiday outside your door.",
    band: "฿2,000–4,500",
    mobility: "Walkable core; budget separate transport for west-coast beach days.",
    fit: "Food · architecture · short stays",
  },
};

const searchRecommendations = {
  balanced: ["kata", "Kata gives a first-time visitor the cleanest balance."],
  budget: ["patong", "Patong has the broadest low-to-mid price range in this edition."],
  quiet: ["nai-yang", "Nai Yang removes airport friction and keeps the pace quiet."],
  food: ["old-town", "Phuket Old Town is the strongest base for food and local culture."],
  nightlife: ["patong", "Patong keeps nightlife, beach and dining inside one busy district."],
};

const state = { signedIn: false, guide: null, paymentSessionId: "" };
const areaReading = document.querySelector("#area-reading");
const searchAnswer = document.querySelector("#search-answer");
const paywall = document.querySelector("#guide-paywall");
const purchaseStatus = document.querySelector("#purchase-status");
const unlockedGuide = document.querySelector("#unlocked-guide");
const accountSetup = document.querySelector("#account-setup");
const premiumContent = document.querySelector("#premium-guide-content");
const authDialog = document.querySelector("#auth-dialog");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "#";
  } catch {
    return "#";
  }
}

function selectArea(areaId) {
  const area = publicAreas[areaId] || publicAreas.kata;
  document.querySelectorAll("[data-area]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.area === areaId);
  });
  areaReading.innerHTML = `
    <div class="area-reading-main">
      <p class="area-overline">CURRENT READING</p>
      <h3>${escapeHtml(area.name)} <span>${escapeHtml(area.signal)}</span></h3>
      <p>${escapeHtml(area.summary)}</p>
    </div>
    <dl>
      <div><dt>Planning band</dt><dd>${escapeHtml(area.band)}</dd></div>
      <div><dt>Mobility note</dt><dd>${escapeHtml(area.mobility)}</dd></div>
      <div><dt>Best fit</dt><dd>${escapeHtml(area.fit)}</dd></div>
    </dl>`;
}

document.querySelectorAll("[data-area]").forEach((button) => {
  button.addEventListener("click", () => selectArea(button.dataset.area));
});

document.querySelector("#destination-search")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.querySelector("#destination").value.trim().toLowerCase();
  const priority = document.querySelector("#priority").value;
  const directMatch = Object.keys(publicAreas).find((key) => {
    const terms = `${key} ${publicAreas[key].name}`.toLowerCase();
    return query && (terms.includes(query) || query.includes(publicAreas[key].name.toLowerCase()));
  });
  const phuketTerms = ["phuket", "普吉", "kata", "patong", "nai yang", "old town", "thailand", "泰国"];

  if (query && !directMatch && !phuketTerms.some((term) => query.includes(term))) {
    searchAnswer.innerHTML = `
      <span class="answer-pin" aria-hidden="true"></span>
      <div><small>EDITION 01</small><strong>That destination is not covered yet.</strong>
      <p>The first edition covers Phuket, Thailand only. New destinations will use the same area-first method.</p></div>`;
    return;
  }

  const [recommendedId, headline] = directMatch
    ? [directMatch, `${publicAreas[directMatch].name} matches the place you searched.`]
    : searchRecommendations[priority];
  const area = publicAreas[recommendedId];
  selectArea(recommendedId);
  searchAnswer.innerHTML = `
    <span class="answer-pin" aria-hidden="true"></span>
    <div><small>STARTING POINT</small><strong>${escapeHtml(headline)}</strong>
    <p>${escapeHtml(area.summary)} Planning band: ${escapeHtml(area.band)}.</p></div>`;
});

function setPurchaseStatus(message, stateName = "loading") {
  purchaseStatus.hidden = false;
  purchaseStatus.dataset.state = stateName;
  purchaseStatus.textContent = message;
}

async function responseJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function hotelCard(hotel, index) {
  return `
    <article class="hotel-card" data-hotel-area="${escapeHtml(hotel.areaId)}">
      <div class="hotel-score-panel">
        <span>HOTEL ${String(index + 1).padStart(2, "0")} · ${escapeHtml(hotel.area)}</span>
        <strong>${escapeHtml(hotel.score)}</strong>
        <small>${Number(hotel.reviewCount).toLocaleString()} verified reviews · planning ${escapeHtml(hotel.priceBand)}</small>
      </div>
      <div class="hotel-card-content">
        <div class="hotel-card-top"><h3>${escapeHtml(hotel.name)}</h3><span>VALUE ${escapeHtml(hotel.value)}/5 · QUIET ${escapeHtml(hotel.quiet)}/5</span></div>
        <div class="hotel-tags">${hotel.bestFor.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        <div class="hotel-grid-copy">
          <section><h4>Why it works</h4><p>${escapeHtml(hotel.whyItWorks)}</p></section>
          <section><h4>Review consensus</h4><p>${escapeHtml(hotel.reviewPattern)}</p></section>
          <section><h4>Watch for</h4><p>${escapeHtml(hotel.watchFor)}</p></section>
          <section><h4>Best fit</h4><p>${escapeHtml(hotel.bestFor.join(" · "))}</p></section>
        </div>
        <p class="hotel-decision">${escapeHtml(hotel.decision)}</p>
        <a class="hotel-source" href="${safeUrl(hotel.source)}" target="_blank" rel="noreferrer">Check the current public listing and reviews ↗</a>
      </div>
    </article>`;
}

function compactCard(item, type) {
  const title = type === "food" ? item.name : item.mode;
  const meta = type === "food" ? `${item.area} · ${item.type} · ${item.price}` : `${item.bestFor} · ${item.cost}`;
  const body = type === "food" ? `${item.order} ${item.reason}` : item.note;
  return `
    <article class="compact-card">
      <small>${escapeHtml(meta)}</small>
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(body)}</p>
      <a href="${safeUrl(item.source)}" target="_blank" rel="noreferrer">Source ↗</a>
    </article>`;
}

function renderGuide(guide) {
  state.guide = guide;
  paywall.hidden = true;
  unlockedGuide.hidden = false;
  document.querySelector("#guide-meta").textContent = `${guide.meta.edition} · evidence reviewed ${guide.meta.reviewedOn} · ${guide.meta.notice}`;
  const filters = [
    ["all", "All 6"],
    ["patong", "Patong"],
    ["kata", "Kata"],
    ["old-town", "Old Town"],
    ["nai-yang", "Nai Yang"],
  ];

  premiumContent.innerHTML = `
    <div class="premium-toolbar" aria-label="Filter hotel shortlist">
      ${filters.map(([id, label], index) => `<button type="button" class="${index === 0 ? "is-active" : ""}" data-hotel-filter="${id}">${label}</button>`).join("")}
    </div>
    <div class="hotel-stack">${guide.hotels.map(hotelCard).join("")}</div>
    <section class="guide-subsection">
      <h3>Eat with a reason</h3>
      <div class="compact-cards">${guide.food.map((item) => compactCard(item, "food")).join("")}</div>
    </section>
    <section class="guide-subsection">
      <h3>Move without wasting the day</h3>
      <div class="compact-cards">${guide.transport.map((item) => compactCard(item, "transport")).join("")}</div>
    </section>
    <section class="guide-subsection">
      <h3>A low-friction three-day shape</h3>
      <div class="itinerary-line">${guide.itinerary.map((item) => `
        <article><span>${escapeHtml(item.day)}</span><h4>${escapeHtml(item.theme)}</h4><p>${escapeHtml(item.plan)}</p></article>`).join("")}</div>
    </section>`;

  premiumContent.querySelectorAll("[data-hotel-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.hotelFilter;
      premiumContent.querySelectorAll("[data-hotel-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
      premiumContent.querySelectorAll("[data-hotel-area]").forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.hotelArea !== filter;
      });
    });
  });
}

async function loadGuide(sessionId = "", retry = false) {
  const query = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "";
  const attempts = retry ? 12 : 1;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(`/api/guide${query}`, { credentials: "same-origin", cache: "no-store" });
      const result = await responseJson(response);
      if (response.ok && result.guide) {
        renderGuide(result.guide);
        purchaseStatus.hidden = true;
        if (result.access === "purchase" && !state.signedIn) accountSetup.hidden = false;
        return true;
      }
      if (response.status !== 425 || !retry) {
        if (sessionId) setPurchaseStatus(result.error || "We could not verify this purchase.", "error");
        return false;
      }
    } catch {
      if (!retry) return false;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 1500));
  }
  setPurchaseStatus("Payment confirmation is taking longer than expected. Reload this page in a minute or contact support with the receipt email.", "error");
  return false;
}

function updateAccountButtons() {
  document.querySelectorAll("[data-open-auth]").forEach((button) => {
    button.textContent = state.signedIn ? "Sign out" : (button.classList.contains("returning-link") ? "Already purchased? Sign in" : "Sign in");
  });
}

async function checkAccount() {
  try {
    const response = await fetch("/api/account", { credentials: "same-origin", cache: "no-store" });
    if (!response.ok) return false;
    const result = await responseJson(response);
    state.signedIn = Boolean(result.signedIn);
    updateAccountButtons();
    if (result.guideAccess) return loadGuide();
  } catch {
    // The free visitor experience remains available if account services are temporarily unreachable.
  }
  return false;
}

document.querySelectorAll("[data-open-auth]").forEach((button) => {
  button.addEventListener("click", async () => {
    if (state.signedIn) {
      await fetch("/api/account", { method: "DELETE", credentials: "same-origin" });
      window.location.assign("/");
      return;
    }
    authDialog.showModal();
  });
});

document.querySelector("[data-close-auth]")?.addEventListener("click", () => authDialog.close());
authDialog?.addEventListener("click", (event) => {
  if (event.target === authDialog) authDialog.close();
});

document.querySelector("#login-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = form.querySelector("[data-login-message]");
  message.textContent = "Checking your account…";
  const values = new FormData(form);
  try {
    const response = await fetch("/api/account", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "login", email: values.get("email"), password: values.get("password") }),
    });
    const result = await responseJson(response);
    if (!response.ok) {
      message.textContent = result.error || "Sign-in failed.";
      return;
    }
    state.signedIn = true;
    updateAccountButtons();
    authDialog.close();
    await loadGuide();
    document.querySelector("#guide")?.scrollIntoView({ behavior: "smooth" });
  } catch {
    message.textContent = "The account service is temporarily unavailable.";
  }
});

document.querySelector("#register-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const password = String(values.get("password") || "");
  const confirmPassword = String(values.get("confirmPassword") || "");
  const message = form.querySelector("[data-register-message]");
  if (password !== confirmPassword) {
    message.textContent = "The two passwords do not match.";
    return;
  }
  message.textContent = "Creating your account…";
  try {
    const response = await fetch("/api/account", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "register", sessionId: state.paymentSessionId, password }),
    });
    const result = await responseJson(response);
    if (!response.ok) {
      message.textContent = result.error || "Account creation failed.";
      return;
    }
    state.signedIn = true;
    accountSetup.hidden = true;
    updateAccountButtons();
    history.replaceState({}, "", "/#guide");
  } catch {
    message.textContent = "The account service is temporarily unavailable.";
  }
});

async function initializeAccess() {
  const sessionId = new URLSearchParams(window.location.search).get("session_id") || "";
  state.paymentSessionId = /^cs_(?:(?:test|live)_)?[A-Za-z0-9]+$/.test(sessionId) ? sessionId : "";
  await checkAccount();
  if (state.paymentSessionId) {
    setPurchaseStatus("Payment received. Preparing your permanent reading access…");
    await loadGuide(state.paymentSessionId, true);
  }
}

initializeAccess();
