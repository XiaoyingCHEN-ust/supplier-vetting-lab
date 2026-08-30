const reviewedOn = "31 Aug 2026";
const BANGKOK_GUIDE_ID = "bangkok-2026-v1";
const accessState = { signedIn: false, paymentSessionId: "" };

const districts = {
  riverside: {
    code: "RV",
    name: "Riverside",
    region: "RIVER SOUTH · SATHORN PIER",
    coordinates: [13.72, 100.5145],
    labelSide: "right",
    image: "../assets/travel/bangkok/bangkok-river-blue-hour.jpg",
    imageAlt: "AI-created editorial artwork inspired by Bangkok's river district at blue hour",
    summary: "River light, hotel boats and Charoen Krung food streets make a distinctive first base—provided your days work with the pier clock.",
    fit: "River atmosphere · slower evenings",
    transit: "Saphan Taksin BTS · Sathorn Pier",
    walk: "3/5 · heat and pier transfers matter",
    hotel: {
      name: "Chatrium Hotel Riverside Bangkok",
      score: "9.3",
      scale: "10",
      platform: "Booking.com",
      category: "Riverside hotel · boat connection",
      count: 4541,
      positive: "Verified stays repeatedly value the large rooms, balconies, river views, pool, breakfast, staff and hotel boat.",
      watch: "The river base works best when the boat timetable suits the day. Recheck the shuttle schedule; road taxis slow at peak.",
      source: "https://www.booking.com/hotel/th/chatrium-hotel-riverside-bangkok.html?came_from_hotel_review=1&keep_landing=1",
    },
    food: {
      name: "Prachak Roasted Duck",
      score: "4.2",
      scale: "5",
      platform: "Tripadvisor",
      category: "Roast duck · old-school shophouse",
      count: 483,
      positive: "Public reviews often mention roast duck, crispy pork, value and quick service in a no-frills room.",
      watch: "Expect a busy, practical meal rather than a polished dining room. There is no parking and mixed meat can be fatty.",
      source: "https://www.tripadvisor.com/Restaurant_Review-g293916-d2095518-Reviews-Prachak_Roasted_Duck_Restaurant-Bangkok.html",
    },
    move: {
      name: "River + rail hand-off",
      score: "BOAT",
      scale: "BTS",
      platform: "Operator guidance",
      category: "Sathorn Pier · Saphan Taksin",
      positive: "The boat-to-BTS hand-off can turn the river into a practical north–south route instead of a scenic detour.",
      watch: "Boat flags and operating days vary. Confirm the hotel shuttle and public-boat timetable before an evening return.",
      source: "https://www.chaophrayaexpressboat.com/chaophrayaexpressboat?lang=en",
    },
    daypart: {
      name: "River light before the road peak",
      score: "16:30",
      scale: "START",
      platform: "Driftwise daypart lens",
      category: "Late afternoon · evening",
      positive: "Late light gives the river base its strongest atmosphere, while Charoen Krung dining can carry the evening.",
      watch: "Build the return around the last usable boat or choose a road backup before committing to a late plan.",
      source: "https://www.tourismthailand.org/Destinations/Provinces/bangkok/219",
    },
  },
  sukhumvit: {
    code: "AS",
    name: "Sukhumvit / Asok",
    region: "EAST CORE · DUAL-LINE INTERCHANGE",
    coordinates: [13.7375, 100.5605],
    labelSide: "left",
    image: "../assets/travel/bangkok/sukhumvit-after-rain.jpg",
    imageAlt: "AI-created editorial artwork inspired by Sukhumvit after tropical rain",
    summary: "Excellent east–west mobility and late-day choice, with the BTS–MRT interchange doing most of the heavy lifting.",
    fit: "Nightlife · work trips · broad dining",
    transit: "Asok BTS · Sukhumvit MRT",
    walk: "3/5 · soi depth changes the last kilometre",
    hotel: {
      name: "Carlton Hotel Bangkok Sukhumvit",
      score: "9.3",
      scale: "10",
      platform: "Booking.com",
      category: "Premium city hotel · dual-line access",
      count: 5665,
      positive: "Verified-stay scores are strongest for cleanliness, comfort, breakfast, staff and the central location.",
      watch: "This is a premium price band. Traffic-sensitive sleepers should ask about a quieter room position.",
      source: "https://www.booking.com/hotel/th/carlton-bangkok-sukhumvit.en-gb.html",
    },
    food: {
      name: "Sri Trat",
      score: "4.3",
      scale: "5",
      platform: "Tripadvisor",
      category: "Eastern Thai · seafood · bold spice",
      count: 275,
      positive: "Public reviews often value the Eastern Thai flavours, seafood, polished setting and confident seasoning.",
      watch: "Some dishes are spicy and portions can feel small. Popular services may use time-limited tables, so reserve and confirm.",
      source: "https://www.tripadvisor.com/Restaurant_Review-g293916-d12051193-Reviews-Sri_Trat_Restaurant_Bar-Bangkok.html",
    },
    move: {
      name: "Bangkok's useful two-line hinge",
      score: "2",
      scale: "LINES",
      platform: "BTS + BEM guidance",
      category: "BTS Asok ↔ MRT Sukhumvit",
      positive: "The interchange links east–west BTS travel with the MRT Blue Line, reducing many cross-city taxi decisions.",
      watch: "A venue can be ‘in Sukhumvit’ yet sit deep inside a soi. Price the first and last kilometre, not only the rail trip.",
      source: "https://metro.bemplc.co.th/MRT-System-Map?lang=en",
    },
    daypart: {
      name: "Save the east side for late-day energy",
      score: "17:30",
      scale: "START",
      platform: "Driftwise daypart lens",
      category: "Late afternoon · night",
      positive: "Cafés, dinner and nightlife give the district its strongest range after the hottest walking hours.",
      watch: "Late trains do not all reach every station at the published closing time. Check the final reachable journey.",
      source: "https://www.bts.co.th/eng/traintime-frequency/",
    },
  },
  silom: {
    code: "SL",
    name: "Silom / Sathorn",
    region: "SOUTH CORE · BUSINESS + DINING",
    coordinates: [13.7258, 100.5294],
    labelSide: "left",
    image: "../assets/travel/bangkok/sukhumvit-after-rain.jpg",
    imageAlt: "AI-created editorial artwork inspired by Bangkok's elevated rail and skyline after rain",
    summary: "A useful hybrid base: rail, serious dining, Lumphini-side green space and old Bang Rak food streets sit within one wider district.",
    fit: "Business · dining · river access",
    transit: "Sala Daeng / Chong Nonsi BTS · Si Lom MRT",
    walk: "3/5 · commuter and lunch peaks differ",
    hotel: {
      name: "The Standard, Bangkok Mahanakhon",
      score: "9.2",
      scale: "10",
      platform: "Booking.com",
      category: "Design hotel · skyline + transit",
      count: 1052,
      positive: "Verified stays repeatedly value the design, gym, pool, breakfast, skyline setting and transit access.",
      watch: "The public value subscore is lower than its design and comfort signals. Premium positioning is part of the choice.",
      source: "https://www.booking.com/hotel/th/the-standard-bangkok-mahanakhon.en-gb.html",
    },
    food: {
      name: "Somtum Der Sala Daeng",
      score: "4.1",
      scale: "5",
      platform: "Tripadvisor",
      category: "Isan · som tam · sticky rice",
      count: 493,
      positive: "Public reviews frequently mention vivid Isan flavours, som tam and dishes designed to share with sticky rice.",
      watch: "Busy periods and delivery orders can slow the room. It is priced above a street-side som tam stop.",
      source: "https://www.tripadvisor.com/Restaurant_Review-g293916-d2699084-Reviews-Somtum_Der_Sala_Daeng-Bangkok.html",
    },
    move: {
      name: "Three useful directions, one wide district",
      score: "3",
      scale: "MODES",
      platform: "Operator guidance",
      category: "BTS · MRT · river approach",
      positive: "BTS, MRT and the Saphan Taksin river approach make Silom–Sathorn unusually flexible for work, parks and dinner.",
      watch: "Weekday lunch, commuter peaks and nightlife create very different versions of the same streets.",
      source: "https://www.bts.co.th/eng/routemap.html",
    },
    daypart: {
      name: "Let the district change after work",
      score: "18:00",
      scale: "SHIFT",
      platform: "Driftwise daypart lens",
      category: "Evening dining · park edge",
      positive: "The business grid softens into dinner streets, rooftops and river-facing options after the commuter peak.",
      watch: "Do not judge a weekend evening by a weekday lunch map; opening patterns and street energy differ.",
      source: "https://www.tourismthailand.org/Destinations/Provinces/bangkok/219",
    },
  },
  "old-town": {
    code: "OT",
    name: "Rattanakosin",
    region: "OLD TOWN · TEMPLES + PIERS",
    coordinates: [13.75, 100.4935],
    labelSide: "right",
    image: "../assets/travel/bangkok/rattanakosin-morning.jpg",
    imageAlt: "AI-created editorial artwork inspired by Rattanakosin in the early morning",
    summary: "The strongest culture-first base: the river and temple quarter are close in map distance, but walls, crossings and pier transfers slow the day.",
    fit: "First-time culture · early starts",
    transit: "Sanam Chai / Sam Yot MRT · river boats",
    walk: "4/5 · high midday exposure",
    hotel: {
      name: "Riva Arun Bangkok",
      score: "9.1",
      scale: "10",
      platform: "Booking.com",
      category: "Boutique river view · temple access",
      count: 491,
      positive: "Verified-stay scores are strongest for location and staff; public themes also value the Wat Arun view and walkable temple-and-pier setting.",
      watch: "There is no pool, and the landmark view depends on the room type. Confirm exactly what the booking includes.",
      source: "https://www.booking.com/hotel/th/riva-arun-bangkok.html",
    },
    food: {
      name: "Krua Apsorn Dinso",
      score: "4.3",
      scale: "5",
      platform: "Tripadvisor",
      category: "Central Thai · crab dishes",
      count: 344,
      positive: "Public reviews often value the crab dishes, mackerel, family-style Thai cooking and accessible price point.",
      watch: "Queues and early closing matter. Expect a practical room and check current hours before making a special trip.",
      source: "https://www.tripadvisor.com/Restaurant_Review-g293916-d4404973-Reviews-Krua_Apsorn-Bangkok.html",
    },
    move: {
      name: "MRT first, then walk the walls",
      score: "MRT",
      scale: "PIER",
      platform: "BEM + boat guidance",
      category: "Sanam Chai · Sam Yot · river",
      positive: "The MRT Blue Line removes much of the old access problem; boats can then connect the river-facing sights.",
      watch: "Paid-area exits, walls, crossings and pier transfers add minutes. Map distance is not door-to-door time.",
      source: "https://metro.bemplc.co.th/MRT-System-Map?lang=en",
    },
    daypart: {
      name: "Give Old Town the first light",
      score: "06:30",
      scale: "START",
      platform: "Driftwise daypart lens",
      category: "Morning · culture first",
      positive: "An early start reduces heat exposure and gives the river, temple quarter and old streets more breathing room.",
      watch: "Build in an air-conditioned midday pause and check the last boat before a river-led evening.",
      source: "https://www.tourismthailand.org/Destinations/Provinces/bangkok/219",
    },
  },
  ari: {
    code: "AR",
    name: "Ari",
    region: "NORTH CORE · LOCAL PACE",
    coordinates: [13.7798, 100.5448],
    labelSide: "left",
    image: "../assets/travel/bangkok/rattanakosin-morning.jpg",
    imageAlt: "AI-created editorial artwork inspired by a quiet Bangkok neighbourhood morning",
    summary: "Choose Ari for a café-rich everyday neighbourhood on the BTS line; accept the side-street walk and a slower connection to Old Town.",
    fit: "Cafés · repeat visitors · slower rhythm",
    transit: "Ari BTS · Mo Chit for Chatuchak",
    walk: "4/5 · side streets add first/last mile",
    hotel: {
      name: "Craftsman Bangkok",
      score: "8.8",
      scale: "10",
      platform: "Booking.com",
      category: "Boutique hotel · neighbourhood feel",
      count: 445,
      positive: "Verified stays often value the boutique design, staff, rooms, pool and breakfast; a tuk-tuk supports the BTS connection.",
      watch: "It is not station-door: the public location and Wi-Fi subscores trail the strongest parts of the stay.",
      source: "https://www.booking.com/hotel/th/craftsman-bangkok.en-gb.html?came_from_hotel_review=1&keep_landing=1",
    },
    food: {
      name: "LayLao Aree",
      score: "4.5",
      scale: "5",
      platform: "Tripadvisor",
      category: "Isan + seafood · MICHELIN-listed",
      count: 110,
      positive: "Public reviews frequently mention seafood, papaya salad and crab curry in a lively neighbourhood setting.",
      watch: "Spice levels matter, popular fish can sell out and service timing varies. MICHELIN-listed does not mean starred.",
      source: "https://www.tripadvisor.com/Restaurant_Review-g293916-d7355296-Reviews-LayLao_Aree-Bangkok.html",
    },
    move: {
      name: "Simple rail, less simple last kilometre",
      score: "BTS",
      scale: "WALK",
      platform: "BTS guidance",
      category: "Ari · Mo Chit connection",
      positive: "Ari sits on the BTS Sukhumvit Line and keeps Siam within a straightforward rail journey.",
      watch: "The useful cafés and hotels spread into side streets. Chatuchak adds much more midday walking when it is the trip anchor.",
      source: "https://www.bts.co.th/eng/routemap.html",
    },
    daypart: {
      name: "A slower morning before the city core",
      score: "08:00",
      scale: "START",
      platform: "Driftwise daypart lens",
      category: "Morning cafés · weekend market",
      positive: "Ari works as a calmer breakfast-and-coffee base before rail travel south; weekend visitors can continue to Chatuchak.",
      watch: "Chatuchak is vast, hot and weekend-led. Treat it as a dedicated block, not a small add-on.",
      source: "https://www.tourismthailand.org/Articles/bangkok-flea-markets-adventurous-shopping-experience",
    },
  },
  siam: {
    code: "SI",
    name: "Siam / Chit Lom",
    region: "CENTRAL INTERCHANGE · ALL-WEATHER",
    coordinates: [13.7442, 100.5402],
    labelSide: "right",
    image: "../assets/travel/bangkok/bangkok-river-blue-hour.jpg",
    imageAlt: "AI-created editorial artwork inspired by central Bangkok at dusk",
    summary: "The easiest all-weather base: fast rail access, connected malls and abundant dining make a first Bangkok stay more forgiving.",
    fit: "First visits · families · rainy days",
    transit: "Siam / Chit Lom BTS · skywalk network",
    walk: "2/5 · indoor and skywalk relief",
    hotel: {
      name: "Sindhorn Midtown Hotel Bangkok",
      score: "9.2",
      scale: "10",
      platform: "Booking.com",
      category: "Calm central hotel · pool + skywalk access",
      count: 2942,
      positive: "Verified stays repeatedly value the clean spacious rooms, staff, breakfast, elevated pool and calm-but-central location.",
      watch: "Allow around ten minutes for the skywalk or BTS connection; public value and Wi-Fi scores sit below its strongest signals.",
      source: "https://www.booking.com/hotel/th/sindhorn-midtown-bangkok.html",
    },
    food: {
      name: "The House of Smooth Curry",
      score: "4.8",
      scale: "5",
      platform: "Tripadvisor",
      category: "Four-region Thai · refined dining",
      count: 1590,
      positive: "Public reviews often value the regional curries, calm refined room, warm service and perceived value for fine dining.",
      watch: "It is a high spending level, and occasional public feedback notes slower pacing at busy times.",
      source: "https://www.tripadvisor.com/Restaurant_Review-g293916-d1674191-Reviews-The_House_Of_Smooth_Curry-Bangkok.html",
    },
    move: {
      name: "The most forgiving first interchange",
      score: "BTS",
      scale: "HUB",
      platform: "BTS guidance",
      category: "Siam interchange · Chit Lom skywalk",
      positive: "Two BTS directions, connected malls and long sheltered links reduce many heat and rain interruptions.",
      watch: "Interchange crowds are the compromise, and the district offers less neighbourhood texture than the river or old quarters.",
      source: "https://www.bts.co.th/eng/routemap.html",
    },
    daypart: {
      name: "Use Siam when the weather closes in",
      score: "12:30",
      scale: "RESET",
      platform: "Driftwise daypart lens",
      category: "Midday · rain fallback",
      positive: "Food halls, museums, connected malls and rail make Siam the easiest place to absorb heat or a sudden rain window.",
      watch: "Convenience replaces some local texture. Use the district as a reset, not necessarily the whole Bangkok story.",
      source: "https://www.tourismthailand.org/Destinations/Provinces/bangkok/219",
    },
  },
};

