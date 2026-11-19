/** Keep in sync with the selector list in styles/components/edge-glow.css. */
const EDGE_GLOW_SELECTOR = '.panel, .dropdown, .nav-menu, .case, .work-filter-track';

if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener(
    'pointermove',
    (event) => {
      // Update every glowing ancestor (e.g. the nav pill around an open dropdown) so none is left with a stale position.
      let host = (event.target as Element | null)?.closest?.<HTMLElement>(EDGE_GLOW_SELECTOR) ?? null;
      while (host) {
        const bounds = host.getBoundingClientRect();
        // Inside a section scaled to fit the screen (CSS zoom, see smooth-scroll.ts) the glow's px are zoomed too.
        const zoom = (host as HTMLElement & { currentCSSZoom?: number }).currentCSSZoom ?? 1;
        host.style.setProperty('--mx', `${(event.clientX - bounds.left) / zoom}px`);
        host.style.setProperty('--my', `${(event.clientY - bounds.top) / zoom}px`);
        host = host.parentElement?.closest<HTMLElement>(EDGE_GLOW_SELECTOR) ?? null;
      }
    },
    { passive: true },
  );
}
