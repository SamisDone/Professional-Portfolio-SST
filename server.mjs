/**
 * Lightweight production server for Render.
 *
 * Serves the pre-rendered static files from dist/ with proper caching headers
 * and a /health endpoint for Render's health checks.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(__dirname, "dist");
const PORT = parseInt(process.env.PORT || "10000", 10);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

/** Immutable assets live under /assets/ (Vite's hashed output). */
const isImmutable = (path) => path.startsWith("/assets/");

/** Shots and og.png can be cached for a day with stale-while-revalidate. */
const isShotOrOG = (path) => path.startsWith("/shots/") || path === "/og.png";

/** The CV should always be revalidated. */
const isCV = (path) => path === "/Samonwita_Sarker_CV.pdf";

function cacheControl(urlPath) {
  if (isImmutable(urlPath)) return "public, max-age=31536000, immutable";
  if (isShotOrOG(urlPath)) return "public, max-age=86400, stale-while-revalidate=604800";
  if (isCV(urlPath)) return "public, max-age=0, must-revalidate";
  return "public, max-age=3600, stale-while-revalidate=86400";
}

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
};

/**
 * Resolve a URL path to a file in dist/.
 * /about  →  dist/about/index.html
 * /       →  dist/index.html
 */
function resolveFile(urlPath) {
  // Direct file match (assets, images, PDF, etc.)
  const direct = join(DIST, urlPath);
  if (existsSync(direct) && statSync(direct).isFile()) return direct;

  // Directory with index.html (clean URLs)
  const withIndex = join(DIST, urlPath, "index.html");
  if (existsSync(withIndex)) return withIndex;

  return null;
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(url.pathname);

  // ── Health check ──────────────────────────────────────────────
  if (pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
    return;
  }

  // ── Static file serving ───────────────────────────────────────
  const file = resolveFile(pathname);

  if (!file) {
    // Serve 404.html with a real 404 status
    const notFound = join(DIST, "404.html");
    if (existsSync(notFound)) {
      const body = readFileSync(notFound);
      res.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8",
        ...SECURITY_HEADERS,
      });
      res.end(body);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
    return;
  }

  const ext = extname(file);
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const body = readFileSync(file);

  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": cacheControl(pathname),
    ...SECURITY_HEADERS,
  });
  res.end(body);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
  console.log(`Health check at http://0.0.0.0:${PORT}/health`);
});
