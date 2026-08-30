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

const state = { signedIn: false, guide: null, paymentSessionId: "", currency: "THB", areaFilter: "all", lensFilter: "all" };
const currencyDefinitions = [
  { code: "THB", country: "Thailand", prefix: "฿", thbPerUnit: 1 },
  { code: "CNY", country: "China", prefix: "¥", legacyRate: "thbPerCny" },
  { code: "USD", country: "United States", prefix: "US$", legacyRate: "thbPerUsd" },
  { code: "HKD", country: "Hong Kong", prefix: "HK$" },
  { code: "SGD", country: "Singapore", prefix: "S$" },
  { code: "EUR", country: "Eurozone", prefix: "€" },
  { code: "GBP", country: "United Kingdom", prefix: "£" },
  { code: "AUD", country: "Australia", prefix: "A$" },
  { code: "JPY", country: "Japan", prefix: "JP¥" },
  { code: "MYR", country: "Malaysia", prefix: "RM" },
  { code: "CAD", country: "Canada", prefix: "CA$" },
];
const publicFx = {
  asOf: "2026-08-28",
  rates: {
    USD: { thbPerUnit: 32.9197 }, CNY: { thbPerUnit: 4.8986 }, HKD: { thbPerUnit: 4.2 },
    SGD: { thbPerUnit: 25.9143 }, EUR: { thbPerUnit: 38.3426 }, GBP: { thbPerUnit: 44.7439 },
    AUD: { thbPerUnit: 23.6762 }, JPY: { thbPerUnit: 0.206613 }, MYR: { thbPerUnit: 8.1858 },
    CAD: { thbPerUnit: 23.7244 },
  },
};
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

function moneyValue(thb, currency, fx) {
  const amount = Number(thb);
  if (!Number.isFinite(amount)) return "—";
  const definition = currencyDefinitions.find((item) => item.code === currency) || currencyDefinitions[0];
  const rate = definition.thbPerUnit
    || Number(fx?.rates?.[currency]?.thbPerUnit)
    || Number(definition.legacyRate && fx?.[definition.legacyRate]);
  if (!Number.isFinite(rate) || rate <= 0) return `฿${Math.round(amount).toLocaleString()}`;
  return `${definition.prefix}${Math.round(amount / rate).toLocaleString()}`;
}

