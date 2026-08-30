const paymentSession = new URLSearchParams(window.location.search).get("session_id") || "";
if (/^cs_(?:(?:test|live)_)?[A-Za-z0-9]+$/.test(paymentSession)) {
  window.location.replace(`/phuket/?session_id=${encodeURIComponent(paymentSession)}#guide`);
}

const destinationMaps = {
  phuket: {
    name: "Phuket",
    reviewedOn: "30 Aug 2026",
    areas: {
      "nai-yang": {
    name: "Nai Yang Beach",
    region: "NORTHWEST COAST",
    sequence: "01 / 06",
    x: 34,
    y: 15,
    labelSide: "right",
    summary: "For a quiet landing, short airport transfer and a beach beside Sirinat National Park. It is a poor base if most of your plans sit around Patong or the southern viewpoints.",
    mood: "Quiet and low-friction",
    fit: "Late arrivals · slow travel",
    check: "Longer trips to the south",
    hotel: {
      name: "Dewa Phuket Resort & Villas",
      score: "8.5",
      reviewCount: 897,
      reviewPattern: "Staff, comfort, beach proximity, airport convenience and a relaxed setting are the recurring strengths.",
      source: "https://www.booking.com/hotel/th/dewa-phuket.html",
    },
  },
  patong: {
    name: "Patong Beach",
    region: "CENTRAL WEST COAST",
    sequence: "02 / 06",
    x: 22,
    y: 42,
    labelSide: "left",
    summary: "The highest-convenience choice for nightlife, shopping and a dense range of restaurants. Choose it deliberately: central access comes with traffic, crowds and a greater chance of street noise.",
    mood: "Busy and highly connected",
    fit: "Nightlife · short first visits",
    check: "Room position affects noise",
    hotel: {
      name: "Hotel Clover Patong Phuket",
      score: "8.9",
      reviewCount: 4280,
      reviewPattern: "Verified reviews are strongest on location, cleanliness, comfort, staff and the rooftop pool experience.",
      source: "https://www.booking.com/hotel/th/surf-patong.html",
    },
  },
  kata: {
    name: "Kata Beach",
    region: "SOUTHWEST COAST",
    sequence: "03 / 06",
    x: 28,
    y: 61,
    labelSide: "left",
    summary: "A practical first beach stay for couples and families who want restaurants nearby without Patong intensity. Hills and indirect hotel entrances can make a short map distance feel longer.",
    mood: "Balanced and family-friendly",
    fit: "First stays · beach days",
    check: "Check the real walking route",
    hotel: {
      name: "OZO Phuket",
      score: "8.8",
      reviewCount: 1582,
      reviewPattern: "Guests consistently value the location, helpful staff, family facilities, beach access and breakfast variety.",
      source: "https://www.booking.com/hotel/th/ozo-phuket.html",
    },
  },
  karon: {
    name: "Karon Beach",
    region: "WEST COAST",
    sequence: "04 / 06",
    x: 23,
    y: 52,
    labelSide: "left",
    summary: "A long open beach with more breathing room than central Patong. It suits travellers who accept a more spread-out district and plan their evening transport instead of expecting everything on one block.",
    mood: "Open beach and more space",
    fit: "Long walks · relaxed couples",
    check: "The district is spread out",
    hotel: null,
  },
  "nai-harn": {
    name: "Nai Harn Beach",
    region: "SOUTH COAST",
    sequence: "05 / 06",
    x: 44,
    y: 83,
    labelSide: "right",
    summary: "A scenic southern option for travellers who care more about the beach and a slower day than nightlife access. It is less convenient for airport runs and repeated trips to Patong or Old Town.",
    mood: "Scenic and slower",
    fit: "Beach-first · repeat visitors",
    check: "Less convenient without a plan",
    hotel: null,
  },
  "old-town": {
    name: "Phuket Old Town",
    region: "SOUTHEAST INTERIOR",
    sequence: "06 / 06",
    x: 73,
    y: 53,
    labelSide: "right",
    summary: "The strongest cultural base for architecture, cafés and local food, with a walkable core. It is not a beach stay: every west-coast beach day adds time and transport planning.",
    mood: "Cultural and walkable",
    fit: "Food · architecture · short stays",
    check: "No beach outside the door",
    hotel: {
      name: "The Memory at On On Hotel",
      score: "9.2",
      reviewCount: 1977,
      reviewPattern: "Location, staff, cleanliness, value and the historic atmosphere lead the verified-review pattern.",
      source: "https://www.booking.com/hotel/th/the-memory-at-on-on.html",
    },
  },
    },
  },
};

const activeDestination = destinationMaps.phuket;
const coastProfiles = activeDestination.areas;

