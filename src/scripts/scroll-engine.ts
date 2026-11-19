type ScrollEffect = () => void;

const effects: ScrollEffect[] = [];
let viewportHeight = window.innerHeight;
let frameRequested = false;

export const getViewportHeight = () => viewportHeight;

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** 0 when the element's top reaches `start` × viewport height, 1 when it reaches `end` × viewport height. */
export function viewportProgress(element: Element, start: number, end: number) {
  const { top } = element.getBoundingClientRect();
  return clamp01((start * viewportHeight - top) / ((start - end) * viewportHeight));
}

function runEffects() {
  frameRequested = false;
  effects.forEach((effect) => effect());
}

function requestEffects() {
  if (frameRequested) return;
  frameRequested = true;
  requestAnimationFrame(runEffects);
}

window.addEventListener('scroll', requestEffects, { passive: true });
window.addEventListener('resize', () => {
  viewportHeight = window.innerHeight;
  requestEffects();
});

/** All scroll-driven effects share one rAF loop so scrolling stays cheap. */
export function addScrollEffect(effect: ScrollEffect) {
  effects.push(effect);
  effect();
}
