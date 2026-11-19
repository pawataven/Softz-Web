/*
  Work page filters: category (buttons) AND design style (dropdown). Both live in the URL hash so a filtered view
  can be shared: #crm, #style=luxury, #demo&style=minimal.
*/
const results = document.querySelector<HTMLElement>('[data-work-results]');
const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-work-filter] [data-filter]')];
const styleSelect = document.querySelector<HTMLSelectElement>('[data-style-filter]');

if (results && buttons.length) {
  const grid = results.querySelector<HTMLElement>('.cases')!;
  const bar = results.querySelector<HTMLElement>('[data-work-filter]')!;
  const cases = [...grid.querySelectorAll<HTMLElement>('[data-cat]')];
  const emptyStates = [...grid.querySelectorAll<HTMLElement>('[data-empty-for]')];
  const moreSoon = grid.querySelector<HTMLElement>('[data-more-soon]');
  const noMatch = grid.querySelector<HTMLElement>('[data-no-match]');
  const categories = new Set(buttons.map((button) => button.dataset.filter!));
  const styles = new Set([...(styleSelect?.options ?? [])].map((option) => option.value).filter(Boolean));
  const state = { cat: 'all', style: '' };

  const render = () => {
    buttons.forEach((button) => {
      const pressed = button.dataset.filter === state.cat;
      button.setAttribute('aria-pressed', String(pressed));
      // On narrow screens the pills scroll sideways; keep the chosen one in view.
      const track = button.closest<HTMLElement>('.work-filter-track');
      if (pressed && track && track.scrollWidth > track.clientWidth) {
        const offset = button.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
        track.scrollLeft = offset - (track.clientWidth - button.offsetWidth) / 2;
      }
    });
    if (styleSelect) {
      styleSelect.value = state.style;
      styleSelect.classList.toggle('is-set', state.style !== '');
    }

    let visible = 0;
    cases.forEach((item) => {
      const catOk = state.cat === 'all' || item.dataset.cat === state.cat;
      const styleOk = !state.style || (item.dataset.styles || '').split(' ').includes(state.style);
      item.hidden = !(catOk && styleOk);
      if (!item.hidden) visible++;
    });

    // Nothing to show: a category with no work yet gets its own "coming soon" card; any other empty
    // combination (usually because of the style) gets the "no match" card with a reset button.
    let categoryEmpty = false;
    emptyStates.forEach((panel) => {
      panel.hidden = !(visible === 0 && !state.style && panel.dataset.emptyFor === state.cat);
      categoryEmpty ||= !panel.hidden;
    });
    if (noMatch) noMatch.hidden = visible > 0 || categoryEmpty;
    if (moreSoon) moreSoon.hidden = visible === 0;
  };

  const writeHash = () => {
    const parts = [state.cat !== 'all' ? state.cat : '', state.style ? `style=${state.style}` : ''].filter(Boolean);
    history.replaceState(null, '', parts.length ? `#${parts.join('&')}` : location.pathname + location.search);
  };

  const keepGridInView = () => {
    // If the grid's first row has scrolled up out of view, bring it back: under the stuck pill on narrow screens,
    // under the nav when the filters sit in the sidebar beside the grid.
    const barRect = bar.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    const beside = barRect.right <= gridRect.left + 1;
    const limit = beside ? (document.querySelector('.nav')?.getBoundingClientRect().bottom ?? 0) : barRect.bottom;
    if (gridRect.top < limit) window.scrollBy({ top: gridRect.top - limit - 24, behavior: 'smooth' });
  };

  const update = (next: Partial<typeof state>) => {
    Object.assign(state, next);
    render();
    writeHash();
    keepGridInView();
  };

  buttons.forEach((button) => button.addEventListener('click', () => update({ cat: button.dataset.filter! })));
  styleSelect?.addEventListener('change', () => update({ style: styleSelect.value }));
  grid.querySelector('[data-reset-filters]')?.addEventListener('click', () => update({ cat: 'all', style: '' }));

  // Read #cat, #style=x or #cat&style=x — on load, and again when only the hash changes (links, back button).
  const readHash = () => {
    state.cat = 'all';
    state.style = '';
    decodeURIComponent(location.hash.slice(1))
      .split('&')
      .forEach((part) => {
        if (part.startsWith('style=')) {
          if (styles.has(part.slice(6))) state.style = part.slice(6);
        } else if (categories.has(part)) state.cat = part;
      });
    render();
  };
  addEventListener('hashchange', readHash);
  readHash();
}

// Keeps this file a module so its top-level names do not clash with other scripts.
export {};
