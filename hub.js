const searchForm = document.querySelector("#place-search");
const placeInput = document.querySelector("#place-query");
const priorityInput = document.querySelector("#trip-priority");
const result = document.querySelector("#search-result");
const resultTitle = result?.querySelector("h3");
const resultCopy = result?.querySelector("p");
const resultLink = document.querySelector("#search-result-link");

const placeRoutes = [
  {
    terms: ["riverside", "river", "chao phraya"],
    title: "Bangkok Riverside: atmosphere first, rail second.",
    copy: "Start here for river views and shorter temple days. Check pier access and the hotel shuttle before accepting weaker BTS or MRT coverage.",
    href: "bangkok/#riverside",
    label: "Explore Bangkok Riverside",
  },
  {
    terms: ["sukhumvit", "asok", "bts", "mrt", "easy public transport"],
    title: "Sukhumvit or Asok: the practical rail-first Bangkok base.",
    copy: "A useful first choice when BTS and MRT access should hold the trip together. The trade-off is traffic, density and less old-city atmosphere.",
    href: "bangkok/#sukhumvit",
    label: "Compare Bangkok districts",
  },
  {
    terms: ["silom", "sathorn"],
    title: "Silom and Sathorn: rail, food and a calmer business-district rhythm.",
    copy: "A strong compromise for MRT or BTS access, evening food and fewer nightlife crowds than central Sukhumvit.",
    href: "bangkok/#silom",
    label: "Open the Bangkok area guide",
  },
  {
    terms: ["rattanakosin", "bangkok old town", "grand palace", "temples"],
    title: "Rattanakosin: keep Bangkok's historic core close.",
    copy: "Choose it for temples and old-city atmosphere, then plan around weaker rail coverage, heat and river or road connections.",
    href: "bangkok/#rattanakosin",
    label: "Explore Bangkok Old Town",
  },
  {
    terms: ["ari"],
    title: "Ari: a quieter Bangkok neighborhood with BTS access.",
    copy: "A better fit for café time and residential evenings than landmark-heavy first days. Expect more cross-city travel for the main sights.",
    href: "bangkok/#ari",
    label: "See Ari in the Bangkok guide",
  },
  {
    terms: ["siam", "chidlom", "shopping"],
    title: "Siam or Chidlom: central rail and shopping convenience.",
    copy: "Start here when malls, family convenience and simple BTS transfers matter more than a neighborhood feel.",
    href: "bangkok/#siam",
    label: "Compare central Bangkok",
  },
  {
    terms: ["kata"],
    title: "Kata: the balanced first Phuket beach base.",
    copy: "Beach access and restaurants without Patong's full intensity. Check hills, indirect entrances and the real walk from the room to the sand.",
    href: "/phuket/map/?area=kata#atlas",
    label: "Locate Kata on the Phuket map",
  },
  {
    terms: ["karon"],
    title: "Karon: a longer beach with more breathing room.",
    copy: "Good for travellers who value space and longer walks. The district is spread out, so evening transport and the exact hotel position still matter.",
    href: "/phuket/map/?area=karon#atlas",
    label: "Locate Karon on the Phuket map",
  },
  {
    terms: ["patong", "nightlife"],
    title: "Patong: maximum convenience with a noise trade-off.",
    copy: "Keep nightlife, shopping and restaurants close, then check room position and street activity before booking.",
    href: "/phuket/map/?area=patong#atlas",
    label: "Locate Patong on the Phuket map",
  },
  {
    terms: ["nai yang", "airport", "quiet beach"],
    title: "Nai Yang: the low-friction, quieter Phuket arrival.",
    copy: "Keep the airport transfer short and the beach rhythm slow. Accept longer journeys to Patong, Old Town and the south.",
    href: "phuket/map/?area=nai-yang#atlas",
    label: "Locate Nai Yang on the Phuket map",
  },
  {
    terms: ["nai harn", "naihan"],
    title: "Nai Harn: a scenic, slower base in south Phuket.",
    copy: "Choose it for beach-first days and quieter evenings, with a longer airport transfer and more planning for cross-island trips.",
    href: "phuket/map/?area=nai-harn#atlas",
    label: "Locate Nai Harn on the Phuket map",
  },
  {
    terms: ["phuket old town", "old town", "local food", "heritage"],
    title: "Phuket Old Town: food and heritage instead of a beach outside the door.",
    copy: "A walkable cultural base with stronger room value. Every beach day needs separate transport planning.",
    href: "/phuket/map/?area=old-town#atlas",
    label: "Locate Old Town on the Phuket map",
  },
  {
    terms: ["bangkok"],
    title: "Start with Bangkok's six districts—not a hotel list.",
    copy: "Compare Riverside, Sukhumvit, Silom and Sathorn, Rattanakosin, Ari, and Siam by transport, food and daily friction.",
    href: "bangkok/",
    label: "Open the Bangkok area guide",
  },
  {
    terms: ["phuket", "beach", "resort"],
    title: "Start with Phuket's six bases—not a resort list.",
    copy: "Compare Kata, Karon, Patong, Nai Yang, Nai Harn and Old Town by beach access, food, transfer time and noise.",
    href: "phuket/",
    label: "Open the Phuket area guide",
  },
];