const intentMatches = {
  balanced: ["siam", "Siam · let the interchange absorb the difficult days", "BTS connections, skywalks and indoor options make a first Bangkok stay more forgiving in heat or rain. The compromise is less neighbourhood texture."],
  culture: ["old-town", "Rattanakosin · put old Bangkok before the transfer", "Start early near the temples, piers and historic streets. Walls, crossings and midday heat are the trade-offs."],
  nightlife: ["sukhumvit", "Asok · finish close to the late-day city", "BTS and MRT do the daytime work; dining and nightlife remain close after dark. Check the real depth of the soi."],
  food: ["silom", "Silom / Bang Rak · connect serious food to useful rail", "Office lunches, roast meats, Isan flavours and polished dining share a wider district with BTS, MRT and river access."],
  family: ["siam", "Siam · build in an all-weather escape", "Connected malls, food choice and rail reduce the cost of heat or rain. Expect crowds and a more polished city texture."],
  slow: ["ari", "Ari · trade landmark density for neighbourhood rhythm", "Ari offers cafés, everyday streets and a calmer return base. Side streets and longer journeys to Old Town are the compromise."],
};

const mapCanvas = document.querySelector("#bangkok-map");
const lensButtons = document.querySelectorAll("[data-map-lens]");
const mapReset = document.querySelector("#map-reset");
const dossier = document.querySelector("#city-dossier");
const dossierArt = document.querySelector("#dossier-art");
const dossierCaption = document.querySelector("#dossier-caption");
const dossierRegion = document.querySelector("#dossier-region");
const dossierName = document.querySelector("#dossier-name");
const dossierCode = document.querySelector("#dossier-code");
const dossierSummary = document.querySelector("#dossier-summary");
const signalKicker = document.querySelector("#signal-kicker");
const signalCategory = document.querySelector("#signal-category");
const signalScore = document.querySelector("#signal-score");
const signalName = document.querySelector("#signal-name");
const signalPositive = document.querySelector("#signal-positive");
const signalWatch = document.querySelector("#signal-watch");
const signalCount = document.querySelector("#signal-count");
const signalSource = document.querySelector("#signal-source");
const factFit = document.querySelector("#fact-fit");
const factTransit = document.querySelector("#fact-transit");
const factWalk = document.querySelector("#fact-walk");

