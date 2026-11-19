const CARD_GAP_PX = 20;
const EDGE_TOLERANCE_PX = 8;

document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector<HTMLElement>('.car-track');
  const previousButton = carousel.querySelector<HTMLButtonElement>('[data-car="-1"]');
  const nextButton = carousel.querySelector<HTMLButtonElement>('[data-car="1"]');
  if (!track || !previousButton || !nextButton) return;

  const stepWidth = () => (track.querySelector<HTMLElement>('.car-card')?.offsetWidth ?? 280) + CARD_GAP_PX;

  const updateButtons = () => {
    previousButton.disabled = track.scrollLeft < EDGE_TOLERANCE_PX;
    nextButton.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - EDGE_TOLERANCE_PX;
  };

  previousButton.addEventListener('click', () => track.scrollBy({ left: -stepWidth(), behavior: 'smooth' }));
  nextButton.addEventListener('click', () => track.scrollBy({ left: stepWidth(), behavior: 'smooth' }));
  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();

  // Mouse wheel over the cards scrolls them sideways. At either end the wheel goes back to the page, so the
  // visitor is never stuck. Runs before the window-level smooth-scroll handler.
  track.addEventListener(
    'wheel',
    (event) => {
      if (event.ctrlKey) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const max = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= EDGE_TOLERANCE_PX;
      const atEnd = track.scrollLeft >= max - EDGE_TOLERANCE_PX;
      if ((delta < 0 && atStart) || (delta > 0 && atEnd) || max <= 0) return;
      event.preventDefault();
      event.stopPropagation();
      track.style.scrollSnapType = 'none';
      track.style.scrollBehavior = 'auto';
      track.scrollLeft += delta * (event.deltaMode === 1 ? 40 : 1);
      lastDirection = Math.sign(delta);
      clearTimeout(wheelEnd);
      wheelEnd = window.setTimeout(snapBack, 160);
    },
    { passive: false },
  );
  let wheelEnd = 0;
  let lastDirection = 0;
  // When the wheel or a drag stops, settle on the next card in the direction of travel (mandatory snapping
  // alone would pull a small move back to the card it started from), then switch snapping back on.
  const snapBack = () => {
    const step = stepWidth();
    const position = track.scrollLeft / step;
    const index = lastDirection > 0 ? Math.ceil(position - 0.02) : lastDirection < 0 ? Math.floor(position + 0.02) : Math.round(position);
    const target = Math.max(0, Math.min(index * step, track.scrollWidth - track.clientWidth));
    track.style.scrollBehavior = 'smooth';
    track.scrollTo({ left: target, behavior: 'smooth' });
    window.setTimeout(() => {
      track.style.scrollSnapType = '';
      track.style.scrollBehavior = '';
    }, 450);
  };

  // Mouse drag.
  let down = false;
  let moved = false;
  let startX = 0;
  let startLeft = 0;
  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    down = true;
    moved = false;
    startX = event.clientX;
    startLeft = track.scrollLeft;
  });
  window.addEventListener('pointermove', (event) => {
    if (!down) return;
    const dx = event.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      track.classList.add('is-dragging');
      track.style.scrollSnapType = 'none';
      track.style.scrollBehavior = 'auto';
    }
    if (moved) {
      lastDirection = Math.sign(-dx);
      track.scrollLeft = startLeft - dx;
    }
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    if (!moved) return;
    track.classList.remove('is-dragging');
    snapBack();
  });
  // A drag must not also open the card it started on.
  track.addEventListener('click', (event) => {
    if (moved) {
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    }
  }, true);
  track.addEventListener('dragstart', (event) => event.preventDefault());
});
