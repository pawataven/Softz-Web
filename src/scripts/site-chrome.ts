import { addScrollEffect } from './scroll-engine';

const NAV_HIDE_AFTER_PX = 480;
/** Minimum travel in one direction before the nav changes state; absorbs jitter from trackpad and wheel inertia. */
const NAV_DIRECTION_THRESHOLD_PX = 12;
const NAV_SCROLLED_AFTER_PX = 8;
const FAB_SHOW_AFTER_PX = 480;
const DROPDOWN_CLOSE_DELAY_MS = 150;

const nav = document.querySelector<HTMLElement>('.nav');
const dropdownToggles = [...document.querySelectorAll<HTMLButtonElement>('[data-dropdown]')];
const menuOverlay = document.querySelector<HTMLElement>('#menu');
const floatingLineButton = document.querySelector<HTMLElement>('.fab-line');

const dropdownFor = (toggle: HTMLButtonElement) => document.getElementById(toggle.getAttribute('aria-controls') ?? '');

function setDropdownOpen(toggle: HTMLButtonElement, isOpen: boolean) {
  toggle.setAttribute('aria-expanded', String(isOpen));
  dropdownFor(toggle)?.classList.toggle('open', isOpen);
}

function closeDropdowns(except?: HTMLButtonElement) {
  dropdownToggles.filter((toggle) => toggle !== except).forEach((toggle) => setDropdownOpen(toggle, false));
}

const canHover = window.matchMedia('(hover: hover)').matches;

dropdownToggles.forEach((toggle) => {
  const listItem = toggle.parentElement!;
  let closeTimer: number | undefined;

  const open = () => {
    window.clearTimeout(closeTimer);
    closeDropdowns(toggle);
    setDropdownOpen(toggle, true);
  };

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    if (toggle.getAttribute('aria-expanded') === 'true') setDropdownOpen(toggle, false);
    else open();
  });

  if (canHover) {
    listItem.addEventListener('mouseenter', open);
    listItem.addEventListener('mouseleave', () => {
      closeTimer = window.setTimeout(() => setDropdownOpen(toggle, false), DROPDOWN_CLOSE_DELAY_MS);
    });
  }
});

document.addEventListener('click', () => closeDropdowns());

let focusBeforeMenu: HTMLElement | null = null;

function openMenu() {
  if (!menuOverlay) return;
  focusBeforeMenu = document.activeElement as HTMLElement | null;
  menuOverlay.classList.add('open');
  menuOverlay.setAttribute('aria-hidden', 'false');
  menuOverlay.inert = false;
  document.body.classList.add('menu-open');
  document.body.style.overflow = 'hidden';
  menuOverlay.querySelector<HTMLElement>('[data-menu-close]')?.focus();
}

function closeMenu() {
  if (!menuOverlay?.classList.contains('open')) return;
  menuOverlay.classList.remove('open');
  menuOverlay.setAttribute('aria-hidden', 'true');
  menuOverlay.inert = true;
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
  focusBeforeMenu?.focus();
}

document.querySelectorAll('[data-menu-open]').forEach((button) => button.addEventListener('click', openMenu));
document.querySelectorAll('[data-menu-close]').forEach((button) => button.addEventListener('click', closeMenu));

function trapFocusInMenu(event: KeyboardEvent) {
  if (!menuOverlay) return;
  const focusable = [...menuOverlay.querySelectorAll<HTMLElement>('a, button')].filter((element) => element.offsetParent);
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    closeDropdowns();
  }
  if (event.key === 'Tab' && menuOverlay?.classList.contains('open')) trapFocusInMenu(event);
});

// Direction is measured from the last point where the nav could have changed state, not from the previous frame,
// so a slow scroll still accumulates and tiny back-and-forth deltas never toggle it.
let directionAnchorY = Math.max(0, window.scrollY);
let isNavHidden = false;

function setNavHidden(hidden: boolean) {
  if (!nav || hidden === isNavHidden) return;
  isNavHidden = hidden;
  nav.classList.toggle('hide', hidden);
}

function navMustStayVisible() {
  return document.querySelector('.dropdown.open') !== null || document.body.classList.contains('menu-open');
}

// Keyboard users tabbing into a hidden nav must be able to see what they focus.
nav?.addEventListener('focusin', () => {
  setNavHidden(false);
  directionAnchorY = Math.max(0, window.scrollY);
});

addScrollEffect(() => {
  // iOS rubber-band scrolling reports negative values at the top.
  const scrollY = Math.max(0, window.scrollY);

  nav?.classList.toggle('scrolled', scrollY > NAV_SCROLLED_AFTER_PX);
  floatingLineButton?.classList.toggle('show', scrollY > FAB_SHOW_AFTER_PX);

  if (scrollY <= NAV_HIDE_AFTER_PX || navMustStayVisible()) {
    setNavHidden(false);
    directionAnchorY = scrollY;
    return;
  }

  const travel = scrollY - directionAnchorY;
  if (Math.abs(travel) < NAV_DIRECTION_THRESHOLD_PX) return;

  setNavHidden(travel > 0);
  directionAnchorY = scrollY;
});