let cityMap = null;
let routeThread = null;
let activeDistrictId = "riverside";
let activeLens = "hotel";

const lensNames = { hotel: "STAY LENS", food: "EAT LENS", move: "MOVE LENS", daypart: "DAYPART LENS" };
const cityBounds = [[13.695, 100.475], [13.813, 100.592]];
const loomOrigin = [13.7442, 100.5402];

function showWholeCity() {
  if (!cityMap) return;
  const mapPadding = window.innerWidth > 1120
    ? { paddingTopLeft: [52, 52], paddingBottomRight: [540, 52] }
    : { padding: [52, 52] };
  cityMap.fitBounds(cityBounds, mapPadding);
}

function drawEditorialNetwork() {
  if (!cityMap || !window.L) return;

  const riverPath = [
    [13.812, 100.512], [13.788, 100.504], [13.768, 100.493], [13.748, 100.489],
    [13.731, 100.501], [13.716, 100.515], [13.704, 100.509], [13.691, 100.501],
  ];
  L.polyline(riverPath, { color: "#2e8586", weight: 13, opacity: 0.48, interactive: false, lineCap: "round" }).addTo(cityMap);
  L.polyline(riverPath, { color: "#e7dfd0", weight: 2, opacity: 0.68, interactive: false, dashArray: "2 11", lineCap: "round" }).addTo(cityMap);

  const sukhumvitLine = [[13.803, 100.554], [13.7798, 100.5448], [13.7442, 100.5402], [13.7375, 100.5605], [13.731, 100.585]];
  const silomLine = [[13.7442, 100.5402], [13.7286, 100.534], [13.72, 100.5145]];
  const blueLine = [[13.806, 100.54], [13.776, 100.51], [13.75, 100.4935], [13.742, 100.511], [13.726, 100.5294], [13.7375, 100.5605]];
  L.polyline(sukhumvitLine, { color: "#a3483b", weight: 4, opacity: 0.62, interactive: false, dashArray: "8 7" }).addTo(cityMap);
  L.polyline(silomLine, { color: "#a3483b", weight: 4, opacity: 0.62, interactive: false, dashArray: "8 7" }).addTo(cityMap);
  L.polyline(blueLine, { color: "#1f6868", weight: 4, opacity: 0.62, interactive: false, dashArray: "8 7" }).addTo(cityMap);

  routeThread = L.polyline([loomOrigin, districts.riverside.coordinates], {
    color: "#c69a52", weight: 6, opacity: 0.94, interactive: false, lineCap: "round", className: "route-thread",
  }).addTo(cityMap);
}