function priceBand(hotel, currency, fx) {
  if (!hotel.priceThb || !fx) return hotel.priceBand;
  return `${moneyValue(hotel.priceThb.low, currency, fx)}–${moneyValue(hotel.priceThb.high, currency, fx)}`;
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

const fxAmount = document.querySelector("#fx-amount");
const fxOutput = document.querySelector("#fx-output");
function updateFxPreview() {
  if (!fxAmount || !fxOutput) return;
  const thb = Math.max(0, Number(fxAmount.value) || 0);
  const currency = state.previewCurrency || "CNY";
  const definition = currencyDefinitions.find((item) => item.code === currency) || currencyDefinitions[1];
  fxOutput.innerHTML = `<strong>≈ ${escapeHtml(moneyValue(thb, currency, publicFx))}</strong><span>${escapeHtml(definition.country)} · ${escapeHtml(currency)} · rate dated ${escapeHtml(publicFx.asOf)}</span>`;
}
document.querySelector("#fx-calculator")?.addEventListener("submit", (event) => event.preventDefault());
fxAmount?.addEventListener("input", updateFxPreview);
document.querySelectorAll("[data-fx-currency]").forEach((button) => {
  button.addEventListener("click", () => {
    state.previewCurrency = button.dataset.fxCurrency;
    document.querySelectorAll("[data-fx-currency]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    updateFxPreview();
  });
});
updateFxPreview();

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

function hotelCard(hotel, index, currency, fx) {
  return `
    <article class="hotel-card" data-hotel-area="${escapeHtml(hotel.areaId)}" data-hotel-lenses="${escapeHtml((hotel.lenses || []).join(" "))}">
      <div class="hotel-score-panel">
        <span>HOTEL ${String(index + 1).padStart(2, "0")} · ${escapeHtml(hotel.area)}</span>
        <strong>${escapeHtml(hotel.score)}</strong>
        <small>${Number(hotel.reviewCount).toLocaleString()} verified reviews</small>
        <b>${escapeHtml(priceBand(hotel, currency, fx))}<em> planning range</em></b>
      </div>
      <div class="hotel-card-content">
        <div class="hotel-card-top"><h3>${escapeHtml(hotel.name)}</h3><span>VALUE ${escapeHtml(hotel.value)}/5 · QUIET ${escapeHtml(hotel.quiet)}/5</span></div>
        <div class="hotel-tags">${hotel.bestFor.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        <div class="hotel-grid-copy">
          <section><h4>Why it works</h4><p>${escapeHtml(hotel.whyItWorks)}</p></section>
          <section><h4>Review consensus</h4><p>${escapeHtml(hotel.reviewPattern)}</p></section>
          <section><h4>Watch for</h4><p>${escapeHtml(hotel.watchFor)}</p></section>
          <section><h4>Beach proximity</h4><p>${escapeHtml(hotel.beachProximity || "Confirm the current route on the live listing.")}</p></section>
          <section><h4>Value move</h4><p>${escapeHtml(hotel.valueMove || "Compare the final room, tax and cancellation terms for your exact dates.")}</p></section>
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

function beachCard(beach, hotelsById) {
  const nearby = (beach.nearbyHotelIds || []).map((id) => hotelsById.get(id)?.name).filter(Boolean);
  return `
    <article class="beach-match-card">
      <small>BEACH / AREA MATCH</small>
      <h4>${escapeHtml(beach.name)}</h4>
      <p>${escapeHtml(beach.bestFor)}</p>
      <dl>
        <div><dt>Shortlist nearby</dt><dd>${escapeHtml(nearby.length ? nearby.join(" · ") : "No named hotel in this edition")}</dd></div>
        <div><dt>Reality check</dt><dd>${escapeHtml(beach.watchFor)}</dd></div>
      </dl>
    </article>`;
}

function applyHotelFilters() {
  premiumContent.querySelectorAll("[data-hotel-area]").forEach((card) => {
    const areaMatch = state.areaFilter === "all" || card.dataset.hotelArea === state.areaFilter;
    const lensMatch = state.lensFilter === "all" || card.dataset.hotelLenses.split(" ").includes(state.lensFilter);
    card.hidden = !(areaMatch && lensMatch);
  });
}

function renderGuide(guide) {
  state.guide = guide;
  paywall.hidden = true;
  unlockedGuide.hidden = false;
  document.querySelector("#guide-meta").textContent = `${guide.meta.edition} · evidence reviewed ${guide.meta.reviewedOn} · ${guide.meta.notice}`;
  const areaFilters = [
    ["all", "All 6"],
    ["patong", "Patong"],
    ["kata", "Kata"],
    ["old-town", "Old Town"],
    ["nai-yang", "Nai Yang"],
  ];
  const lensFilters = [
    ["all", "Any trip"],
    ["beach", "Beach nearby"],
    ["value", "Better value"],
    ["quiet", "Quieter stay"],
    ["family", "Family ease"],
  ];
  const fx = guide.meta.fx || publicFx;
  const hotelsById = new Map(guide.hotels.map((hotel) => [hotel.id, hotel]));

  premiumContent.innerHTML = `
    <div class="premium-controls">
      <div><span class="toolbar-label">Area</span><div class="premium-toolbar" aria-label="Filter hotel shortlist by area">
        ${areaFilters.map(([id, label]) => `<button type="button" class="${state.areaFilter === id ? "is-active" : ""}" data-area-filter="${id}">${label}</button>`).join("")}
      </div></div>
      <div><span class="toolbar-label">What matters</span><div class="premium-toolbar" aria-label="Filter hotel shortlist by trip priority">
        ${lensFilters.map(([id, label]) => `<button type="button" class="${state.lensFilter === id ? "is-active" : ""}" data-lens-filter="${id}">${label}</button>`).join("")}
      </div></div>
      <div><span class="toolbar-label">Planning currency</span><div class="currency-switch" aria-label="Show planning ranges in another currency">
        ${currencyDefinitions.map(({ code, country }) => `<button type="button" class="${state.currency === code ? "is-active" : ""}" data-currency="${code}" aria-label="Show prices in ${escapeHtml(country)} ${code}">${code}</button>`).join("")}
      </div></div>
    </div>
    <p class="fx-note">Approximate middle-rate conversion dated ${escapeHtml(fx.asOf)} from <a href="${safeUrl(fx.source)}" target="_blank" rel="noreferrer">${escapeHtml(fx.sourceLabel || "the published exchange-rate source")} ↗</a>. Your bank or card rate will differ.</p>
    <section class="guide-subsection beach-match-section">
      <h3>Start with the beach or area</h3>
      <p class="subsection-intro">Nearby means practical fit, not a guarantee of a direct entrance. Confirm the current walking route and property access before booking.</p>
      <div class="beach-match-grid">${(guide.beaches || []).map((beach) => beachCard(beach, hotelsById)).join("")}</div>
    </section>
    <section class="guide-subsection hotel-decision-section">
      <h3>Compare the stay—not just the score</h3>
      <p class="subsection-intro">“Better value” is an editorial comparison of fit, review pattern and planning band. It is not a live discount or promotion.</p>
      <div class="hotel-stack">${guide.hotels.map((hotel, index) => hotelCard(hotel, index, state.currency, fx)).join("")}</div>
    </section>
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

  premiumContent.querySelectorAll("[data-area-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.areaFilter = button.dataset.areaFilter;
      premiumContent.querySelectorAll("[data-area-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
      applyHotelFilters();
    });
  });
  premiumContent.querySelectorAll("[data-lens-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lensFilter = button.dataset.lensFilter;
      premiumContent.querySelectorAll("[data-lens-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
      applyHotelFilters();
    });
  });
  premiumContent.querySelectorAll("[data-currency]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currency = button.dataset.currency;
      renderGuide(guide);
    });
  });
  applyHotelFilters();
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
      window.location.assign("/phuket/");
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
    history.replaceState({}, "", "/phuket/#guide");
  } catch {
    message.textContent = "The account service is temporarily unavailable.";
  }
});

async function initializeAccess() {
  const query = new URLSearchParams(window.location.search);
  const sessionId = query.get("session_id") || "";
  state.paymentSessionId = /^cs_(?:(?:test|live)_)?[A-Za-z0-9]+$/.test(sessionId) ? sessionId : "";
  await checkAccount();
  if (query.get("login") === "1" && !state.signedIn) {
    authDialog?.showModal();
    history.replaceState({}, "", "/phuket/#guide");
  }
  if (state.paymentSessionId) {
    setPurchaseStatus("Payment received. Preparing your permanent reading access…");
    await loadGuide(state.paymentSessionId, true);
  }
}

initializeAccess();
