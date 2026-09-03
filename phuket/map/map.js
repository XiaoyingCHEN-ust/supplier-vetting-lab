const paymentSession = new URLSearchParams(window.location.search).get("session_id") || "";
if (/^cs_(?:(?:test|live)_)?[A-Za-z0-9]+$/.test(paymentSession)) {
  window.location.replace(`/phuket/?session_id=${encodeURIComponent(paymentSession)}#guide`);
}

const destinationMaps = {
  phuket: {
    name: "Phuket",
    reviewedOn: "31 Aug 2026",
    areas: {
      "nai-yang": {
        name: "Nai Yang Beach",
        region: "NORTHWEST COAST",
        sequence: "01 / 06",
        coordinates: [8.0909, 98.2980],
        labelSide: "right",
        art: {
          src: "/assets/presentation-backgrounds/hero/nai-yang-cover.jpg",
          alt: "AI-created editorial artwork inspired by a quiet morning on Nai Yang Beach",
        },
        summary: "For a quiet landing, short airport transfer and a beach beside Sirinat National Park. It is a poor base if most of your plans sit around Patong or the southern viewpoints.",
        mood: "Quiet and low-friction",
        fit: "Late arrivals · slow travel",
        check: "Longer trips to the south",
        hotel: {
          name: "Dewa Phuket Resort & Villas",
          score: "8.5",
          scale: "10",
          platform: "Booking.com",
          reviewCount: 897,
          category: "Resort · airport ease",
          reviewPattern: "Verified-stay scores are strongest for staff, comfort, airport convenience and the Nai Yang beach location.",
          watchOut: "The resort price band and longer journeys to Patong or the south are the practical trade-offs.",
          source: "https://www.booking.com/hotel/th/dewa-phuket.html?came_from_hotel_review=1&keep_landing=1",
        },
        food: {
          name: "Sea Almond Chilled Restaurant & Bar",
          score: "4.3",
          scale: "5",
          platform: "Tripadvisor",
          reviewCount: 479,
          category: "Beachfront seafood · sunset",
          reviewPattern: "Public reviews often praise the sea view, sunset setting, relaxed atmosphere and friendly service.",
          watchOut: "Choose it for beachside atmosphere; confirm the current menu, prices and service conditions before making it the trip's special meal.",
          source: "https://www.tripadvisor.com.sg/Restaurant_Review-g1215773-d2617387-Reviews-Sea_Almond_Chilled_Restaurant_Bar-Nai_Yang_Sakhu_Thalang_District_Phuket.html",
        },
      },
      patong: {
        name: "Patong Beach",
        region: "CENTRAL WEST COAST",
        sequence: "02 / 06",
        coordinates: [7.8965, 98.2968],
        labelSide: "left",
        art: {
          src: "/assets/travel/atlas/patong-after-rain.jpg",
          alt: "AI-created editorial artwork inspired by Patong after tropical rain at blue hour",
        },
        summary: "The highest-convenience choice for nightlife, shopping and a dense range of restaurants. Choose it deliberately: central access comes with traffic, crowds and a greater chance of street noise.",
        mood: "Busy and highly connected",
        fit: "Nightlife · short first visits",
        check: "Room position affects noise",
        hotel: {
          name: "Hotel Clover Patong Phuket",
          score: "8.9",
          scale: "10",
          platform: "Booking.com",
          reviewCount: 4280,
          category: "Boutique · walk-first base",
          reviewPattern: "Verified-stay scores are strongest for location, staff, comfort, cleanliness and the rooftop-pool experience.",
          watchOut: "This is a central urban base rather than a secluded resort; room outlook and street activity vary by position.",
          source: "https://www.booking.com/hotel/th/surf-patong.html",
        },
        food: {
          name: "Baan Rim Pa",
          score: "4.1",
          scale: "5",
          platform: "Tripadvisor",
          reviewCount: 2647,
          category: "Thai · bay-view dinner",
          reviewPattern: "Public reviews repeatedly mention the Kalim Bay outlook, polished setting, service and evening atmosphere.",
          watchOut: "It sits above the local-casual price level and normally needs a short ride from central Patong; check the latest menu and table position.",
          source: "https://www.tripadvisor.com/Restaurant_Review-g297930-d1073248-Reviews-Baan_Rim_Pa-Patong_Kathu_Phuket.html",
        },
      },
      kata: {
        name: "Kata Beach",
        region: "SOUTHWEST COAST",
        sequence: "03 / 06",
        coordinates: [7.8210, 98.2987],
        labelSide: "left",
        art: {
          src: "/assets/presentation-backgrounds/hero/kata-cover.jpg",
          alt: "AI-created layered-paper artwork inspired by Kata Bay",
        },
        summary: "A practical first beach stay for couples and families who want restaurants nearby without Patong intensity. Hills and indirect hotel entrances can make a short map distance feel longer.",
        mood: "Balanced and family-friendly",
        fit: "First stays · beach days",
        check: "Check the real walking route",
        hotel: {
          name: "OZO Phuket",
          score: "8.8",
          scale: "10",
          platform: "Booking.com",
          reviewCount: 1578,
          category: "Family · short beach walk",
          reviewPattern: "Verified stays repeatedly value the location, staff, family pools, children’s facilities and beach access.",
          watchOut: "The active family atmosphere is not designed for maximum privacy or a secluded couples-only stay.",
          source: "https://www.booking.com/hotel/th/ozo-phuket.html?came_from_hotel_review=1&keep_landing=1",
        },
        food: {
          name: "The Boathouse Restaurant",
          score: "4.4",
          scale: "5",
          platform: "Tripadvisor",
          reviewCount: 1929,
          category: "Beachfront Thai + international",
          reviewPattern: "Public reviews frequently highlight the direct Kata Beach setting, service, presentation and long sunset meals.",
          watchOut: "This is premium beachfront dining; deposits or minimum-spend rules may apply for some dates or group sizes, so confirm first.",
          source: "https://www.tripadvisor.co.uk/Restaurant_Review-g1210687-d1142927-Reviews-The_Boathouse_Restaurant-Kata_Beach_Karon_Phuket.html",
        },
      },
      karon: {
        name: "Karon Beach",
        region: "WEST COAST",
        sequence: "04 / 06",
        coordinates: [7.8474, 98.2937],
        labelSide: "left",
        art: {
          src: "/assets/travel/atlas/karon-first-light.jpg",
          alt: "AI-created layered-paper artwork inspired by Karon Beach at first light",
        },
        summary: "A long open beach with more breathing room than central Patong. It suits travellers who accept a more spread-out district and plan evening transport instead of expecting everything on one block.",
        mood: "Open beach and more space",
        fit: "Long walks · relaxed couples",
        check: "The district is spread out",
        hotel: {
          name: "Avista Grande Phuket Karon – MGallery",
          score: "8.9",
          scale: "10",
          platform: "Booking.com",
          reviewCount: 990,
          category: "Boutique resort · couples + families",
          reviewPattern: "Verified-stay scores are strongest for staff, cleanliness, comfort, breakfast, rooms and the pool.",
          watchOut: "It is close to Karon Beach but not built directly on the sand; confirm the walking route for the room and entrance you book.",
          source: "https://www.booking.com/hotel/th/avista-grande-phuket-karon.html?came_from_hotel_review=1&keep_landing=1",
        },
        food: {
          name: "EAT Bar & Grill",
          score: "4.8",
          scale: "5",
          platform: "Tripadvisor",
          reviewCount: 2567,
          category: "Grill · sunset dinner",
          reviewPattern: "Public reviews consistently emphasize steak preparation, attentive staff, cocktails and the elevated coastal outlook.",
          watchOut: "Prices sit above local casual dining. Check the live menu and reserve if the sunset view is important.",
          source: "https://www.tripadvisor.com/Restaurant_Review-g1215780-d7264891-Reviews-Eat_Bar_Grill-Karon_Phuket.html",
        },
      },
      "nai-harn": {
        name: "Nai Harn Beach",
        region: "SOUTH COAST",
        sequence: "05 / 06",
        coordinates: [7.7790, 98.3065],
        labelSide: "right",
        art: {
          src: "/assets/travel/atlas/nai-harn-slow-sunset.jpg",
          alt: "AI-created watercolor and linocut artwork inspired by a slow Nai Harn sunset",
        },
        summary: "A scenic southern option for travellers who care more about the beach and a slower day than nightlife access. It is less convenient for airport runs and repeated trips to Patong or Old Town.",
        mood: "Scenic and slower",
        fit: "Beach-first · repeat visitors",
        check: "Less convenient without a plan",
        hotel: {
          name: "The Nai Harn",
          score: "9.2",
          scale: "10",
          platform: "Booking.com",
          reviewCount: 1161,
          category: "Luxury · bay-view retreat",
          reviewPattern: "Verified stays repeatedly value staff, cleanliness, comfort, breakfast, terraces and the bay-and-beach location.",
          watchOut: "The hillside layout and high-end spending level matter; south-island seclusion also increases airport and Patong transfer time.",
          source: "https://www.booking.com/hotel/th/the-nai-harn.html",
        },
        food: {
          name: "Rock Salt",
          score: "4.8",
          scale: "5",
          platform: "Tripadvisor",
          reviewCount: 3929,
          category: "Seafood · Mediterranean · sunset",
          reviewPattern: "Public reviews repeatedly praise the sea view, service, seafood and beach-edge sunset setting.",
          watchOut: "It is a high-end hotel restaurant. Confirm spice preferences, current prices and any reservation deposit before going.",
          source: "https://www.tripadvisor.co.uk/Restaurant_Review-g1231757-d10521879-Reviews-Rock_Salt-Nai_Harn_Rawai_Phuket.html",
        },
      },
      "old-town": {
        name: "Phuket Old Town",
        region: "SOUTHEAST INTERIOR",
        sequence: "06 / 06",
        coordinates: [7.8834, 98.3873],
        labelSide: "right",
        art: {
          src: "/assets/presentation-backgrounds/hero/old-town-cover.jpg",
          alt: "AI-created editorial artwork inspired by Phuket Old Town after rain",
        },
        summary: "The strongest cultural base for architecture, cafés and local food, with a walkable core. It is not a beach stay: every west-coast beach day adds time and transport planning.",
        mood: "Cultural and walkable",
        fit: "Food · architecture · short stays",
        check: "No beach outside the door",
        hotel: {
          name: "The Memory at On On Hotel",
          score: "9.3",
          scale: "10",
          platform: "Booking.com",
          reviewCount: 1984,
          category: "Heritage · walkable Old Town",
          reviewPattern: "Verified-stay scores are strongest for location, staff, cleanliness, comfort, value and the historic atmosphere.",
          watchOut: "A heritage building has character rather than resort facilities; wooden floors and the central setting may matter to light sleepers.",
          source: "https://www.booking.com/hotel/th/the-memory-at-on-on.html",
        },
        food: {
          name: "One Chun Cafe & Restaurant",
          score: "4.3",
          scale: "5",
          platform: "Tripadvisor",
          reviewCount: 643,
          category: "Southern Thai · MICHELIN Bib Gourmand 2026",
          reviewPattern: "Public reviews often value the local Phuket flavours, vintage setting, family recipes and accessible price point.",
          watchOut: "Queues and slower service can appear at busy times, and MICHELIN lists it as cash only; verify current payment options locally.",
          source: "https://www.tripadvisor.com/Restaurant_Review-g2315818-d5818564-Reviews-One_Chun_Cafe_and_Restaurant-Talat_Yai_Phuket_Town_Phuket.html",
        },
      },
    },
  },
};