function renderFallbackMap() {
  if (!mapCanvas) return;
  mapCanvas.classList.add("is-unavailable");
  mapCanvas.innerHTML = `
    <div class="fallback-city" role="group" aria-label="Editorial fallback map of six Bangkok districts">
      <svg viewBox="0 0 1000 760" aria-hidden="true" focusable="false">
        <path class="fallback-river" d="M110,-20 C180,110 90,190 195,285 C295,375 180,455 305,560 C365,612 330,702 420,790" />
        <path class="fallback-rail fallback-rail-red" d="M760,60 L600,210 L510,365 L705,500 L890,650" />
        <path class="fallback-rail fallback-rail-red" d="M510,365 L465,510 L315,600" />
        <path class="fallback-rail fallback-rail-blue" d="M710,40 C530,120 290,250 275,390 C270,485 455,520 705,500" />
        <path class="fallback-thread" d="M510,365 C430,430 350,510 315,600" />
      </svg>
      <p class="fallback-title"><span>BANGKOK ROUTE LOOM</span><strong>River · rail · six return bases</strong></p>
      <button type="button" data-fallback-area="riverside" style="--x:31%;--y:76%"><b>RV</b><span>Riverside</span></button>
      <button type="button" data-fallback-area="sukhumvit" style="--x:54%;--y:61%"><b>AS</b><span>Asok</span></button>
      <button type="button" data-fallback-area="silom" style="--x:43%;--y:65%"><b>SL</b><span>Silom</span></button>
      <button type="button" data-fallback-area="old-town" style="--x:27%;--y:49%"><b>OT</b><span>Old Town</span></button>
      <button type="button" data-fallback-area="ari" style="--x:52%;--y:18%"><b>AR</b><span>Ari</span></button>
      <button type="button" data-fallback-area="siam" style="--x:47%;--y:46%"><b>SI</b><span>Siam</span></button>
    </div>`;
  document.querySelector(".map-note")?.replaceChildren(document.createTextNode("EDITORIAL FALLBACK MAP · DISTRICT POSITIONS AND CORRIDORS ARE PLANNING REFERENCES, NOT PROPERTY OR STATION LOCATIONS"));
  mapCanvas.querySelectorAll("[data-fallback-area]").forEach((button) => {
    button.addEventListener("click", () => selectDistrict(button.dataset.fallbackArea));
  });
}

