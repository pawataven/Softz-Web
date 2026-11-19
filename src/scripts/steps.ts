import { addScrollEffect, viewportProgress } from './scroll-engine';

document.querySelectorAll<HTMLElement>('[data-steps]').forEach((list) => {
  const steps = [...list.querySelectorAll('li')];

  addScrollEffect(() => {
    const progress = viewportProgress(list, 0.85, 0.45);
    list.style.setProperty('--p', progress.toFixed(3));
    steps.forEach((step, index) => {
      step.classList.toggle('on', progress >= index / steps.length + 0.01 || progress === 1);
    });
  });
});
