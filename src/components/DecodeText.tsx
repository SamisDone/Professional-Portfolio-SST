import { createElement, useEffect, useLayoutEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { playDecode, shouldDecode } from "../lib/decode";

/** useLayoutEffect warns when rendered to a string. */
const useIsoLayoutEffect = typeof window === "undefined" ? () => {} : useLayoutEffect;

/**
 * Text that decodes into place the first time its page is visited in a
 * session: each letter cycles through random characters in Martian Mono, then
 * locks into its final letter, left to right.
 *
 * The real text is always in the DOM, in its final layout, as the accessible
 * name; it is made transparent while the animated letters, which are
 * aria-hidden, sit over it at the exact position of each final letter, so
 * nothing can shift. Children may be nested, as the bands of a two-line name
 * are. Under reduced motion, or without JavaScript, it is plain text.
 */
export default function DecodeText({
  as = "h1",
  children,
  ...rest
}: { as?: "h1" | "h2" | "h3" | "p" | "span"; children: ReactNode } & HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  // Before the page is captured for its transition, so the heading's final
  // text never shows and then scrambles.
  useIsoLayoutEffect(() => {
    if (ref.current && shouldDecode(pathname)) ref.current.dataset.decode = "pending";
  }, [pathname]);

  useEffect(() => {
    const el = ref.current;
    if (el?.dataset.decode === "pending") return playDecode(el, pathname);
  }, [pathname]);

  return createElement(as, { ...rest, ref, "data-decode": "" }, children);
}