function renderMap() {
  if (!mapCanvas) return;
  if (!window.L) {
    renderFallbackMap();
    return;
  }

  mapCanvas.querySelector(".map-loading")?.remove();
  cityMap = L.map(mapCanvas, { attributionControl: true, zoomControl: false, scrollWheelZoom: false, minZoom: 10, maxZoom: 17 });
  L.control.zoom({ position: "topright" }).addTo(cityMap);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    minZoom: 10,
    maxZoom: 17,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(cityMap);
  showWholeCity();
  drawEditorialNetwork();

  Object.entries(districts).forEach(([districtId, district]) => {
    const marker = L.marker(district.coordinates, {
      icon: L.divIcon({
        className: "loom-marker",
        html: `<span class="loom-pin" aria-hidden="true">${district.code}</span><span class="loom-label">${district.name}</span>`,
        iconSize: [42, 42],
        iconAnchor: [21, 35],
      }),
      keyboard: true,
      riseOnHover: true,
      title: `Show ${district.name}`,
      alt: `${district.name} district marker`,
    }).addTo(cityMap);
    const markerElement = marker.getElement();
    if (markerElement) {
      markerElement.dataset.mapArea = districtId;
      markerElement.dataset.labelSide = district.labelSide;
      markerElement.setAttribute("role", "button");
      markerElement.setAttribute("aria-label", `Show ${district.name} stay, food, transport and daypart evidence`);
      markerElement.setAttribute("aria-pressed", districtId === activeDistrictId ? "true" : "false");
    }
    marker.on("click", () => selectDistrict(districtId, { focus: true }));
  });

  window.addEventListener("resize", () => cityMap?.invalidateSize(), { passive: true });
}

