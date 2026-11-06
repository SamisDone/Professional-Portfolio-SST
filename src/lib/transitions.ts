import { routeIndex, sectionFor } from "./routes";
import { WORK_INDEX, findProject } from "./projects";

/**
 * Page changes, through the View Transitions API.
 *
 * Every history change goes through `transitionTo`, from links, the arrow
 * keys and the browser's back and forward alike, so all of them take the
 * same direction. There are three kinds, set as `data-vt` on <html> while the
 * transition runs; the rules live at the end of src/index.css.
 *
 *   forward / back  Both pages are in ROUTES. The new page slides over the
 *                   old one as a sheet, from the right when it is later in
 *                   the reading order and from the left when it is earlier.
 *   morph           /work to a case study or back, when the row's thumbnail
 *                   and the case study's exhibit are both on screen. The one
 *                   image grows or shrinks between them.
 *   instant         Everything else, and every navigation where the API is
 *                   missing or the visitor has asked for reduced motion.
 *
 * Input is never blocked and nothing queues: a new navigation skips the
 * running transition and starts its own.
 */
export type Kind = "forward" | "back" | "morph" | "instant";

const CASE = /^\/work\/([^/]+)$/;
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let running: ViewTransition | null = null;

/**
 * Resolves when no page transition is running: at once if none is, or when
 * the running one finishes or is skipped. The motion layer waits on this so
 * an entrance never plays under the sheet that is sliding in.
 */
export function whenSettled(): Promise<void> {
  if (!running) return Promise.resolve();
  const current = running;
  return current.finished.then(
    () => (running && running !== current ? whenSettled() : undefined),
    () => undefined,
  );
}

/** The slug a morph runs on, if this navigation can morph at all. Only
    projects in the /work index have a row, and only from `lg` up is the
    row's thumbnail drawn, so anywhere else there is nothing to grow from. */
function morphSlug(from: string, to: string) {
  const slug = (from === "/work" ? to : to === "/work" ? from : "").match(CASE)?.[1];
  const project = findProject(slug);
  if (!slug || !project?.shot || !WORK_INDEX.includes(project)) return undefined;
  if (!window.matchMedia("(min-width: 1024px)").matches) return undefined;
  return slug;
}

export function classify(from: string, to: string, replace: boolean): Kind {
  if (from === to || replace) return "instant";
  const a = routeIndex(from);
  const b = routeIndex(to);
  if (a !== -1 && b !== -1) return b > a ? "forward" : "back";
  return morphSlug(from, to) ? "morph" : "instant";
}

/** The morph's element on the current page: the row thumbnail on /work, the
    exhibit frame on a case study. Both carry `data-exhibit`. */
function exhibitEl(slug: string) {
  const el = document.querySelector<HTMLElement>(`[data-exhibit="${CSS.escape(slug)}"]`);
  return el && el.getClientRects().length > 0 ? el : null;
}

/**
 * Runs one navigation. `commit` renders the new location synchronously.
 *
 * Scroll is reset to the top before the new page is drawn, so the new
 * snapshot is of its top. Focus and the page announcement happen after the
 * swap, in RouteEffects.
 */
export function transitionTo(from: string, to: string, replace: boolean, commit: () => void) {
  const html = document.documentElement;
  const samePage = from === to;
  const apply = () => {
    if (!samePage) window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    html.dataset.section = sectionFor(to);
    commit();
  };

  // A navigation mid-transition ends the running one where it stands.
  running?.skipTransition();

  let kind = classify(from, to, replace);
  const slug = kind === "morph" ? morphSlug(from, to) : undefined;
  const source = slug ? exhibitEl(slug) : null;
  if (kind === "morph" && !source) kind = "instant";

  if (kind === "instant" || !document.startViewTransition || reduced()) {
    apply();
    return;
  }

  const name = slug ? `exhibit-${slug}` : "";
  if (source) source.style.viewTransitionName = name;
  html.dataset.vt = kind;

  const transition = document.startViewTransition(async () => {
    if (source) source.style.viewTransitionName = "";
    apply();
    if (!slug) return;
    const target = exhibitEl(slug);
    // Nothing to grow into: end now rather than leave the old image hanging.
    if (!target) return transition.skipTransition();
    target.style.viewTransitionName = name;
    // The new snapshot is taken when this resolves. Give the destination
    // image a moment to decode, usually from the copy the row preloaded, so
    // the morph grows a picture and not an empty frame. Capped, so a slow
    // network never holds the page.
    const img = target instanceof HTMLImageElement ? target : target.querySelector("img");
    if (img && !img.complete) {
      await Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 120))]);
    }
    // Shown at once: its own 150ms fade-in would still be near zero when the
    // snapshot is taken.
    if (img?.complete) {
      img.style.transition = "none";
      img.dataset.loading = "false";
    }
  });
  running = transition;
  // A transition skipped by the next navigation rejects `ready`. That is the
  // expected outcome of a fast run of presses, not an error.
  transition.ready.catch(() => {});

  transition.finished.finally(() => {
    if (slug) {
      const el = document.querySelector<HTMLElement>(`[data-exhibit="${CSS.escape(slug)}"]`);
      if (el) el.style.viewTransitionName = "";
    }
    // A newer transition may already own the attribute.
    if (running === transition) {
      running = null;
      delete html.dataset.vt;
    }
  });
}