const intentMatches = {
  balanced: ["kata", "Kata · beach days without Patong intensity"],
  quiet: ["nai-yang", "Nai Yang · the quietest low-friction arrival"],
  family: ["kata", "Kata · family ease with beach and dining nearby"],
  nightlife: ["patong", "Patong · keep nightlife within the same district"],
  food: ["old-town", "Old Town · put food and culture outside the door"],
  value: ["old-town", "Old Town · stronger room value if the beach is not daily"],
};

const finderResult = document.querySelector("#finder-result");
const resultGain = document.querySelector("#result-gain");
const resultTradeoff = document.querySelector("#result-tradeoff");
const resultFit = document.querySelector("#result-fit");
const mapMarkers = document.querySelector("#map-markers");
const mapReading = document.querySelector("#map-reading");
const mapSequence = document.querySelector("#map-sequence");
const mapAreaName = document.querySelector("#map-area-name");
const mapAreaSummary = document.querySelector("#map-area-summary");
const mapBestFit = document.querySelector("#map-best-fit");
const mapTradeoff = document.querySelector("#map-tradeoff");
const mapMood = document.querySelector("#map-mood");
const hotelSignal = document.querySelector("#hotel-signal");
const mapHotelScore = document.querySelector("#map-hotel-score");
const mapHotelName = document.querySelector("#map-hotel-name");
const mapHotelPattern = document.querySelector("#map-hotel-pattern");
const mapHotelCount = document.querySelector("#map-hotel-count");
const mapHotelSource = document.querySelector("#map-hotel-source");

function renderMapMarkers() {
  if (!mapMarkers) return;
  Object.entries(coastProfiles).forEach(([areaId, coast]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "map-pin";
    button.dataset.mapArea = areaId;
    button.dataset.labelSide = coast.labelSide;
    button.style.left = `${coast.x}%`;
    button.style.top = `${coast.y}%`;
    button.setAttribute("aria-label", `Show ${coast.name} review sample and trade-offs`);
    button.innerHTML = `<span class="map-pin-dot" aria-hidden="true"><i></i></span><span class="map-pin-label">${coast.name}</span>`;
    button.addEventListener("click", () => selectCoast(areaId));
    mapMarkers.append(button);
  });
}

function selectCoast(coastId) {
  const coast = coastProfiles[coastId] || coastProfiles.kata;
  document.querySelectorAll("[data-map-area]").forEach((button) => {
    const isActive = button.dataset.mapArea === coastId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  if (!mapReading) return;
  mapReading.querySelector(".eyebrow").textContent = `SELECTED AREA · ${coast.region}`;
  mapSequence.textContent = coast.sequence;
  mapAreaName.textContent = coast.name;
  mapAreaSummary.textContent = coast.summary;
  mapBestFit.textContent = coast.fit;
  mapTradeoff.textContent = coast.check;
  mapMood.textContent = coast.mood;

  if (coast.hotel) {
    hotelSignal.classList.remove("is-empty");
    mapHotelScore.innerHTML = `${coast.hotel.score}<small>/10</small>`;
    mapHotelName.textContent = coast.hotel.name;
    mapHotelPattern.textContent = coast.hotel.reviewPattern;
    mapHotelCount.textContent = `${coast.hotel.reviewCount.toLocaleString()} verified reviews · reviewed ${activeDestination.reviewedOn}`;
    mapHotelSource.href = coast.hotel.source;
    mapHotelSource.hidden = false;
  } else {
    hotelSignal.classList.add("is-empty");
    mapHotelScore.innerHTML = "NEXT<small>EDITION</small>";
    mapHotelName.textContent = "Named hotel coverage is being added";
    mapHotelPattern.textContent = `${coast.name} has a free area profile now. The current edition does not publish a named hotel here, so no review score is invented.`;
    mapHotelCount.textContent = "AREA PROFILE LIVE · HOTEL SAMPLE PENDING";
    mapHotelSource.hidden = true;
  }

  mapReading.animate(
    [{ opacity: 0.58, transform: "translateY(7px)" }, { opacity: 1, transform: "translateY(0)" }],
    { duration: 300, easing: "cubic-bezier(.2,.7,.2,1)" },
  );
}

renderMapMarkers();
selectCoast("kata");

document.querySelector("#intent-finder")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const intent = new FormData(event.currentTarget).get("intent") || "balanced";
  const [coastId, headline] = intentMatches[intent] || intentMatches.balanced;
  const coast = coastProfiles[coastId];
  selectCoast(coastId);
  finderResult.querySelector("h2").textContent = headline;
  finderResult.querySelector(".result-summary").textContent = `${coast.summary} Start here, then check the hotel-level trade-offs in the Phuket preview.`;
  resultGain.textContent = coast.mood;
  resultTradeoff.textContent = coast.check;
  resultFit.textContent = coast.fit;
  finderResult.animate(
    [{ opacity: 0.45, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
    { duration: 360, easing: "cubic-bezier(.2,.7,.2,1)" },
  );
});

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14 })
  : null;

document.querySelectorAll(".reveal").forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add("is-visible");
});