function setScore(score, scale) {
  signalScore.textContent = score;
  const suffix = document.createElement("small");
  suffix.textContent = scale ? `/${scale}` : "";
  signalScore.append(suffix);
}

function signalMeta(signal, lens) {
  if (lens === "hotel") return `${signal.count.toLocaleString()} verified-stay reviews · checked ${reviewedOn}`;
  if (lens === "food") return `${signal.count.toLocaleString()} public reviews · checked ${reviewedOn}`;
  if (lens === "move") return `Official operator guidance · checked ${reviewedOn}`;
  return `Driftwise editorial planning lens · checked ${reviewedOn}`;
}

function sourceLabel(signal, lens) {
  if (lens === "hotel" || lens === "food") return `Check current ${signal.platform} page ↗`;
  if (lens === "move") return "Check current operator guidance ↗";
  return "Open supporting public source ↗";
}

function animateRouteTo(coordinates) {
  if (!routeThread) return;
  const midpoint = [
    ((loomOrigin[0] + coordinates[0]) / 2) + 0.004,
    ((loomOrigin[1] + coordinates[1]) / 2) - 0.004,
  ];
  routeThread.setLatLngs([loomOrigin, midpoint, coordinates]);
  const path = routeThread.getElement();
  if (!path) return;
  path.classList.remove("is-drawing");
  void path.getBoundingClientRect();
  path.classList.add("is-drawing");
}

