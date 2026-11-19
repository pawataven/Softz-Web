import { addScrollEffect, clamp01, getViewportHeight } from './scroll-engine';

/*
  Scroll effects for the case study page.

  A mouse wheel moves the page in ~100px jumps, so effects tied straight to scrollY move in steps. Each effect here is
  a "tween": the scroll handler only sets its target, and one shared rAF loop eases the current value toward it and
  writes transforms/opacity directly (no CSS variables, so no style recalculation of whole subtrees). All layout reads
  happen in the scroll handler before any write, so reads and writes never interleave.
*/

const split = document.querySelector<HTMLElement>('[data-cs-split]');

interface Tween {
  target: number;
  current: number;
  /** Below this distance the tween snaps to its target and stops. */
  epsilon: number;
  ready: boolean;
  apply: (value: number) => void;
}

const tweens: Tween[] = [];
let running = false;
let lastFrame = 0;

/** Share of the remaining distance covered per 60 fps frame; frame-rate independent below. */
const EASE_PER_FRAME = 0.14;

function tick(now: number) {
  const elapsed = lastFrame ? Math.min(64, now - lastFrame) : 16.7;
  lastFrame = now;
  const ease = 1 - Math.pow(1 - EASE_PER_FRAME, elapsed / 16.7);
  let moving = false;
  for (const tween of tweens) {
    const distance = tween.target - tween.current;
    if (distance === 0) continue;
    if (Math.abs(distance) <= tween.epsilon) tween.current = tween.target;
    else {
      tween.current += distance * ease;
      moving = true;
    }
    tween.apply(tween.current);
  }
  if (moving) requestAnimationFrame(tick);
  else {
    running = false;
    lastFrame = 0;
  }
}

function setTarget(tween: Tween, target: number) {
  tween.target = target;
  if (!tween.ready) {
    // First measurement: start in place instead of easing in from zero on page load.
    tween.ready = true;
    tween.current = target;
    tween.apply(target);
    return;
  }
  if (!running && tween.current !== target) {
    running = true;
    requestAnimationFrame(tick);
  }
}

function createTween(apply: (value: number) => void, epsilon = 0.0005): Tween {
  const tween: Tween = { target: 0, current: 0, epsilon, ready: false, apply };
  tweens.push(tween);
  return tween;
}

const wide = window.matchMedia('(min-width: 1024px)');
const splitActive = window.matchMedia('(min-width: 768px)');

// Split gallery: progress runs 0→1 while the stage is stuck. The photos after the first two play in order, each in
// its own slice: half-screen photos fade in over their half while settling out of a slight zoom, and the closing
// framed photo fades and grows in. A short hold at the start, and a longer one on the closing frame, before the
// page scrolls on.
if (split) {
  const steps = [...split.querySelectorAll<HTMLElement>('.cs-photo:is([data-slot="left"], [data-slot="right"], [data-slot="final"])')].map(
    (figure) => ({ figure, image: figure.querySelector<HTMLElement>('img'), isFinal: figure.dataset.slot === 'final' }),
  );
  const baseImages = [...split.querySelectorAll<HTMLElement>('.cs-photo[data-slot$="base"] img')];
  let applied = -1;
  const tween = createTween((progress) => {
    const rounded = Math.round(progress * 2000) / 2000;
    if (rounded === applied) return;
    applied = rounded;
    const baseScale = 1.08 - 0.08 * clamp01(progress / 0.25);
    baseImages.forEach((image) => (image.style.transform = `scale(${baseScale.toFixed(4)})`));
    const played = clamp01((progress - 0.06) / 0.76) * steps.length;
    steps.forEach(({ figure, image, isFinal }, index) => {
      // Cubic ease-out so each photo settles softly instead of stopping dead.
      const linear = clamp01(played - index);
      const t = 1 - Math.pow(1 - linear, 3);
      figure.style.opacity = t.toFixed(3);
      if (isFinal) figure.style.transform = `scale(${(0.84 + 0.16 * t).toFixed(4)})`;
      else if (image) image.style.transform = `scale(${(1.08 - 0.08 * t).toFixed(4)})`;
    });
  });
  addScrollEffect(() => {
    if (!splitActive.matches) return;
    const bounds = split.getBoundingClientRect();
    const travel = bounds.height - getViewportHeight();
    if (travel <= 0) return;
    setTarget(tween, clamp01(-bounds.top / travel));
  });
}

// Cover photo eases out of a slight zoom as the page leaves it.
const cover = document.querySelector<HTMLElement>('[data-cs-cover]');
const coverImage = cover?.querySelector<HTMLElement>('.cs-cover-img');
if (cover && coverImage) {
  const tween = createTween((progress) => {
    coverImage.style.transform = `translateY(${(progress * 6).toFixed(3)}%) scale(${(1.08 - 0.08 * progress).toFixed(4)})`;
  });
  addScrollEffect(() => {
    const height = cover.offsetHeight;
    if (window.scrollY > height * 1.5 && tween.ready && tween.current === 1) return;
    setTarget(tween, clamp01(window.scrollY / height));
  });
}

// The site starts smaller than its column and grows to full width while it travels up the screen. It scales from
// its top edge (transform-origin 50% 0), so its measured top is the same at every scale.
const grow = document.querySelector<HTMLElement>('[data-cs-grow]');
if (grow) {
  const tween = createTween((progress) => {
    grow.style.transform = `scale(${(0.7 + 0.3 * progress).toFixed(4)})`;
  });
  addScrollEffect(() => {
    const top = grow.getBoundingClientRect().top;
    const viewport = getViewportHeight();
    setTarget(tween, clamp01((viewport - top) / (viewport * 0.65)));
  });
}

// Parallax: phones drift slightly faster than the page (desktop only). Positions come from the untransformed parent
// so the element's own translate never feeds back into the next reading.
const floating = [...document.querySelectorAll<HTMLElement>('[data-cs-speed]')].map((element) => ({
  element,
  speed: Number(element.dataset.csSpeed),
  tween: createTween((offset) => (element.style.translate = `0 ${offset.toFixed(1)}px`), 0.1),
}));
if (floating.length) {
  addScrollEffect(() => {
    const viewport = getViewportHeight();
    // Read every position first, then set targets, so layout is never forced between writes.
    const readings = floating.map(({ element }) => {
      const parent = element.offsetParent as HTMLElement | null;
      const parentTop = parent ? parent.getBoundingClientRect().top : 0;
      return parentTop + element.offsetTop + element.offsetHeight / 2;
    });
    floating.forEach(({ speed, tween }, index) => {
      if (!wide.matches) return setTarget(tween, 0);
      const center = readings[index];
      if (center < -viewport || center > viewport * 2) return;
      setTarget(tween, (center - viewport / 2) * speed);
    });
  });
}

// Showcase walkthrough video: plays on its own (muted, looped); paused while off screen to save battery.
const showcaseVideo = document.querySelector<HTMLVideoElement>('[data-cs-video]');
if (showcaseVideo) {
  showcaseVideo.muted = true;
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) showcaseVideo.play().catch(() => {});
    else showcaseVideo.pause();
  }).observe(showcaseVideo);
}