const priorityRoutes = {
  first: {
    title: "First decide: city days or beach days?",
    copy: "Bangkok rewards rail and district planning; Phuket rewards choosing the right coast. Compare both before opening a hotel tab.",
    href: "#destinations",
    label: "Compare Bangkok and Phuket",
  },
  transit: placeRoutes[1],
  beach: placeRoutes[6],
  quiet: placeRoutes[9],
  food: placeRoutes[11],
  nightlife: placeRoutes[8],
};

const bangkokIntentRoutes = [
  {
    terms: ["airport", "arrival", "bkk", "dmk"],
    title: "Bangkok arrival: choose the predictable segment first.",
    copy: "Compare airport rail, official taxi points and the final transfer before choosing the district around your first and last day.",
    href: "/bangkok/#move",
    label: "Compare Bangkok airport routes",
  },
  { terms: ["nightlife", "late night", "bars"], route: placeRoutes[1] },
  { terms: ["quiet", "cafes", "neighborhood"], route: placeRoutes[4] },
  { terms: ["food", "dining", "restaurants"], route: placeRoutes[2] },
  { terms: ["transport", "train", "rail"], route: placeRoutes[1] },
];

const phuketIntentRoutes = [
  { terms: ["airport", "arrival"], route: placeRoutes[9] },
  { terms: ["nightlife", "late night", "bars"], route: placeRoutes[8] },
  { terms: ["quiet", "slow"], route: placeRoutes[9] },
  { terms: ["food", "heritage", "culture"], route: placeRoutes[11] },
  { terms: ["family", "first trip", "first stay"], route: placeRoutes[6] },
];

function normalize(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ");
}

function chooseRoute(query, priority) {
  const normalized = normalize(query);
  if (normalized) {
    if (normalized.includes("bangkok")) {
      const areaMatch = placeRoutes.slice(0, 6).find(({ terms }) => terms.some((term) => normalized.includes(normalize(term))));
      if (areaMatch) return areaMatch;
      const intentMatch = bangkokIntentRoutes.find(({ terms }) => terms.some((term) => normalized.includes(normalize(term))));
      if (intentMatch) return intentMatch.route || intentMatch;
      return placeRoutes[12];
    }

    if (normalized.includes("phuket")) {
      const areaMatch = placeRoutes.slice(6, 12).find(({ terms }) => terms.some((term) => normalized.includes(normalize(term))));
      if (areaMatch) return areaMatch;
      const intentMatch = phuketIntentRoutes.find(({ terms }) => terms.some((term) => normalized.includes(normalize(term))));
      if (intentMatch) return intentMatch.route || intentMatch;
      return placeRoutes[13];
    }

    const exactMatch = placeRoutes.find(({ terms }) => terms.some((term) => normalized.includes(normalize(term))));
    if (exactMatch) return exactMatch;
  }
  return priorityRoutes[priority] || priorityRoutes.first;
}

function renderRoute(route) {
  if (!result || !resultTitle || !resultCopy || !resultLink) return;
  resultTitle.textContent = route.title;
  resultCopy.textContent = route.copy;
  resultLink.href = route.href;
  resultLink.textContent = route.label;
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    result.animate(
      [{ opacity: 0.55, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 280, easing: "cubic-bezier(.2,.7,.2,1)" },
    );
  }
}

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  renderRoute(chooseRoute(placeInput?.value || "", priorityInput?.value || "first"));
  result?.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.querySelectorAll("[data-search-value]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!placeInput) return;
    placeInput.value = button.dataset.searchValue || "";
    searchForm?.requestSubmit();
  });
});