function selectDistrict(districtId, { focus = false } = {}) {
  const district = districts[districtId] || districts.riverside;
  activeDistrictId = districts[districtId] ? districtId : "riverside";
  const signal = district[activeLens];

  document.querySelectorAll("[data-map-area]").forEach((marker) => {
    const isActive = marker.dataset.mapArea === activeDistrictId;
    marker.classList.toggle("is-active", isActive);
    marker.setAttribute("aria-pressed", String(isActive));
  });
  document.querySelectorAll("[data-fallback-area]").forEach((marker) => {
    const isActive = marker.dataset.fallbackArea === activeDistrictId;
    marker.classList.toggle("is-active", isActive);
    marker.setAttribute("aria-pressed", String(isActive));
  });

  dossierArt.src = district.image;
  dossierArt.alt = district.imageAlt;
  dossierCaption.textContent = `${district.name.toUpperCase()} · AI-CREATED ATMOSPHERE, NOT PROPERTY PHOTOGRAPHY`;
  dossierRegion.textContent = district.region;
  dossierName.textContent = district.name;
  dossierCode.textContent = district.code;
  dossierSummary.textContent = district.summary;
  signalKicker.textContent = `${lensNames[activeLens]} · ${signal.platform.toUpperCase()}`;
  signalCategory.textContent = signal.category;
  setScore(signal.score, signal.scale);
  signalName.textContent = signal.name;
  signalPositive.textContent = signal.positive;
  signalWatch.textContent = signal.watch;
  signalCount.textContent = signalMeta(signal, activeLens);
  signalSource.href = signal.source;
  signalSource.textContent = sourceLabel(signal, activeLens);
  factFit.textContent = district.fit;
  factTransit.textContent = district.transit;
  factWalk.textContent = district.walk;

  dossier.animate?.([{ opacity: 0.74, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 230, easing: "ease-out" });
  animateRouteTo(district.coordinates);
  if (focus) cityMap?.flyTo(district.coordinates, 13, { duration: 0.7 });
}

function setLens(lens) {
  if (!lensNames[lens]) return;
  activeLens = lens;
  mapCanvas?.setAttribute("data-lens", lens);
  lensButtons.forEach((button) => {
    const isActive = button.dataset.mapLens === lens;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  selectDistrict(activeDistrictId);
}

document.querySelector("#district-finder")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const intent = new FormData(event.currentTarget).get("intent") || "balanced";
  const [districtId, title, copy] = intentMatches[intent] || intentMatches.balanced;
  document.querySelector("#answer-code").textContent = districts[districtId].code;
  document.querySelector("#answer-title").textContent = title;
  document.querySelector("#answer-copy").textContent = copy;
  document.querySelector("#answer-link").dataset.focusArea = districtId;
  selectDistrict(districtId);
});

lensButtons.forEach((button) => button.addEventListener("click", () => setLens(button.dataset.mapLens)));
mapReset?.addEventListener("click", showWholeCity);
document.querySelectorAll("[data-focus-area]").forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();
    selectDistrict(control.dataset.focusArea, { focus: true });
    document.querySelector("#loom")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const authDialog = document.querySelector("#auth-dialog");
const paymentStatus = document.querySelector("#payment-status");
const accountSetup = document.querySelector("#account-setup");
const purchasedGuide = document.querySelector("#purchased-guide");
const purchasedMeta = document.querySelector("#purchased-meta");
const premiumContent = document.querySelector("#premium-guide-content");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeSourceUrl(value) {
  try {
    const parsed = new URL(String(value));
    return parsed.protocol === "https:" ? parsed.href : "#";
  } catch {
    return "#";
  }
}

async function responseJson(response) {
  try { return await response.json(); }
  catch { return {}; }
}

function setPaymentStatus(message, kind = "pending") {
  if (!paymentStatus) return;
  paymentStatus.hidden = false;
  paymentStatus.textContent = message;
  paymentStatus.classList.toggle("is-error", kind === "error");
}

function updateAccountButtons() {
  document.querySelectorAll("[data-open-auth]").forEach((button) => {
    button.textContent = accessState.signedIn
      ? "Sign out"
      : (button.classList.contains("returning-reader") ? "Already purchased? Reader sign in" : "Reader sign in");
  });
}

function sampleCard(sample, type) {
  const positives = Array.isArray(sample?.recurringPositives) ? sample.recurringPositives.join(" · ") : "";
  const source = safeSourceUrl(sample?.source);
  return `<article class="premium-sample">
    <span>${escapeHtml(type)} · ${escapeHtml(sample?.platform)} · ${escapeHtml(sample?.role || "sample")}</span>
    <h4>${escapeHtml(sample?.name)}</h4>
    <strong class="premium-score">${escapeHtml(sample?.score)}/${escapeHtml(sample?.scale)} · ${Number(sample?.reviews || 0).toLocaleString()} reviews</strong>
    <p><b>Recurring public themes:</b> ${escapeHtml(positives)}</p>
    <p><b>Pause:</b> ${escapeHtml(sample?.watchOut)}</p>
    <a href="${escapeHtml(source)}" target="_blank" rel="noreferrer">Check current source ↗</a>
  </article>`;
}

function renderPurchasedGuide(guide) {
  if (!guide || !premiumContent || !purchasedGuide) return;
  const quickChoices = Array.isArray(guide.decisionFrame?.quickChoices) ? guide.decisionFrame.quickChoices : [];
  const areas = Array.isArray(guide.areas) ? guide.areas : [];
  purchasedMeta.textContent = `${guide.meta?.edition || "Bangkok edition"} · evidence checked ${guide.meta?.checked || "2026-08-31"} · permanent account access`;
  premiumContent.innerHTML = `<div class="premium-guide">
    <section class="premium-question"><h3>${escapeHtml(guide.decisionFrame?.primaryQuestion)}</h3><p>${escapeHtml(guide.meta?.scope)}</p></section>
    <div class="premium-quick-grid">${quickChoices.map((choice) => `<article><span>${escapeHtml(choice.need)}</span><h4>${escapeHtml(choice.choose)}</h4><p>${escapeHtml(choice.because)}</p></article>`).join("")}</div>
    <div class="premium-area-list">${areas.map((area) => `<article class="premium-area">
      <div class="premium-area-head">
        <div><span>${escapeHtml((area.bestFor || []).join(" · "))}</span><h3>${escapeHtml(area.name)}</h3><p>${escapeHtml(area.rhythm)}</p></div>
        <dl><div><dt>Transit anchor</dt><dd>${escapeHtml(area.transit?.primary)}</dd></div><div><dt>Walking reality</dt><dd>${escapeHtml(area.walking)}</dd></div><div><dt>Pause if</dt><dd>${escapeHtml(area.avoidIf)}</dd></div></dl>
      </div>
      <div class="premium-samples">${(area.hotelShortlist || []).map((sample) => sampleCard(sample, "STAY")).join("")}${(area.diningShortlist || []).map((sample) => sampleCard(sample, "EAT")).join("")}</div>
    </article>`).join("")}</div>
    <p class="premium-disclaimer">${escapeHtml(guide.meta?.snapshotDisclaimer)} ${escapeHtml(guide.meta?.ratingsDisclaimer)} ${escapeHtml(guide.meta?.reviewsDisclaimer)}</p>
  </div>`;
  purchasedGuide.hidden = false;
}

async function loadPurchasedGuide(sessionId = "", retry = false) {
  const params = new URLSearchParams({ guide_id: BANGKOK_GUIDE_ID });
  if (sessionId) params.set("session_id", sessionId);
  const attempts = retry ? 12 : 1;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(`/api/guide?${params}`, { credentials: "same-origin", cache: "no-store" });
      const result = await responseJson(response);
      if (response.ok && result.guide) {
        renderPurchasedGuide(result.guide);
        paymentStatus.hidden = true;
        if (result.access === "purchase" && !accessState.signedIn) accountSetup.hidden = false;
        return true;
      }
      if (response.status !== 425 || !retry) {
        if (sessionId) setPaymentStatus(result.error || "We could not verify this purchase.", "error");
        return false;
      }
    } catch {
      if (!retry) return false;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 1500));
  }
  setPaymentStatus("Payment confirmation is taking longer than expected. Reload in a minute or contact support with the receipt email.", "error");
  return false;
}

