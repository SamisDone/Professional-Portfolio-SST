/**
 * A local server for the built site. Not a host: the site is on Cloudflare
 * Pages. scripts/measure-pages.mjs starts it on a spare port, and `npm start`
 * runs it for checks with JavaScript off, which `vite preview` cannot do
 * because it answers every route with the home page's HTML.
 *
 * Serves the prerendered files in dist/ the way Cloudflare Pages does, so a
 * check here sees the same URLs answered the same way:
 *
 *   - /about is dist/about.html, / is dist/index.html (routes are flat files);
 *   - the 301s in dist/_redirects apply, including the generated
 *     trailing-slash ones, so /about/ answers 301 to /about;
 *   - anything else is dist/404.html with a real 404 status;
 *   - text responses are compressed, brotli where the client takes it and
 *     gzip otherwise, and the compressed copy is kept in memory.
 *
 * Every page's canonical link is SITE_URL, written into the HTML at build
 * time, so a page served from here still canonicalises to the main address.
 * PORT sets the port; it defaults to 10000.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync, constants } from "node:zlib";

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
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};
const COMPRESSIBLE = new Set([".html", ".css", ".js", ".json", ".svg", ".xml", ".txt"]);

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
};

function cacheControl(urlPath) {
  if (urlPath.startsWith("/assets/")) return "public, max-age=31536000, immutable";
  return "public, max-age=0, must-revalidate";
}

/** The static 301s from dist/_redirects: one "source destination 301" a line. */
const REDIRECTS = new Map();
try {
  for (const line of readFileSync(join(DIST, "_redirects"), "utf8").split("\n")) {
    const [from, to, code] = line.trim().split(/\s+/);
    if (!from || from.startsWith("#") || from.includes("*") || from.includes(":")) continue;
    REDIRECTS.set(from, { to, code: Number(code) || 302 });
  }
} catch {
  // No _redirects in the build: serve without redirects rather than fail.
}

/** A URL path to a file in dist/, or null. Never escapes dist/. */
function resolveFile(urlPath) {
  const candidates = urlPath === "/" ? ["index.html"] : [urlPath, `${urlPath}.html`];
  for (const candidate of candidates) {
    const file = normalize(join(DIST, candidate));
    if (!file.startsWith(DIST)) return null;
    if (existsSync(file) && statSync(file).isFile()) return file;
  }
  return null;
}

const compressed = new Map();
function body(file, encoding) {
  const raw = readFileSync(file);
  if (!encoding) return raw;
  // Keyed on the file's modification time too, so a rebuild under a running
  // server is never answered from the previous build's compressed copy.
  const key = `${encoding}:${file}:${statSync(file).mtimeMs}`;
  if (!compressed.has(key)) {
    compressed.set(
      key,
      encoding === "br"
        ? brotliCompressSync(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } })
        : gzipSync(raw, { level: 9 }),
    );
  }
  return compressed.get(key);
}

function send(req, res, status, file, extraHeaders = {}) {
  const ext = extname(file);
  const accepts = String(req.headers["accept-encoding"] || "");
  const encoding = COMPRESSIBLE.has(ext) ? (/\bbr\b/.test(accepts) ? "br" : /\bgzip\b/.test(accepts) ? "gzip" : null) : null;
  res.writeHead(status, {
    "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    ...(encoding ? { "Content-Encoding": encoding } : {}),
    Vary: "Accept-Encoding",
    ...SECURITY_HEADERS,
    ...extraHeaders,
  });
  res.end(req.method === "HEAD" ? undefined : body(file, encoding));
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    pathname = "/";
  }

  // /about.html to /about, and /index.html to /, as Cloudflare Pages does:
  // one address per page.
  if (pathname.endsWith(".html") && pathname !== "/404.html") {
    const clean = pathname === "/index.html" ? "/" : pathname.slice(0, -".html".length);
    res.writeHead(301, { Location: clean + url.search, ...SECURITY_HEADERS });
    res.end();
    return;
  }

  const redirect = REDIRECTS.get(pathname);
  if (redirect) {
    res.writeHead(redirect.code, { Location: redirect.to + url.search, ...SECURITY_HEADERS });
    res.end();
    return;
  }

  const file = resolveFile(pathname);
  if (file) {
    send(req, res, 200, file, { "Cache-Control": cacheControl(pathname) });
    return;
  }

  const notFound = join(DIST, "404.html");
  if (existsSync(notFound)) send(req, res, 404, notFound, { "Cache-Control": "no-cache" });
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
