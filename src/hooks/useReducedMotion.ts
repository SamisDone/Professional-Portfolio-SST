import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True when the visitor has asked their OS to reduce motion.
 *
 * Every decorative animation checks it: the sliding work rail, the page
 * transition panels, the masked headings, the image reveals and the CGPA
 * chart. Under reduced motion the rail becomes a strip the visitor scrolls by
 * hand rather than a frozen one, which is the part that is easy to get wrong.
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
