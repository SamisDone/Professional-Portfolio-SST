import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { CRUMB_TYPE_MS, onSkip, reducedMotion } from "../lib/motion";

const HOLD_MS = 360;
const FADE_MS = 150;

/** The history stack position React Router keeps in each entry's state. */
const stackIndex = () => (window.history.state as { idx?: number } | null)?.idx ?? 0;

/**
 * One mono line typed at the top of the content on each page change: "cd
 * /research", or "cd .." going back. It is fixed over the content, so it moves
 * nothing, and decorative, so it is aria-hidden. It has its own transition
 * name, so it stays live and typing while the page slides beneath it.
 */
export default function TerminalCrumb() {
  const { pathname } = useLocation();
  const line = useRef<HTMLSpanElement>(null);
  const previous = useRef(pathname);
  const index = useRef(0);

  useEffect(() => {
    const before = index.current;
    index.current = stackIndex();
    const el = line.current;
    if (previous.current === pathname || !el || reducedMotion()) {
      previous.current = pathname;
      return;
    }
    previous.current = pathname;

    const text = index.current < before ? "cd .." : `cd ${pathname}`;
    let frame = 0;
    let timer = 0;
    const clear = () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      offSkip();
      el.textContent = "";
      el.dataset.fade = "";
      el.hidden = true;
    };
    const offSkip = onSkip(clear);

    el.hidden = false;
    el.dataset.fade = "";
    const start = performance.now();
    const type = (now: number) => {
      const shown = Math.min(1, (now - start) / CRUMB_TYPE_MS);
      el.textContent = text.slice(0, Math.ceil(shown * text.length));
      if (shown < 1) {
        frame = requestAnimationFrame(type);
        return;
      }
      timer = window.setTimeout(() => {
        el.dataset.fade = "out";
        timer = window.setTimeout(clear, FADE_MS);
      }, HOLD_MS);
    };
    frame = requestAnimationFrame(type);
    return clear;
  }, [pathname]);

  return (
    <div aria-hidden className="crumb">
      <div className="shell">
        <span ref={line} hidden className="crumb-line t-label" />
      </div>
    </div>
  );
}
