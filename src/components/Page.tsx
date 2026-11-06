import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { metaFor } from "../lib/meta";

/**
 * Keeps the document's title, description and canonical link in step with
 * the route. The build stamps the same values into a real HTML file per
 * route, which is what a crawler reads; this is for everything after the
 * first paint.
 */
function useDocumentMeta(pathname: string) {
  useEffect(() => {
    const meta = metaFor(pathname);
    document.title = meta.title;

    const set = (selector: string, attr: string, value: string) => {
      document.head.querySelector(selector)?.setAttribute(attr, value);
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
 * Wraps every route. Pages scroll: the one-screen rule, and the fifteen
 * height queries that held it up, are gone. Nothing animates in.
 */
export default function Page({ children, title }: { children: ReactNode; title: string }) {
  const { pathname } = useLocation();
  useDocumentMeta(pathname);

  return (
    <main id="main" aria-label={title} className="flex-1">
      {children}
    </main>
  );
}
