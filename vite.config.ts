import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { ROUTE_META, DEFAULT_META } from "./src/lib/meta.js";

/**
 * The site's own absolute URL, needed anywhere a relative path will not do:
 * the canonical link, the Open Graph tags (crawlers do not resolve relative
 * image paths, so a relative one silently yields a blank link preview), and
 * sitemap.xml.
 *
 * The default is the deployed origin, so a plain `npm run build` anywhere
 * produces correct tags. Override with VITE_SITE_URL for a custom domain.
 */
const SITE_URL = "https://samonwita.vercel.app";

const escape = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function siteUrlPlugin(siteUrl: string): Plugin {
  return {
    name: "site-url",

    // Rewrite the origin token in index.html. The per-route tokens are left
    // for routeMetaPlugin, which runs over the finished HTML.
    transformIndexHtml(html) {
      return html.replaceAll("__SITE_URL__", siteUrl);
    },

    // robots.txt and sitemap.xml are generated rather than kept in public/,
    // because a file copied verbatim cannot carry the deployed origin. Every
    // route is listed: a sitemap naming only the home page tells a crawler
    // the other five are not worth indexing.
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });

      const urls = Object.keys(ROUTE_META)
        .map(
          (path) =>
            `  <url>\n` +
            `    <loc>${siteUrl}${path}</loc>\n` +
            `    <changefreq>monthly</changefreq>\n` +
            `    <priority>${path === "/" ? "1.0" : "0.8"}</priority>\n` +
            `  </url>\n`,
        )
        .join("");

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls +
          `</urlset>\n`,
      });
    },
  };
}

/**
 * Emits one real HTML file per route, each carrying that route's own title,
 * description, canonical link and Open Graph tags.
 *
 * Without this every route serves the same index.html, so a crawler that does
 * not execute JavaScript reads one identical title and description for all six
 * pages. Most social-preview crawlers are exactly that.
 *
 * The files sit at `work/index.html` and so on. Vercel serves a matching file
 * before it consults the rewrite in vercel.json, so these are what a crawler
 * gets, while a visitor still lands in the same single-page app and navigates
 * client-side from there.
 */
function routeMetaPlugin(): Plugin {
  return {
    name: "route-meta",
    enforce: "post",

    generateBundle(_options, bundle) {
      const index = bundle["index.html"];
      if (!index || index.type !== "asset") return;

      const fill = (html: string, path: string) => {
        const meta = ROUTE_META[path] ?? DEFAULT_META;
        return html
          .replaceAll("__PAGE_TITLE__", escape(meta.title))
          .replaceAll("__PAGE_DESCRIPTION__", escape(meta.description))
          // The canonical for the home page is "/", not the empty string.
          .replaceAll("__PAGE_PATH__", path === "/" ? "/" : path);
      };

      const template = String(index.source);

      for (const path of Object.keys(ROUTE_META)) {
        if (path === "/") continue;
        this.emitFile({
          type: "asset",
          fileName: `${path.replace(/^\//, "")}/index.html`,
          source: fill(template, path),
        });
      }

      // The root last, so the template is still untouched for the loop above.
      index.source = fill(template, "/");
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Vercel and Netlify both expose the deployed host at build time, so a
  // preview deployment gets its own origin rather than the production one.
  const siteUrl = (
    env.VITE_SITE_URL ||
    (env.VERCEL_ENV && env.VERCEL_ENV !== "production" && env.VERCEL_URL
      ? `https://${env.VERCEL_URL}`
      : "") ||
    SITE_URL
  ).replace(/\/$/, "");

  return {
    plugins: [react(), siteUrlPlugin(siteUrl), routeMetaPlugin()],
  };
});
