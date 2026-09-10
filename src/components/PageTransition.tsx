import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { ROUTES } from "../lib/routes";

const PANELS = 5;
const RISE = 0.34;
const HOLD = 0.46;
const FALL = 0.44;
const TOTAL = RISE + HOLD + FALL;

function labelFor(pathname: string) {
  return ROUTES.find((r) => r.path === pathname)?.label ?? "Samonwita Sarker";
}

/**
 * Five panels sweep up across the screen one after another, hold while the
 * route swaps behind them, then keep going and clear off the top. The name of
 * the section being entered sits in the middle of the hold.
 *
 * Panels rather than a single block because a staggered wall has a direction
 * and a rhythm you actually notice; one rectangle sliding reads as a glitch.
 */
export default function PageTransition() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const [showing, setShowing] = useState<string | null>(null);
  // Seeded with the entry path, so the first load gets no curtain: the boot
  // shell in index.html already covers that moment.
  const [seen, setSeen] = useState(pathname);

  // Adjusted during render rather than from an effect. The curtain is a
  // reaction to the location changing, not a synchronisation with anything
  // outside React, so an effect would only cost an extra render pass.
  if (pathname !== seen) {
    setSeen(pathname);
    setShowing(reduced ? null : pathname);
  }

  // A timer rather than onAnimationComplete, which did not fire dependably for
  // a keyframed track and left the curtain mounted. Scheduling is exactly what
  // an effect is for, and the state change happens in the callback, not
  // synchronously during the effect.
  useEffect(() => {
    if (!showing) return;
    const id = window.setTimeout(
      () => setShowing(null),
      (TOTAL + PANELS * 0.045 + 0.1) * 1000,
    );
    return () => window.clearTimeout(id);
  }, [showing]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {showing && (
        <div
          key={showing}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[90] flex"
        >
          {Array.from({ length: PANELS }).map((_, i) => (
            <motion.div
              key={i}
              className="h-full flex-1 bg-accent-solid"
              initial={{ y: "100%" }}
              animate={{ y: ["100%", "0%", "0%", "-100%"] }}
              transition={{
                duration: TOTAL,
                times: [0, RISE / TOTAL, (RISE + HOLD) / TOTAL, 1],
                ease: [0.76, 0, 0.24, 1],
                // Left to right on the way in, and the stagger carries through
                // the exit so the wall peels rather than lifting as one slab.
                delay: i * 0.045,
              }}
            />
          ))}

          <motion.span
            className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center h-hero font-display tracking-tight text-on-accent"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: [0, 0, 1, 1, 0], y: [28, 22, 0, 0, -22] }}
            transition={{
              duration: TOTAL,
              times: [
                0,
                (RISE - 0.06) / TOTAL,
                (RISE + 0.1) / TOTAL,
                (RISE + HOLD) / TOTAL,
                (RISE + HOLD + 0.16) / TOTAL,
              ],
              // A bare 4-number array next to a 5-keyframe track is read as one
              // easing per segment, not as a cubic bezier, and the whole
              // animation silently refuses to run. A named easing is unambiguous.
              ease: "easeOut",
            }}
          >
            {labelFor(showing)}
          </motion.span>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Reset scroll and move focus to the new page's heading on navigation, timed to
 * land while the panels still cover the screen.
 */
export function RouteEffects() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const first = useRef(true);

  useEffect(() => {
    // On first load the visitor has not navigated, so moving focus would only
    // yank them out of wherever the browser put them.
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const id = window.setTimeout(
      () => {
        document.querySelector<HTMLElement>("main h1, main h2")?.focus?.();
      },
      reduced ? 0 : RISE * 1000,
    );
    return () => window.clearTimeout(id);
  }, [pathname, reduced]);

  return null;
}
