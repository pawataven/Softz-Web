// Work cards: hands the cursor position to CSS as --px / --py (-0.5…0.5) so the device mockups drift toward it.
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll<HTMLElement>('.case').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--px', ((event.clientX - bounds.left) / bounds.width - 0.5).toFixed(3));
      card.style.setProperty('--py', ((event.clientY - bounds.top) / bounds.height - 0.5).toFixed(3));
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--px');
      card.style.removeProperty('--py');
    });
  });
}

// Keeps this file a module so its top-level names do not clash with other scripts.
export {};
