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
import { skipTransition, whenSettled } from "./transitions";

declare global {
  interface Window {
    /** The inline script's 1.5s fallback timer. */
    __mOff?: number;
  }
}

/** What animates on entry, by selector. Each is gated in CSS by its scope. */
const TARGETS = [
  ".border-t-4", // A1 section rules
  ".proof-mark", // A3 proof marks
  "[data-tabs]", // A4 nav tabs, first page of a session only
  "div[data-exhibit]", // F3 captions, once the exhibit has decoded
  "[data-stamp]", // A6 labels and index numbers
  "[data-chart]", // C1 and E4, the trajectory
  "[data-flow]", // E2 and E3, how it works
  "[data-print]", // F1, the proof row printing
  "[data-ledger]", // F2, ledgers and tables ruling
  ".glitch", // G, the 404
].join(",");

const STAGGER_MAX = 5;
/** Longer than any entrance, stagger included. */
const DONE_MS = 700;
/** The terminal breadcrumb's typing, which the heading waits for. */
export const CRUMB_TYPE_MS = 250;
const BAND_MS = 400;
const TABS_KEY = "m-tabs";

let io: IntersectionObserver | undefined;
/** When the last page change committed, for the heading to wait on. */
let navigatedAt = -Infinity;
/** Whatever is animating from script now, for a click or a key to end. */
const skippers = new Set<() => void>();
/** When the CSS entrances started so far are all over. */
let entrancesUntil = 0;
const timers = new WeakMap<Element, number>();

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const reducedMotion = reduced;

/** Registers an effect that a click or a key press should end. */
export function onSkip(fn: () => void) {
  skippers.add(fn);
  return () => void skippers.delete(fn);
}

/** Any press ends whatever is playing: every motion is skippable. */
function skipAll() {
  const html = document.documentElement;
  skipTransition();
  const active = performance.now() < entrancesUntil;
  if (!active && skippers.size === 0) return;
  for (const fn of [...skippers]) fn();
  // Zero duration for a frame ends every CSS entrance at its final state.
  html.dataset.mSkip = "";
  requestAnimationFrame(() => requestAnimationFrame(() => delete html.dataset.mSkip));
  entrancesUntil = 0;
}

/**
 * When the heading may start: the page has stopped sliding and the terminal
 * breadcrumb has finished typing, so the text effects never overlap.
 */
export function headingGate(): Promise<void> {
  const left = navigatedAt + CRUMB_TYPE_MS - performance.now();
  return Promise.all([whenSettled(), left > 0 ? new Promise((r) => setTimeout(r, left)) : undefined]).then(() => undefined);
}

/** D: each H1's highlight grows in, the first thing to move on a page. */
function revealBands(root: ParentNode = document) {
  entrancesUntil = Math.max(entrancesUntil, performance.now() + BAND_MS);
  root.querySelectorAll<HTMLElement>(".band:not([data-in])").forEach((band, i) => {
    band.style.setProperty("--m-i", String(i));
    band.setAttribute("data-in", "");
    timers.set(band, window.setTimeout(() => finish(band), BAND_MS));
  });
}

/** Shown and finished: nothing on it plays again. */
const finish = (el: Element) => el.setAttribute("data-in", "now");

const COUNT_MS = 600;

/** G: a figure such as 12 or 7th counts up from 0, once. Others stay as they are. */
function countUp(el: HTMLElement) {
  const final = el.textContent ?? "";
  const match = /^(\d+)(\D*)$/.exec(final);
  if (!match) return;
  const target = Number(match[1]);
  let frame = 0;
  const end = () => {
    cancelAnimationFrame(frame);
    off();
    el.textContent = final;
  };
  const off = onSkip(end);
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / COUNT_MS);
    el.textContent = `${Math.round(target * (1 - (1 - t) ** 3))}${match[2]}`;
    if (t < 1) frame = requestAnimationFrame(tick);
    else end();
  };
  el.textContent = `0${match[2]}`;
  frame = requestAnimationFrame(tick);
}

/** Plays the element's entrance, then marks it finished. */
function show(el: HTMLElement) {
  // A proof mark on more than one line cannot be wiped: its clip is measured
  // from the first line only, which would hide the others until the end.
  if (el.matches(".proof-mark") && el.getClientRects().length > 1) return finish(el);
  entrancesUntil = Math.max(entrancesUntil, performance.now() + DONE_MS);
  el.setAttribute("data-in", "");
  el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
  timers.set(el, window.setTimeout(() => finish(el), DONE_MS));
}

function enter(entries: IntersectionObserverEntry[]) {
  const arriving = entries
    .filter((e) => e.isIntersecting)
    .map((e) => e.target as HTMLElement)
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

  // Stagger places are counted per kind, in reading order.
  const place = new Map<string, number>();
  for (const el of arriving) {
    io!.unobserve(el);
    const kind = el.matches(".proof-mark") ? "mark" : el.matches("[data-stamp]") ? "stamp" : el.className;
    const i = place.get(kind) ?? 0;
    place.set(kind, i + 1);
    el.style.setProperty("--m-i", String(Math.min(i, STAGGER_MAX)));

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

/** Marks everything under `root` as already entered, so it plays nothing. */
export function settle(root: ParentNode) {
  root.querySelectorAll(TARGETS).forEach(finish);
}

/** Plays a group again from its start, for the motion lab's replay buttons. */
export function replay(root: Element) {
  for (const el of root.querySelectorAll(TARGETS)) {
    window.clearTimeout(timers.get(el));
    el.removeAttribute("data-in");
    io?.unobserve(el);
  }
  root.querySelectorAll(".band").forEach((b) => b.removeAttribute("data-in"));
  void (root as HTMLElement).offsetWidth;
  revealBands(root);
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
    html.classList.remove("m-js", "m-decode");
    return;
  }
  for (const type of ["pointerdown", "keydown"]) {
    window.addEventListener(type, skipAll, { passive: true, capture: true });
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
    document.querySelectorAll(".band").forEach(finish);
    html.classList.remove("m-decode");
    html.classList.add("m-js");
  }
  revealBands();
  scan();
}

/** After a page change: the highlight, then the page's entrances, once the
    transition and breadcrumb are done, so nothing plays under the slide. */
export function afterNavigation() {
  navigatedAt = performance.now();
  headingGate().then(() => {
    revealBands();
    scan();
  });
}
