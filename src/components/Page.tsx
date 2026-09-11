import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { metaFor } from "../lib/meta";

/**
 * Keeps the document's title, description and canonical link in step with the
 * route the visitor is actually on.
 *
 * The build stamps the same values into a real HTML file per route, which is
 * what a crawler reads. This is for everything after the first paint: a
 * visitor navigating client-side, the browser tab, and a bookmark.
 */
function useDocumentMeta(pathname: string) {
  useEffect(() => {
    const meta = metaFor(pathname);
    document.title = meta.title;

    const set = (selector: string, attr: string, value: string) => {
      const el = document.head.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    set('meta[name="description"]', "content", meta.description);
    set('meta[property="og:title"]', "content", meta.title);
    set('meta[property="og:description"]', "content", meta.description);
    set('meta[name="twitter:title"]', "content", meta.title);
    set('meta[name="twitter:description"]', "content", meta.description);

    const url = window.location.origin + pathname;
    set('link[rel="canonical"]', "href", url);
    set('meta[property="og:url"]', "content", url);
  }, [pathname]);
}

/**
 * Wraps every route. Pages are sized to the viewport minus the header, so a
 * section is a screen rather than a scroll, and the content swaps while the
 * transition panels still cover it.
 */
export default function Page({
  children,
  title,
  center = false,
}: {
  children: ReactNode;
  /** Names the landmark for a screen reader. The document title comes from
      `lib/meta.ts`, keyed on the route. */
  title: string;
  /** Vertically centre the content when it is shorter than the screen. */
  center?: boolean;
}) {
  const reduced = useReducedMotion();
  const { pathname } = useLocation();
  useDocumentMeta(pathname);

  return (
    <motion.main
      id="main"
      aria-label={title}
      initial={reduced ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -14, transition: { duration: 0.14 } }}
      transition={{
        duration: reduced ? 0 : 0.4,
        // Lands while the transition panels still cover the screen. This delay
        // plus the duration is most of what a navigation costs, so it is the
        // first place to look if the site starts feeling slow again.
        delay: reduced ? 0 : 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`flex flex-1 flex-col page-pad ${center ? "justify-center" : ""}`}
    >
      {children}
    </motion.main>
  );
}
