const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.background-card[data-category]');
const status = document.querySelector('#gallery-status');

const categoryLabels = {
  all: 'all',
  business: 'business',
  pets: 'cute-pet',
  landscapes: 'landscape',
  life: 'everyday-life',
};

filters.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    let visibleCount = 0;

    filters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    });

    cards.forEach((card) => {
      const visible = selected === 'all' || card.dataset.category === selected;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    const label = categoryLabels[selected] || selected;
    const noun = visibleCount === 1 ? 'background' : 'backgrounds';
    status.textContent = selected === 'all'
      ? `Showing all ${visibleCount} ${noun}`
      : `Showing ${visibleCount} ${label} ${noun}`;
  });
});
