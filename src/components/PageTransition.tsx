import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "../hooks/useReducedMotion";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Samonwita Sarker",
  "/work": "Work",
  "/experience": "Experience",
  "/research": "Research",
  "/about": "About",
  "/contact": "Get in touch",
};

const COVER = 0.46;
const HOLD = 0.1;
const TOTAL = 1.06;

/**
 * A curtain wipes up over the old page, the route swaps behind it, then it
 * keeps travelling up and off to reveal the new one. The name of the section
 * you are going to sits in the curtain, so the transition tells you where you
 * have landed instead of just filling time.
 *
 * Under reduced motion nothing renders here and the router swaps instantly.
 */
export default function PageTransition() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const [showing, setShowing] = useState<string | null>(null);
  const first = useRef(true);

  useEffect(() => {
    // No curtain on the very first load; that is what the boot shell is for.
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced) return;

    setShowing(pathname);
    const id = window.setTimeout(() => setShowing(null), TOTAL * 1000);
    return () => window.clearTimeout(id);
  }, [pathname, reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {showing && (
        <motion.div
          key={showing}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-accent-solid"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{
            clipPath: [
              "inset(100% 0% 0% 0%)",
              "inset(0% 0% 0% 0%)",
              "inset(0% 0% 0% 0%)",
              "inset(0% 0% 100% 0%)",
            ],
          }}
          transition={{
            duration: TOTAL,
            times: [0, COVER, COVER + HOLD, 1],
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <motion.span
            className="px-6 text-center font-mono text-[13px] uppercase tracking-[0.28em] text-on-accent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
            transition={{ duration: TOTAL, times: [0, COVER, COVER + HOLD, 1] }}
          >
            {ROUTE_LABELS[showing] ?? showing.replace("/", "")}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Scroll to the top on navigation, and move focus to the page heading so a
 * keyboard or screen-reader user is not left where the previous page was.
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
    const delay = reduced ? 0 : COVER * 1000;
    const id = window.setTimeout(() => {
      const heading = document.querySelector<HTMLElement>("main h1, main h2");
      heading?.focus?.();
    }, delay);
    return () => window.clearTimeout(id);
  }, [pathname, reduced]);

  return null;
}