// Main-island coastline adapted from OpenStreetMap relation 1162697 (ODbL),
// simplified for a fast editorial overlay. Map attribution remains visible in Leaflet.
const phuketOutline = [
  [7.935602, 98.258038], [7.923438, 98.262123], [7.924892, 98.27427], [7.909186, 98.296473],
  [7.886473, 98.289568], [7.886309, 98.272455], [7.893184, 98.264212], [7.8857, 98.260923],
  [7.88004, 98.265372], [7.882064, 98.272068], [7.875984, 98.27569], [7.867822, 98.273384],
  [7.856703, 98.290097], [7.833318, 98.294381], [7.824599, 98.289654], [7.819542, 98.297811],
  [7.803942, 98.298752], [7.787851, 98.284731], [7.786882, 98.290954], [7.77566, 98.288186],
  [7.776729, 98.30502], [7.758378, 98.302791], [7.759066, 98.315122], [7.770388, 98.319499],
  [7.777532, 98.337373], [7.789104, 98.333203], [7.823305, 98.345441], [7.839166, 98.366277],
  [7.842126, 98.375989], [7.805409, 98.38914], [7.814323, 98.39496], [7.799208, 98.408268],
  [7.801016, 98.412482], [7.808249, 98.410572], [7.812001, 98.402208], [7.818712, 98.40628],
  [7.824107, 98.400856], [7.829656, 98.405626], [7.835044, 98.402824], [7.837497, 98.410352],
  [7.838236, 98.39733], [7.851965, 98.391716], [7.862806, 98.402382], [7.871504, 98.399793],
  [7.878027, 98.410072], [7.871205, 98.414424], [7.886423, 98.413573], [7.887093, 98.419457],
  [7.894785, 98.418208], [7.8967, 98.425945], [7.900342, 98.421227], [7.897675, 98.420551],
  [7.897368, 98.417628], [7.903914, 98.422348], [7.91335, 98.411731], [7.926861, 98.413229],
  [7.950266, 98.396107], [7.961404, 98.394041], [7.967953, 98.397709], [7.978675, 98.393063],
  [7.991018, 98.40242], [7.990299, 98.415429], [7.983984, 98.421416], [7.987332, 98.425991],
  [8.002048, 98.410778], [8.020664, 98.410112], [8.037118, 98.417593], [8.041266, 98.41491],
  [8.04082, 98.421096], [8.048465, 98.417186], [8.039809, 98.430043], [8.040247, 98.432683],
  [8.060982, 98.432073], [8.066771, 98.43676], [8.065818, 98.443312], [8.072248, 98.442415],
  [8.071084, 98.436218], [8.075486, 98.434347], [8.086643, 98.434857], [8.092728, 98.440141],
  [8.100813, 98.425225], [8.085662, 98.417705], [8.079007, 98.406158], [8.082955, 98.401386],
  [8.079464, 98.396556], [8.085338, 98.386059], [8.09945, 98.376198], [8.118887, 98.373098],
  [8.120364, 98.367321], [8.110943, 98.351554], [8.124059, 98.354182], [8.125158, 98.350171],
  [8.11569, 98.345657], [8.143441, 98.347547], [8.145224, 98.342236], [8.170258, 98.338557],
  [8.185831, 98.315809], [8.184541, 98.309083], [8.192825, 98.304665], [8.188896, 98.297063],
  [8.191952, 98.302482], [8.193407, 98.303445], [8.191525, 98.299499], [8.197322, 98.302001],
  [8.200578, 98.297505], [8.196828, 98.283625], [8.151603, 98.296229], [8.105771, 98.301144],
  [8.087774, 98.296085], [8.078696, 98.273188], [8.071415, 98.270392], [8.056572, 98.277496],
  [8.042553, 98.276676], [8.037941, 98.272078], [8.033579, 98.275891], [8.03484, 98.285859],
  [7.99885, 98.291924], [7.984899, 98.284803], [7.987962, 98.270194], [7.982449, 98.276455],
  [7.95483, 98.282509], [7.948953, 98.277319], [7.948545, 98.262362], [7.935602, 98.258038],
];

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
const mapCanvas = document.querySelector("#phuket-map");
const mapReading = document.querySelector("#map-reading");
const mapSequence = document.querySelector("#map-sequence");
const mapAreaName = document.querySelector("#map-area-name");
const mapAreaSummary = document.querySelector("#map-area-summary");
const mapBestFit = document.querySelector("#map-best-fit");
const mapTradeoff = document.querySelector("#map-tradeoff");
const mapMood = document.querySelector("#map-mood");
const mapArt = document.querySelector("#map-art");
const mapArtCaption = document.querySelector("#map-art-caption");
const mapLensKicker = document.querySelector("#map-lens-kicker");
const mapPlaceScore = document.querySelector("#map-place-score");
const mapPlaceName = document.querySelector("#map-place-name");
const mapPlaceCategory = document.querySelector("#map-place-category");
const mapPlacePositive = document.querySelector("#map-place-positive");
const mapPlaceWatch = document.querySelector("#map-place-watch");
const mapPlaceCount = document.querySelector("#map-place-count");
const mapPlaceSource = document.querySelector("#map-place-source");
const mapReset = document.querySelector("#map-reset");
const mapLayerButtons = document.querySelectorAll("[data-map-layer]");
let phuketLeafletMap = null;
let phuketOutlineLayer = null;
let activeMapLayer = "hotel";
let activeCoastId = "kata";

