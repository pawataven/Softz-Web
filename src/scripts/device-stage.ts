import { addScrollEffect, viewportProgress } from './scroll-engine';

const MAX_TILT_DEG = 18;
const MIN_SCALE = 0.9;

document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((stage) => {
  const inner = stage.querySelector<HTMLElement>('.stage-inner');
  if (!inner) return;

  addScrollEffect(() => {
    const progress = viewportProgress(stage, 0.95, 0.25);
    inner.style.setProperty('--tilt', `${(MAX_TILT_DEG * (1 - progress)).toFixed(2)}deg`);
    inner.style.setProperty('--sc', (MIN_SCALE + (1 - MIN_SCALE) * progress).toFixed(4));
  });
});
