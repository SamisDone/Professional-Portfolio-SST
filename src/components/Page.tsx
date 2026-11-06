import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { metaFor, ogKey, ROUTE_META } from "../lib/meta";
import { SITE_URL, absolute } from "../lib/site";

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

    // Always the production address, from SITE_URL, never the host this
    // copy happens to be served from: a preview must not canonicalise to
    // itself. A 404 has no address, so it has no canonical.
    const known = pathname in ROUTE_META;
    const url = absolute(known ? pathname : "/");
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!known) canonical?.remove();
    else {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.append(canonical);
      }
      canonical.href = url;
    }
    set('meta[property="og:url"]', "content", url);
    const card = `${SITE_URL}/og/${ogKey(known ? pathname : "/")}.png`;
    set('meta[property="og:image"]', "content", card);
    set('meta[name="twitter:image"]', "content", card);
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