async function checkAccount() {
  try {
    const response = await fetch(`/api/account?guide_id=${encodeURIComponent(BANGKOK_GUIDE_ID)}`, { credentials: "same-origin", cache: "no-store" });
    if (!response.ok) return false;
    const result = await responseJson(response);
    accessState.signedIn = Boolean(result.signedIn);
    updateAccountButtons();
    if (result.guideAccess) return loadPurchasedGuide();
  } catch {
    // The free field edition remains available when account services are unavailable.
  }
  return false;
}

document.querySelectorAll("[data-open-auth]").forEach((button) => {
  button.addEventListener("click", async () => {
    if (accessState.signedIn) {
      await fetch("/api/account", { method: "DELETE", credentials: "same-origin" });
      accessState.signedIn = false;
      purchasedGuide.hidden = true;
      updateAccountButtons();
      document.querySelector("#access")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    authDialog?.showModal();
  });
});

document.querySelector("[data-close-auth]")?.addEventListener("click", () => authDialog?.close());
authDialog?.addEventListener("click", (event) => { if (event.target === authDialog) authDialog.close(); });

document.querySelector("#login-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const message = form.querySelector("[data-login-message]");
  message.textContent = "Checking your account…";
  try {
    const response = await fetch("/api/account", {
      method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "login", guideId: BANGKOK_GUIDE_ID, email: values.get("email"), password: values.get("password") }),
    });
    const result = await responseJson(response);
    if (!response.ok) { message.textContent = result.error || "Sign-in failed."; return; }
    accessState.signedIn = true;
    updateAccountButtons();
    authDialog.close();
    if (result.guideAccess) {
      await loadPurchasedGuide();
      document.querySelector("#purchased-guide")?.scrollIntoView({ behavior: "smooth" });
    } else {
      message.textContent = "This account does not include the Bangkok edition.";
      authDialog.showModal();
    }
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
  if (password !== confirmPassword) { message.textContent = "The two passwords do not match."; return; }
  message.textContent = "Creating your account…";
  try {
    const response = await fetch("/api/account", {
      method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "register", sessionId: accessState.paymentSessionId, password }),
    });
    const result = await responseJson(response);
    if (!response.ok) { message.textContent = result.error || "Account creation failed."; return; }
    accessState.signedIn = true;
    accountSetup.hidden = true;
    updateAccountButtons();
    history.replaceState({}, "", "/bangkok/#purchased-guide");
  } catch {
    message.textContent = "The account service is temporarily unavailable.";
  }
});

async function initializeAccess() {
  const query = new URLSearchParams(window.location.search);
  const sessionId = query.get("session_id") || "";
  accessState.paymentSessionId = /^cs_(?:(?:test|live)_)?[A-Za-z0-9]+$/.test(sessionId) ? sessionId : "";
  await checkAccount();
  if (query.get("login") === "1" && !accessState.signedIn) {
    authDialog?.showModal();
    history.replaceState({}, "", "/bangkok/#access");
  }
  if (accessState.paymentSessionId) {
    setPaymentStatus("Payment received. Preparing your permanent Bangkok reading access…");
    await loadPurchasedGuide(accessState.paymentSessionId, true);
  }
}

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -45px" })
  : null;

document.querySelectorAll(".reveal").forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add("is-visible");
});

renderMap();
setLens("hotel");
initializeAccess();
