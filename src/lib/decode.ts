import { headingGate, onSkip } from "./motion";

/**
 * The signature: text resolving like an OCR system reading it. The letters
 * are built by hand, directly in the DOM, because they change about thirty
 * times a second and React has no reason to know.
 */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/_<>";
const FRAME_MS = 33;
/** How long the first letter cycles before it locks. */
const HOLD_MS = 160;
/** After the highlight starts growing, as the brief sets it. */
const AFTER_HIGHLIGHT_MS = 80;

const seenKey = (key: string) => `m-seen:${key}`;
const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

function seen(key: string) {
  try {
    return sessionStorage.getItem(seenKey(key)) === "1";
  } catch {
    return true;
  }
}
function markSeen(key: string) {
  try {
    sessionStorage.setItem(seenKey(key), "1");
  } catch {
    /* it simply plays again */
  }
}

/** Once per page per session, and only while the motion layer is on. */
export function shouldDecode(key: string) {
  return document.documentElement.classList.contains("m-js") && !seen(key);
}

type Letter = { el: HTMLElement; final: string; at: number; locked: boolean };

/** One absolutely placed letter over each character of the real text. */
function buildLetters(root: HTMLElement, fx: HTMLElement) {
  const origin = root.getBoundingClientRect();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  const placed: { el: HTMLElement; final: string }[] = [];
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    for (let i = 0; i < node.length; i++) {
      const final = node.data[i];
      if (!final.trim()) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const r = range.getClientRects()[0];
      if (!r) continue;
      const el = document.createElement("span");
      el.className = "dt-r";
      el.style.left = `${r.left - origin.left}px`;
      el.style.top = `${r.top - origin.top}px`;
      el.style.width = `${r.width}px`;
      el.style.height = `${r.height}px`;
      el.style.lineHeight = `${r.height}px`;
      el.textContent = glyph();
      fx.append(el);
      placed.push({ el, final });
    }
  }
  return placed;
}

/**
 * Runs the decode on `root`, once the page's transition and breadcrumb are
 * done and the highlight has started. Returns the cleanup: every timer stops
 * when the decode ends or the component unmounts.
 */
export function playDecode(root: HTMLElement, key: string) {
  let stopped = false;
  let timer = 0;
  let frame = 0;
  let fx: HTMLElement | null = null;

  const finish = () => {
    if (stopped) return;
    stopped = true;
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", finish);
    offSkip();
    fx?.remove();
    delete root.dataset.decode;
    root.dataset.decode = "";
    document.documentElement.classList.remove("m-decode");
  };

  const skip = () => {
    markSeen(key);
    finish();
  };
  const offSkip = onSkip(skip);

  const begin = async () => {
    await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 300))]);
    if (stopped) return;
    markSeen(key);
    const layer = document.createElement("span");
    layer.className = "dt-fx";
    layer.setAttribute("aria-hidden", "true");
    const placed = buildLetters(root, layer);
    root.append(layer);
    fx = layer;
    root.dataset.decode = "run";
    document.documentElement.classList.remove("m-decode");
    // A resize would leave the letters where the text used to be.
    window.addEventListener("resize", finish);

    const total = Math.min(900, Math.max(600, 420 + placed.length * 28));
    const span = Math.max(1, placed.length - 1);
    const letters: Letter[] = placed.map((p, i) => ({ ...p, at: HOLD_MS + ((total - HOLD_MS) * i) / span, locked: false }));

    const start = performance.now();
    let last = start;
    const tick = (now: number) => {
      if (stopped) return;
      if (now - last >= FRAME_MS) {
        last = now;
        const elapsed = now - start;
        let open = 0;
        for (const l of letters) {
          if (l.locked) continue;
          if (elapsed >= l.at) {
            l.locked = true;
            l.el.className = "dt-l";
            l.el.textContent = l.final;
          } else {
            open++;
            l.el.textContent = glyph();
          }
        }
        if (open === 0) return finish();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };

  headingGate().then(() => {
    if (!stopped) timer = window.setTimeout(begin, AFTER_HIGHLIGHT_MS);
  });

  return finish;
}
