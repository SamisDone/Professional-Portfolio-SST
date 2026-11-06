/**
 * The motion layer's one script: it switches the layer on, and marks each
 * animated element `data-in` the first time it enters the viewport. Every
 * movement itself is CSS, in src/motion.css.
 *
 * Nothing here runs on the server, and nothing starts hidden unless this has
 * run: the starting states hang off `html.m-js`, added below only when the
 * visitor has not asked for reduced motion.
 */
import { whenSettled } from "./transitions";

/** What animates on entry, by selector. Each is gated in CSS by its scope. */
const TARGETS = [
  ".border-t-4", // A1 section rules
  ".band", // A2 header bands
  ".proof-mark", // A3 proof marks
  "[data-tabs]", // A4 nav tabs, first page of a session only
  "div[data-exhibit]", // A5 exhibits, once decoded
  "[data-stamp]", // A6 labels and index numbers
  "[data-chart]", // C1 the trajectory
  ".m-step", // C2 how it works
].join(",");

const STAGGER_MAX = 5;
const STEP_MS = 120 + 320; // a stamp, then the connector below it
const TABS_KEY = "m-tabs";

let io: IntersectionObserver | undefined;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Shows an element in its end state, now. */
const show = (el: Element) => el.setAttribute("data-in", "");

function enter(entries: IntersectionObserverEntry[]) {
  const arriving = entries
    .filter((e) => e.isIntersecting)
    .map((e) => e.target as HTMLElement)
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

  // Stagger places are counted per kind, in reading order.
  const place = new Map<string, number>();
  let step = 0;
  for (const el of arriving) {
    io!.unobserve(el);
    const kind = el.matches(".proof-mark") ? "mark" : el.matches("[data-stamp]") ? "stamp" : el.className;
    const i = place.get(kind) ?? 0;
    place.set(kind, i + 1);
    el.style.setProperty("--m-i", String(Math.min(i, STAGGER_MAX)));

    if (el.matches(".m-step")) {
      // Steps arriving together play one after another, each number landing
      // as the connector above it reaches it.
      el.style.setProperty("--m-d", `${step++ * STEP_MS}ms`);
    }
    if (el.matches("div[data-exhibit]")) {
      const img = el.querySelector("img");
      if (img && !img.complete) {
        img.addEventListener("load", () => show(el), { once: true });
        img.addEventListener("error", () => show(el), { once: true });
        continue;
      }
    }
    show(el);
  }
}

/** Observes everything not yet shown under `root`. */
export function scan(root: ParentNode = document) {
  if (!document.documentElement.classList.contains("m-js")) return;
  io ??= new IntersectionObserver(enter, { threshold: 0 });
  for (const el of root.querySelectorAll(TARGETS)) {
    if (el.hasAttribute("data-in")) continue;
    if (el.matches("[data-tabs]")) {
      // Once a session: on every later page the tabs are simply there.
      let seen = false;
      try {
        seen = sessionStorage.getItem(TABS_KEY) === "1";
        sessionStorage.setItem(TABS_KEY, "1");
      } catch {
        seen = true;
      }
      if (seen) {
        show(el);
        continue;
      }
    }
    io.observe(el);
  }
}

/** Plays a group again from its start, for the motion lab's replay buttons. */
export function replay(root: Element) {
  for (const el of root.querySelectorAll(TARGETS)) {
    el.removeAttribute("data-in");
    io?.unobserve(el);
  }
  void (root as HTMLElement).offsetWidth;
  if (root.matches("[data-tabs-replay]")) {
    try {
      sessionStorage.removeItem(TABS_KEY);
    } catch {
      /* the tabs play anyway */
    }
  }
  scan(root);
}

/** Switches the layer on, unless motion is reduced, and scans the page. */
export function startMotion() {
  if (typeof window === "undefined" || reduced() || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("m-js");
  scan();
}

/** After a page change: scan the new page once the transition has finished,
    so an entrance never plays under the sheet that is sliding in. */
export function afterNavigation() {
  whenSettled().then(() => scan());
}
