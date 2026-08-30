const paymentSession = new URLSearchParams(window.location.search).get("session_id") || "";
if (/^cs_(?:(?:test|live)_)?[A-Za-z0-9]+$/.test(paymentSession)) {
  window.location.replace(`/phuket/?session_id=${encodeURIComponent(paymentSession)}#guide`);
}

const coastProfiles = {
  "nai-yang": {
    name: "Nai Yang",
    summary: "For a quiet landing, short airport transfer and a beach beside Sirinat National Park. It is a poor base if most of your plans sit around Patong or the southern viewpoints.",
    mood: "Quiet and low-friction",
    fit: "Late arrivals · slow travel",
    check: "Longer trips to the south",
  },
  patong: {
    name: "Patong",
    summary: "The highest-convenience choice for nightlife, shopping and a dense range of restaurants. Choose it deliberately: central access comes with traffic, crowds and a greater chance of street noise.",
    mood: "Busy and highly connected",
    fit: "Nightlife · short first visits",
    check: "Room position affects noise",
  },
  kata: {
    name: "Kata",
    summary: "A practical first beach stay for couples and families who want restaurants nearby without Patong intensity. Hills and indirect hotel entrances can make a short map distance feel longer.",
    mood: "Balanced and family-friendly",
    fit: "First stays · beach days",
    check: "Check the real walking route",
  },
  karon: {
    name: "Karon",
    summary: "A long open beach with more breathing room than central Patong. It suits travellers who accept a more spread-out district and plan their evening transport instead of expecting everything on one block.",
    mood: "Open beach and more space",
    fit: "Long walks · relaxed couples",
    check: "The district is spread out",
  },
  "nai-harn": {
    name: "Nai Harn",
    summary: "A scenic southern option for travellers who care more about the beach and a slower day than nightlife access. It is less convenient for airport runs and repeated trips to Patong or Old Town.",
    mood: "Scenic and slower",
    fit: "Beach-first · repeat visitors",
    check: "Less convenient without a plan",
  },
  "old-town": {
    name: "Phuket Old Town",
    summary: "The strongest cultural base for architecture, cafés and local food, with a walkable core. It is not a beach stay: every west-coast beach day adds time and transport planning.",
    mood: "Cultural and walkable",
    fit: "Food · architecture · short stays",
    check: "No beach outside the door",
  },
};

const intentMatches = {
  balanced: ["kata", "Kata · beach days without Patong intensity"],
  quiet: ["nai-yang", "Nai Yang · the quietest low-friction arrival"],
  family: ["kata", "Kata · family ease with beach and dining nearby"],
  nightlife: ["patong", "Patong · keep nightlife within the same district"],
  food: ["old-town", "Old Town · put food and culture outside the door"],
  value: ["old-town", "Old Town · stronger room value if the beach is not daily"],
};

const finderResult = document.querySelector("#finder-result");
const coastReading = document.querySelector("#coast-reading");
const resultGain = document.querySelector("#result-gain");
const resultTradeoff = document.querySelector("#result-tradeoff");
const resultFit = document.querySelector("#result-fit");

function selectCoast(coastId) {
  const coast = coastProfiles[coastId] || coastProfiles.kata;
  document.querySelectorAll("[data-coast]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.coast === coastId);
  });
  coastReading.querySelector("h3").textContent = coast.name;
  coastReading.querySelector("div > p:last-child").textContent = coast.summary;
  const values = coastReading.querySelectorAll("dd");
  values[0].textContent = coast.mood;
  values[1].textContent = coast.fit;
  values[2].textContent = coast.check;
}

document.querySelectorAll("[data-coast]").forEach((button) => {
  button.addEventListener("click", () => selectCoast(button.dataset.coast));
});

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
