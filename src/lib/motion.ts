/**
 * The motion layer's one script: it takes over from the switch in
 * index.html, and marks each animated element `data-in` the first time it
 * enters the viewport. Every movement itself is CSS, in src/motion.css.
 *
 * `data-in` has two values. Empty: the entrance is playing. "now": shown and
 * finished, with nothing on it able to play again. Every element moves to
 * "now" once its entrance is over, so a later style change (a hover that
 * swaps an animation, say) can never replay it.
 *
 * Nothing is hidden in the HTML. The starting states hang off `html.m-js`,
 * which the inline script in index.html adds before the first paint, unless
 * the visitor asked for reduced motion. It takes the class off again after
 * 1.5s if this file has not run by then, so a slow script never leaves the
 * page blank. When this file runs after that, or the inline script never ran,
 * whatever is already on screen is marked "now" before the layer comes back
 * on: no "complete, then redraws". Only what is still below the fold enters.
 */
import { whenSettled } from "./transitions";

declare global {
  interface Window {
    /** The inline script's 1.5s fallback timer. */
    __mOff?: number;
  }
}

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
/** Longer than any entrance: the chart's line, last point and label. */
const DONE_MS = 1200;
const TABS_KEY = "m-tabs";

let io: IntersectionObserver | undefined;
const timers = new WeakMap<Element, number>();

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Shown and finished: nothing on it plays again. */
const finish = (el: Element) => el.setAttribute("data-in", "now");

/** Plays the element's entrance, then marks it finished. */
function show(el: HTMLElement) {
  el.setAttribute("data-in", "");
  const delay = parseFloat(el.style.getPropertyValue("--m-d")) || 0;
  timers.set(el, window.setTimeout(() => finish(el), DONE_MS + delay));
}

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

/** The tabs play on the first page of a session only. */
function tabsSeen() {
  try {
    const seen = sessionStorage.getItem(TABS_KEY) === "1";
    sessionStorage.setItem(TABS_KEY, "1");
    return seen;
  } catch {
    return true;
  }
}

/** Observes everything not yet shown under `root`. */
export function scan(root: ParentNode = document) {
  if (!document.documentElement.classList.contains("m-js")) return;
  io ??= new IntersectionObserver(enter, { threshold: 0 });
  for (const el of root.querySelectorAll(TARGETS)) {
    if (el.hasAttribute("data-in")) continue;
    if (el.matches("[data-tabs]") && tabsSeen()) {
      finish(el);
      continue;
    }
    io.observe(el);
  }
}

/** Plays a group again from its start, for the motion lab's replay buttons. */
export function replay(root: Element) {
  for (const el of root.querySelectorAll(TARGETS)) {
    window.clearTimeout(timers.get(el));
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

/** Takes over from the inline switch, and scans the page. */
export function startMotion() {
  if (typeof window === "undefined") return;
  const html = document.documentElement;
  window.clearTimeout(window.__mOff);
  if (reduced() || !("IntersectionObserver" in window)) {
    html.classList.remove("m-js");
    return;
  }
  if (!html.classList.contains("m-js")) {
    // Late, or the inline switch never ran: the page is already showing in
    // full. Keep what is on screen exactly as it is.
    for (const el of document.querySelectorAll(TARGETS)) {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        if (el.matches("[data-tabs]")) tabsSeen();
        finish(el);
      }
    }
    html.classList.add("m-js");
  }
  scan();
}

/** After a page change: scan the new page once the transition has finished,
    so an entrance never plays under the sheet that is sliding in. */
export function afterNavigation() {
  whenSettled().then(() => scan());
}
