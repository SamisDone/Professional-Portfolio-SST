/*
 * Writes the rendered DOM of every route into that route's HTML file.
 *
 * This is a single-page app, so the deployed HTML shipped a body with zero
 * text in it: the shell, a script tag, and nothing a reader could see until
 * JavaScript ran. Search engines render JavaScript, but plenty of things that
 * read a link do not, including link scrapers, applicant tracking systems and
 * anything using a plain HTTP fetch. All of them saw an empty page.
 *
 * Runs as part of `npm run build`, after vite, over the finished dist.
 *
 * The capture runs with reduced motion emulated, which the site already
 * honours. That matters: without it every entry animation is caught at its
 * start and the markup is saved holding `opacity: 0`, which is worse than no
 * markup at all. Under reduced motion the components render their plain,
 * final state.
 *
 * Case studies live in a dialog that is only mounted once opened, so their
 * text is not captured. Card titles, summaries, stacks and every heading are.
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, extname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const PORT = 4199;

const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".woff2": "font/woff2", ".jpg": "image/jpeg",
  ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".xml": "application/xml", ".txt": "text/plain", ".pdf": "application/pdf",
};

const asFile = (p) => (existsSync(p) && statSync(p).isFile() ? p : null);

// Resolves the way the host does: exact file, then directory index, then the
// SPA fallback. Serving everything from index.html would prerender the home
// page six times.
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const hit =
    asFile(join(dist, path)) ||
    asFile(join(dist, path, "index.html")) ||
    asFile(join(dist, "index.html"));
  if (!hit) {
    res.writeHead(404).end("not found");
    return;
  }
  const body = readFileSync(hit);
  res.writeHead(200, {
    "content-type": TYPES[extname(hit)] ?? "application/octet-stream",
    "content-length": String(body.length),
  });
  res.end(body);
});

await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});

// The routes are whatever HTML files the build emitted, read off disk rather
// than imported from src: this is plain Node, and src/lib/meta.ts is
// TypeScript. vite.config.ts is the one that decides which files exist.
const routes = [
  "/",
  ...readdirSync(dist, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(dist, e.name, "index.html")))
    .map((e) => `/${e.name}`),
];

let failures = 0;

for (const path of routes) {
  const file = path === "/" ? join(dist, "index.html") : join(dist, path.slice(1), "index.html");

  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  const markup = await page.evaluate(() => {
    const el = document.getElementById("root");
    // A route that rendered nothing is a bug, not something to write out.
    return el && el.innerText.trim().length > 0 ? el.innerHTML : null;
  });

  if (!markup) {
    console.error(`  ${path} rendered no text, leaving its HTML alone`);
    failures++;
    continue;
  }

  const html = readFileSync(file, "utf8");
  // Located by scanning rather than by one regex. The boot skeleton nests its
  // own </div> tags inside the mount point, and vite hoists the module script
  // into the head, so there is no reliable single pattern for the closing tag.
  // The root div is the last thing to close before </body>.
  const OPEN = '<div id="root">';
  const start = html.indexOf(OPEN);
  const bodyEnd = html.lastIndexOf("</body>");
  const end = start === -1 ? -1 : html.lastIndexOf("</div>", bodyEnd);

  if (start === -1 || end === -1 || end < start) {
    console.error(`  could not find the mount point in ${file}`);
    failures++;
    continue;
  }

  writeFileSync(file, html.slice(0, start + OPEN.length) + markup + html.slice(end));

  const words = markup.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ").length;
  console.log(`  ${path.padEnd(12)} ${(markup.length / 1024).toFixed(0).padStart(4)}kB markup, ${words} words`);
}

await browser.close();
server.close();

if (failures > 0) {
  console.error(`\nprerender: ${failures} route(s) failed`);
  process.exit(1);
}
console.log("prerender: every route now ships its text in the HTML");
