/*
  Desktop only (mouse/trackpad): a mouse wheel moves the page in ~100px jumps, which reads as stiff.
  Wheel input here only moves a target, and one rAF loop eases the page toward it, so the page glides and coasts to a
  stop. Touch screens and small windows keep native scrolling; so do the scrollbar, keyboard,
  links and anything else that scrolls the page — the loop notices and lets go.

  Sections are still fitted to one screen each on desktop (html.snap-on, see base.css).
*/

/** Share of the remaining distance covered per 60 fps frame; frame-rate independent in tick(). */
const EASE_PER_FRAME = 0.075;
const SETTLE_PX = 0.5;
/** Movement beyond this between frames was not ours (scrollbar drag, anchor jump, find-in-page). */
const FOREIGN_SCROLL_PX = 2;
const LINE_HEIGHT_PX = 40;

const desktop = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');

const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

let target = window.scrollY;
let current = window.scrollY;
let lastWritten = window.scrollY;
let running = false;
let lastFrame = 0;

function release() {
  running = false;
  current = target = window.scrollY;
}

function tick(now: number) {
  if (!running) return;
  if (Math.abs(window.scrollY - lastWritten) > FOREIGN_SCROLL_PX) {
    release();
    return;
  }
  const elapsed = lastFrame ? Math.min(64, now - lastFrame) : 16.7;
  lastFrame = now;
  const ease = 1 - Math.pow(1 - EASE_PER_FRAME, elapsed / 16.7);
  current += (target - current) * ease;
  if (Math.abs(target - current) < SETTLE_PX) current = target;
  window.scrollTo({ top: current, behavior: 'instant' });
  lastWritten = window.scrollY;
  if (current === target) running = false;
  else requestAnimationFrame(tick);
}

function glideBy(distance: number) {
  if (!running) current = target = window.scrollY;
  target = Math.min(Math.max(0, target + distance), maxScroll());
  if (running) return;
  running = true;
  lastFrame = 0;
  lastWritten = window.scrollY;
  requestAnimationFrame(tick);
}

function wheelDistance(event: WheelEvent) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * LINE_HEIGHT_PX;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * window.innerHeight;
  return event.deltaY;
}

function insideScrollableBox(start: EventTarget | null, direction: number) {
  for (let element = start instanceof Element ? start : null; element && element !== document.body; element = element.parentElement) {
    if (element.matches('[data-native-scroll], .menu-overlay')) return true;
    const overflowY = getComputedStyle(element).overflowY;
    if (overflowY !== 'auto' && overflowY !== 'scroll') continue;
    const canScrollDown = element.scrollTop < element.scrollHeight - element.clientHeight - 1;
    const canScrollUp = element.scrollTop > 0;
    if ((direction > 0 && canScrollDown) || (direction < 0 && canScrollUp)) return true;
  }
  return false;
}

function smoothingAllowed() {
  return desktop.matches && !document.body.classList.contains('menu-open');
}

/*
  Fit every section to one screen on desktop (html.snap-on). base.css then gives each section top padding that clears
  the nav bar; a section whose content is still taller than the screen (short laptop screens) is fitted in two passes:
  1. scale everything down with CSS zoom, never below MIN_FIT_ZOOM (keeps text readable);
  2. if still too tall, narrow the content column (never below MIN_FIT_WIDTH of it). Laptops, phones and cards are
     sized by width, so zoom alone cannot shorten them; a narrower column does. A step that makes the section taller
     (text wrapping onto more lines) is undone and narrowing stops there.
  Skipped: the cover photo, the sticky "Explore" story and the split gallery, which size themselves to the screen.
*/
const MIN_FIT_ZOOM = 0.8;
const MIN_FIT_WIDTH = 0.45;
// .work-page: a growing card grid beside a sticky sidebar; it scrolls instead of being shrunk.
const FIT_SKIP = '.cs-cover, .explore-section, .work-page, :has([data-cs-split])';

function fitSections() {
  const on = desktop.matches;
  document.documentElement.classList.toggle('snap-on', on);
  const viewport = window.innerHeight;

  document.querySelectorAll<HTMLElement>('main > section').forEach((section) => {
    if (section.matches(FIT_SKIP)) return;
    const parts = [...section.children].filter((child): child is HTMLElement => child instanceof HTMLElement);
    parts.forEach((part) => {
      part.style.zoom = '';
      part.style.maxWidth = '';
    });
    if (!on) return;

    // The first section sits under the nav bar in the page flow, so it has the screen minus the bar.
    const isFirst = section === section.parentElement?.firstElementChild;
    const available = isFirst ? viewport - Math.max(0, section.getBoundingClientRect().top + window.scrollY) : viewport;
    const fits = () => section.offsetHeight <= available + 1;

    let zoom = 1;
    for (let attempt = 0; attempt < 4 && !fits() && zoom > MIN_FIT_ZOOM; attempt++) {
      zoom = Math.max(MIN_FIT_ZOOM, zoom * (available / section.offsetHeight) - 0.005);
      parts.forEach((part) => (part.style.zoom = zoom.toFixed(3)));
    }

    const fullWidths = parts.map((part) => part.offsetWidth);
    const heightBeforeNarrowing = section.offsetHeight;
    let widthScale = 1;
    for (let attempt = 0; attempt < 8 && !fits() && widthScale > MIN_FIT_WIDTH; attempt++) {
      const before = section.offsetHeight;
      const next = Math.max(MIN_FIT_WIDTH, widthScale * Math.sqrt(available / before) - 0.01);
      parts.forEach((part, index) => (part.style.maxWidth = `${Math.round(fullWidths[index] * next)}px`));
      if (section.offsetHeight > before) {
        // Text-heavy content only grows taller when narrowed: undo this step and let the section scroll.
        parts.forEach((part, index) => (part.style.maxWidth = widthScale === 1 ? '' : `${Math.round(fullWidths[index] * widthScale)}px`));
        break;
      }
      widthScale = next;
    }
    // Narrowing that did not make the section shorter (e.g. a horizontal carousel) only squeezes it: undo it all.
    if (widthScale < 1 && !fits() && section.offsetHeight >= heightBeforeNarrowing) {
      parts.forEach((part) => (part.style.maxWidth = ''));
    }
  });
}

fitSections();
let resizeTimer = 0;
const refit = () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(fitSections, 120);
};
window.addEventListener('resize', refit);
window.addEventListener('load', fitSections);
desktop.addEventListener('change', fitSections);
document.fonts?.ready.then(fitSections);

window.addEventListener(
  'wheel',
  (event) => {
    if (!smoothingAllowed() || event.ctrlKey || event.defaultPrevented) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.deltaY === 0) return;
    if (insideScrollableBox(event.target, Math.sign(event.deltaY))) return;
    event.preventDefault();
    glideBy(wheelDistance(event));
  },
  { passive: false },
);

// Keeps this file a module so its top-level names do not clash with other scripts.
export {};
