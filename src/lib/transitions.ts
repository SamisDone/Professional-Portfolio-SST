import { applyDocumentMeta } from "./documentMeta";
import { ALL_PROJECTS, findProject } from "./projects";
import { ROUTES, routeIndex, sectionFor } from "./routes";

/**
 * Page changes, through the View Transitions API.
 *
 * Every history change goes through `transitionTo`, from links, the arrow
 * keys and the browser's back and forward alike, so all of them take the
 * same direction. There are four animated kinds, set as `data-vt` on <html>
 * while the transition runs; the rules live in src/motion.css.
 *
 *   forward / back  The new content slides in from the right when its number
 *                   is higher and from the left when it is lower. Header and
 *                   footer stay still.
 *   morph           Home or /work to a case study and back. The clicked
 *                   project's picture and title grow into the case study's.
 *   filter          A /work filter: rows that stay move, rows that go collapse.
 *   instant         Everything else, and every navigation where the API is
 *                   missing or the visitor has asked for reduced motion.
 *
 * Input is never blocked and nothing queues: a new navigation skips the
 * running transition and starts its own.
 */
export type Kind = "forward" | "back" | "morph" | "filter" | "instant";

const CASE = /^\/work\/([^/]+)$/;
const LISTS = new Set(["/", "/work"]);
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pathOf = (url: string) => url.split("?")[0];

let running: ViewTransition | null = null;
/** The case study just left, so a list can show its row again. */
let leaving: string | undefined;

/** Where each page was scrolled to, for the browser's back and forward. */
const positions = new Map<string, number>();

/** The case study this navigation is coming back from, if any. */
export const returningFrom = () => leaving;

/**
 * Resolves when no page transition is running: at once if none is, or when
 * the running one finishes or is skipped. The motion layer waits on this so
 * an entrance never plays under content that is sliding in.
 */
export function whenSettled(): Promise<void> {
  if (!running) return Promise.resolve();
  const current = running;
  return current.finished.then(
    () => (running && running !== current ? whenSettled() : undefined),
    () => undefined,
  );
}

/** Ends the running page transition where it stands. */
export const skipTransition = () => running?.skipTransition();

/** The slug a morph could run on: a list on one side, a case study on the other. */
function morphSlug(from: string, to: string) {
  const slug = (LISTS.has(from) ? to : LISTS.has(to) ? from : "").match(CASE)?.[1];
  return findProject(slug) ? slug : undefined;
}

/**
 * A position in the numbered reading order for any page. Tabs are their own
 * number; a case study sits inside Work, ordered as Previous and Next step
 * through them, and the other unnumbered pages sit beside the tab they belong
 * to, so every navigation has a direction.
 */
function rank(pathname: string) {
  const tab = routeIndex(pathname);
  if (tab !== -1) return tab;
  const work = routeIndex("/work");
  const slug = pathname.match(CASE)?.[1];
  if (slug) return work + (ALL_PROJECTS.findIndex((p) => p.slug === slug) + 1) / (ALL_PROJECTS.length + 2);
  if (pathname === "/repositories") return work + (ALL_PROJECTS.length + 1) / (ALL_PROJECTS.length + 2);
  if (pathname === "/certificates") return routeIndex("/activities") + 0.5;
  return ROUTES.length;
}

const direction = (from: string, to: string): Kind => {
  const a = rank(from);
  const b = rank(to);
  return a === b ? "instant" : b > a ? "forward" : "back";
};

function classify(from: string, to: string, replace: boolean): Kind {
  const a = pathOf(from);
  const b = pathOf(to);
  if (replace) return "instant";
  if (a === b) return from !== to && a === "/work" ? "filter" : "instant";
  return morphSlug(a, b) ? "morph" : direction(a, b);
}

/** The element on screen marked with this attribute and slug, if any. An
    element in an inactive frame or behind a breakpoint does not count. */
function visible(attribute: string, slug: string) {
  for (const el of document.querySelectorAll<HTMLElement>(`[${attribute}="${CSS.escape(slug)}"]`)) {
    if (el.getClientRects().length > 0 && !el.closest("[inert]")) return el;
  }
  return null;
}

/**
 * Runs one navigation. `commit` renders the new location synchronously.
 *
 * Scroll is set after the new page renders and before it is captured: to the
 * top, or back where it was on the browser's back and forward. Focus and the
 * page announcement happen after the swap, in RouteEffects.
 */
export function transitionTo(from: string, to: string, replace: boolean, pop: boolean, commit: () => void) {
  const html = document.documentElement;
  const fromPath = pathOf(from);
  const toPath = pathOf(to);
  const newPage = fromPath !== toPath;
  if (newPage) {
    positions.set(fromPath, window.scrollY);
    leaving = fromPath.match(CASE)?.[1];
  }

  const apply = () => {
    html.dataset.section = sectionFor(toPath);
    if (newPage) applyDocumentMeta(toPath);
    commit();
    if (newPage) window.scrollTo({ top: pop ? (positions.get(toPath) ?? 0) : 0, left: 0, behavior: "instant" as ScrollBehavior });
  };

  // A navigation mid-transition ends the running one where it stands.
  running?.skipTransition();

  let kind = classify(from, to, replace);
  const slug = kind === "morph" ? morphSlug(fromPath, toPath) : undefined;
  const image = slug ? visible("data-exhibit", slug) : null;
  const title = slug ? visible("data-morph-title", slug) : null;
  // Nothing to grow from, on a phone's /work for one: an ordinary page change.
  if (kind === "morph" && !image && !title) kind = direction(fromPath, toPath);

  if (kind === "instant" || !document.startViewTransition || reduced()) {
    apply();
    return;
  }

  const rows = kind === "filter" ? [...document.querySelectorAll<HTMLElement>("[data-slug]")] : [];
  for (const row of rows) row.style.viewTransitionName = `row-${row.dataset.slug}`;
  if (image) image.style.viewTransitionName = "morph-image";
  if (title) title.style.viewTransitionName = "morph-title";
  const oldY = window.scrollY;
  html.dataset.vt = kind;

  const transition = document.startViewTransition(async () => {
    if (image) image.style.viewTransitionName = "";
    if (title) title.style.viewTransitionName = "";
    apply();
    // The old content stays where it was on screen while the new slides in.
    html.style.setProperty("--vt-old-y", `${window.scrollY - oldY}px`);
    if (!slug) return;
    const newImage = visible("data-exhibit", slug);
    const newTitle = visible("data-morph-title", slug);
    if (newImage) newImage.style.viewTransitionName = "morph-image";
    if (newTitle) newTitle.style.viewTransitionName = "morph-title";
    // The new snapshot is taken when this resolves. Give the destination
    // image a moment to decode, usually from the copy the row preloaded, so
    // the morph grows a picture and not an empty frame. Capped, so a slow
    // network never holds the page.
    const img = newImage instanceof HTMLImageElement ? newImage : newImage?.querySelector("img");
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
    for (const row of rows) row.style.viewTransitionName = "";
    if (slug) {
      const names = document.querySelectorAll<HTMLElement>("[data-exhibit], [data-morph-title]");
      for (const el of names) el.style.viewTransitionName = "";
    }
    // A newer transition may already own the attribute.
    if (running === transition) {
      running = null;
      delete html.dataset.vt;
    }
  });
}
