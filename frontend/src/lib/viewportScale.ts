/**
 * Whole-page proportional DOWN-scaling — the site is designed at 1440px
 * and shrinks to fit narrower desktop viewports so the layout keeps its
 * proportions instead of getting cramped.
 *
 * It deliberately never scales UP past 1.0 (MAX_ZOOM). An earlier version
 * scaled in both directions, which made a 1920px monitor render everything
 * 33% larger than authored (1920/1440) and a 2560px one 75% larger — the
 * headings and line lengths ended up uncomfortably inflated. Above 1440px
 * the site now renders at its natural size and `.container`'s
 * `max-width: 1200px` centers it with margin, which is the intended look.
 *
 * Uses CSS `zoom` rather than `transform: scale()`: this site relies on
 * `position: fixed` (the sticky header, the admin bg pattern, the nav
 * drawer, the modal overlay) and `backdrop-filter` (the modal), both of
 * which a `transform` on an ancestor breaks or visually corrupts.
 * `zoom` instead performs a real layout pass at the scaled size — every
 * px value (borders, border-radius, the retro box-shadows, `max-width`,
 * grid `minmax()` tracks) scales together with every rem value,
 * `position: fixed` keeps behaving like `position: fixed`, and text
 * stays crisp. Supported by Chrome/Edge, Safari, and Firefox 126+.
 *
 * Below MIN_WIDTH scaling is turned off entirely (zoom = 1) — that's
 * the site's existing mobile/tablet breakpoint territory
 * (@media (max-width: 1024px) in styles.css), and its layout already
 * reflows deliberately at that size; scaling it on top would fight the
 * responsive rules instead of complementing them.
 */

const DESIGN_WIDTH = 1440;
const MIN_WIDTH = 1024;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 1;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function applyViewportScale(): void {
  const root = document.documentElement;
  const width = window.innerWidth;

  const zoom = width < MIN_WIDTH ? 1 : clamp(width / DESIGN_WIDTH, MIN_ZOOM, MAX_ZOOM);
  root.style.zoom = String(zoom);

  // `vw`/`vh` units measure the real, unscaled viewport — CSS `zoom`
  // does not shrink them the way it shrinks px/rem, so `100vh` on a
  // zoomed page overflows past what's actually visible. These two
  // custom properties give layout code a zoom-aware substitute: divide
  // the true viewport size by the zoom factor to get the size as it
  // appears in the zoomed coordinate space (see styles.css/admin.css's
  // `var(--app-vh, 100vh)` usages).
  root.style.setProperty("--app-vw", `${width / zoom}px`);
  root.style.setProperty("--app-vh", `${window.innerHeight / zoom}px`);
}

let scheduled = false;

function scheduleApply(): void {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    applyViewportScale();
  });
}

/** Call once before the app renders. Applies immediately, then keeps re-applying on resize. */
export function initViewportScale(): void {
  if (typeof window === "undefined") return;
  applyViewportScale();
  window.addEventListener("resize", scheduleApply);
}
