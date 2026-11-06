import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True when the visitor has asked their OS to reduce motion.
 *
 * Almost nothing on the site moves now, and the CSS handles most of what
 * does. This is read by the one script-driven animation left, the chart line
 * on About, which then renders drawn and stays that way.
 */
export function useReducedMotion(): boolean {
  // With no window we are being rendered to a string by the prerender step,
  // and there the answer must be true. Under reduced motion every component
  // renders its plain final state; with motion on, the markup is saved frozen
  // at the start of an entry animation, holding `opacity: 0`. That ships a
  // page whose text is present but invisible, which is worse than shipping no
  // markup at all.
  const [reduced, setReduced] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
