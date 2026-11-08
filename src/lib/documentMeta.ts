import { metaFor, ogAlt, ogKey, ROUTE_META } from "./meta";
import { SITE_URL, absolute } from "./site";

/**
 * Keeps the document's title, description, canonical link and social tags in
 * step with the route. The build stamps the same values into a real HTML file
 * per route, which is what a crawler reads; this is for client navigation,
 * and runs just before the new page is drawn, so the tab never lags it.
 */
export function applyDocumentMeta(pathname: string) {
  const meta = metaFor(pathname);
  document.title = meta.title;

  const set = (selector: string, attr: string, value: string) => {
    document.head.querySelector(selector)?.setAttribute(attr, value);
  };
  set('meta[name="description"]', "content", meta.description);
  set('meta[property="og:title"]', "content", meta.title);
  set('meta[property="og:description"]', "content", meta.description);
  set('meta[property="og:image:alt"]', "content", ogAlt(meta));
  set('meta[name="twitter:title"]', "content", meta.title);
  set('meta[name="twitter:description"]', "content", meta.description);
  set('meta[name="twitter:image:alt"]', "content", ogAlt(meta));

  // Always the production address, from SITE_URL, never the host this copy
  // happens to be served from: a preview must not canonicalise to itself. A
  // 404 has no address, so it has no canonical.
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
}