const layerLabels = {
  hotel: "STAY LENS",
  food: "EAT LENS",
  area: "BEACH LENS",
};

function showWholeIsland() {
  if (!phuketLeafletMap || !phuketOutlineLayer) return;
  phuketLeafletMap.fitBounds(phuketOutlineLayer.getBounds(), { padding: [56, 56] });
}

function areaLensFor(coast) {
  return {
    name: coast.name,
    score: "AREA",
    scale: "FIT",
    platform: "Driftwise area lens",
    reviewCount: null,
    category: coast.mood,
    reviewPattern: `Best for ${coast.fit.toLowerCase()}. ${coast.summary}`,
    watchOut: coast.check,
    source: "https://www.tourismthailand.org/Articles/phuket",
  };
}

function setMapLayer(layer) {
  if (!layerLabels[layer]) return;
  activeMapLayer = layer;
  mapCanvas?.setAttribute("data-layer", layer);
  mapLayerButtons.forEach((button) => {
    const isActive = button.dataset.mapLayer === layer;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  selectCoast(activeCoastId);
}

function renderMapMarkers() {
  if (!mapCanvas) return;
  if (!window.L) {
    mapCanvas.classList.add("is-unavailable");
    const loadingMessage = mapCanvas.querySelector(".map-loading");
    if (loadingMessage) loadingMessage.textContent = "The detailed map could not load. Refresh the page or use the six area summaries below it.";
    return;
  }

  mapCanvas.querySelector(".map-loading")?.remove();
  phuketLeafletMap = L.map(mapCanvas, {
    attributionControl: true,
    zoomControl: false,
    scrollWheelZoom: false,
    minZoom: 9,
    maxZoom: 17,
  });

  L.control.zoom({ position: "topright" }).addTo(phuketLeafletMap);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    minZoom: 9,
    maxZoom: 17,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(phuketLeafletMap);

  L.polygon(phuketOutline, {
    color: "#edbb60",
    weight: 7,
    opacity: 0.2,
    fill: false,
    interactive: false,
    lineJoin: "round",
  }).addTo(phuketLeafletMap);

  phuketOutlineLayer = L.polygon(phuketOutline, {
    color: "#06343a",
    weight: 2.5,
    opacity: 0.95,
    fillColor: "#77b8aa",
    fillOpacity: 0.08,
    interactive: false,
    lineJoin: "round",
  }).addTo(phuketLeafletMap);

  // Establish the first view before creating DOM-backed markers. Leaflet only
  // materialises marker elements after a map has a centre and zoom level.
  showWholeIsland();

  Object.entries(coastProfiles).forEach(([areaId, coast], index) => {
    const marker = L.marker(coast.coordinates, {
      icon: L.divIcon({
        className: "map-pin",
        html: `<span class="map-pin-dot" aria-hidden="true"><i>${String(index + 1).padStart(2, "0")}</i></span><span class="map-pin-label">${coast.name}</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 26],
      }),
      keyboard: true,
      riseOnHover: true,
      title: `Show ${coast.name}`,
      alt: `${coast.name} area marker`,
    }).addTo(phuketLeafletMap);

    const markerElement = marker.getElement();
    markerElement.dataset.mapArea = areaId;
    markerElement.dataset.labelSide = coast.labelSide;
    markerElement.setAttribute("role", "button");
    markerElement.setAttribute("aria-label", `Show ${coast.name} stay, food and area evidence`);
    marker.on("click", () => selectCoast(areaId, { focus: true }));
  });

  window.addEventListener("resize", () => phuketLeafletMap?.invalidateSize(), { passive: true });
}

function selectCoast(coastId, { focus = false } = {}) {
  const coast = coastProfiles[coastId] || coastProfiles.kata;
  activeCoastId = coastProfiles[coastId] ? coastId : "kata";
  document.querySelectorAll("[data-map-area]").forEach((button) => {
    const isActive = button.dataset.mapArea === activeCoastId;
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
  if (mapArt) {
    mapArt.src = coast.art.src;
    mapArt.alt = coast.art.alt;
  }
  if (mapArtCaption) mapArtCaption.textContent = `${coast.name} · AI-CREATED EDITORIAL ATMOSPHERE, NOT PROPERTY PHOTOGRAPHY`;

  const signal = activeMapLayer === "area" ? areaLensFor(coast) : coast[activeMapLayer];
  mapLensKicker.textContent = `${layerLabels[activeMapLayer]} · ${signal.platform.toUpperCase()}`;
  mapPlaceScore.innerHTML = activeMapLayer === "area"
    ? `${signal.score}<small>${signal.scale}</small>`
    : `${signal.score}<small>/${signal.scale}</small>`;
  mapPlaceName.textContent = signal.name;
  mapPlaceCategory.textContent = signal.category;
  mapPlacePositive.textContent = signal.reviewPattern;
  mapPlaceWatch.textContent = signal.watchOut;
  if (activeMapLayer === "area") {
    mapPlaceCount.textContent = `PLACE PROFILE · REVIEWED ${activeDestination.reviewedOn.toUpperCase()}`;
  } else {
    const reviewLabel = signal.platform === "Booking.com" ? "verified-stay reviews" : "public reviews";
    mapPlaceCount.textContent = `${signal.reviewCount.toLocaleString()} ${reviewLabel} · checked ${activeDestination.reviewedOn}`;
  }
  mapPlaceSource.href = signal.source;
  mapPlaceSource.textContent = activeMapLayer === "area"
    ? "Open destination source ↗"
    : `Check current ${signal.platform} page ↗`;

  if (focus && phuketLeafletMap) {
    phuketLeafletMap.flyTo(coast.coordinates, 12, { duration: 0.7 });
  }

  mapReading.animate(
    [{ opacity: 0.58, transform: "translateY(7px)" }, { opacity: 1, transform: "translateY(0)" }],
    { duration: 300, easing: "cubic-bezier(.2,.7,.2,1)" },
  );
}

const requestedArea = new URLSearchParams(window.location.search).get("area") || "";
const initialArea = coastProfiles[requestedArea] ? requestedArea : "kata";
renderMapMarkers();
selectCoast(initialArea, { focus: Boolean(requestedArea) });
mapReset?.addEventListener("click", showWholeIsland);
mapLayerButtons.forEach((button) => {
  button.addEventListener("click", () => setMapLayer(button.dataset.mapLayer));
});
document.querySelectorAll("[data-story-area]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    selectCoast(link.dataset.storyArea, { focus: true });
    document.querySelector("#atlas")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelector("#intent-finder")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const intent = new FormData(event.currentTarget).get("intent") || "balanced";
  const [coastId, headline] = intentMatches[intent] || intentMatches.balanced;
  const coast = coastProfiles[coastId];
  selectCoast(coastId, { focus: true });
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
