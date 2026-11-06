/**
 * The site's own address. Every absolute URL comes from this one constant:
 * canonical links, Open Graph tags, the sitemap, robots.txt, structured data,
 * the contact form's return address. A custom domain later is this one line.
 *
 * No trailing slash. Routes are written as flat files (about.html), which
 * Cloudflare Pages serves at /about with no redirect, so that is the form
 * every canonical and sitemap entry uses.
 */
// samonwita.vercel.app while Cloudflare Pages is being set up, so every
// canonical points at an address that answers today. It becomes
// "https://samonwitasarker.pages.dev" when production on Cloudflare is live.
export const SITE_URL = "https://samonwita.vercel.app";

export const SITE_NAME = "Samonwita Sarker";

/**
 * Google Search Console's HTML tag verification. Paste the `content` value of
 * the tag Search Console gives you here; while it is empty, no tag is emitted.
 */
export const GOOGLE_SITE_VERIFICATION = "";

/** The absolute address of a route. "/" stays "/", nothing else ends in one. */
export const absolute = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;
