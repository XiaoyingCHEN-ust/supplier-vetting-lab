const filters = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll(".scenic-card[data-category]");
const status = document.querySelector("#gallery-status");

const categoryLabels = {
  all: "Phuket",
  south: "south-coast",
  west: "west-coast",
  heritage: "Old Town",
  north: "quiet-north",
  bay: "bay-day-trip",
};

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    let visibleCount = 0;

    filters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", String(active));
    });

    cards.forEach((card) => {
      const visible = selected === "all" || card.dataset.category === selected;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    const noun = visibleCount === 1 ? "visual" : "visuals";
    status.textContent = selected === "all"
      ? `Showing all ${visibleCount} Phuket ${noun}`
      : `Showing ${visibleCount} ${categoryLabels[selected] || selected} ${noun}`;
  });
});

const observed = document.querySelectorAll(".scenic-card, .gallery-intro, .license-section");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  observed.forEach((item) => observer.observe(item));
} else {
  observed.forEach((item) => item.classList.add("is-visible"));
}
