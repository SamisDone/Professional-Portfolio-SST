import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

/**
 * The site's own absolute URL, needed in three places that cannot use a
 * relative path: the canonical link, the Open Graph tags (crawlers do not
 * resolve relative image paths, so a relative one silently yields a blank
 * link preview), and sitemap.xml.
 *
 * Set VITE_SITE_URL once — in .env.local for a local build, or as a project
 * environment variable on the host — and this stamps it everywhere. Until it
 * is set, the build falls back to a placeholder and warns, so a not-yet-
 * deployed site never ships meta tags pointing at a URL that doesn't exist.
 */
const FALLBACK = "https://example.com";

function siteUrlPlugin(siteUrl: string, isBuild: boolean): Plugin {
  return {
    name: "site-url",
    apply: () => true,

    buildStart() {
      if (isBuild && siteUrl === FALLBACK) {
        this.warn(
          "VITE_SITE_URL is not set. Open Graph tags, the canonical link and " +
            "sitemap.xml will point at " +
            FALLBACK +
            ". Set it before deploying or link previews will not resolve.",
        );
      }
    },

    // Rewrite the placeholder token in index.html.
    transformIndexHtml(html) {
      return html.replaceAll("__SITE_URL__", siteUrl);
    },

    // robots.txt and sitemap.xml are generated rather than kept in public/,
    // because a file copied verbatim can't carry the deployed origin.
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url>\n` +
          `    <loc>${siteUrl}/</loc>\n` +
          `    <changefreq>monthly</changefreq>\n` +
          `    <priority>1.0</priority>\n` +
          `  </url>\n` +
          `</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Vercel and Netlify both expose the deployed host at build time, so a
  // normal deploy needs no configuration at all.
  const siteUrl = (
    env.VITE_SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "") ||
    env.URL ||
    FALLBACK
  ).replace(/\/$/, "");

  return {
    plugins: [react(), siteUrlPlugin(siteUrl, command === "build")],
  };
});
