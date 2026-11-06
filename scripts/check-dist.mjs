/*
 * The last step of `npm run build`: fails if dist/ is not a finished site.
 *
 * The first Cloudflare Pages deployment served the raw template on every
 * route, "__PAGE_TITLE__" in the tab and "__CANONICAL__" in the head. A host
 * only publishes a build that exits 0, so this makes sure a build with that
 * in it cannot.
 *
 *   node scripts/check-dist.mjs
 *
 * Fails when any built HTML file:
 *   - still holds a template token (__ANYTHING__) or the dev entry
 *     /src/main.tsx, so the route-meta plugin or the client build did not run
 *   - has an empty <div id="root">, so prerender did not run
 * and when a page in the sitemap, or 404.html, has no file at all.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const problems = [];

if (!existsSync(dist)) {
  console.error("check-dist: no dist/ folder. Run the build first.");
  process.exit(1);
}

function* html(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* html(p);
    else if (e.name.endsWith(".html")) yield p;
  }
}

let pages = 0;
for (const file of html(dist)) {
  pages++;
  const rel = relative(dist, file).replaceAll("\\", "/");
  const src = readFileSync(file, "utf8");
  const tokens = [...new Set(src.match(/__[A-Z][A-Z0-9_]*__/g) ?? [])];
  if (tokens.length) problems.push(`${rel}: template token(s) left in: ${tokens.join(", ")}`);
  if (src.includes("/src/main.tsx")) problems.push(`${rel}: links the dev entry /src/main.tsx, not a built bundle`);
  const mount = src.indexOf('<div id="root">');
  if (mount === -1) problems.push(`${rel}: no <div id="root">`);
  else if (/^\s*<\/div>/.test(src.slice(mount + '<div id="root">'.length))) problems.push(`${rel}: empty root, prerender did not run`);
}

const expected = ["404.html", "index.html"];
const sitemap = join(dist, "sitemap.xml");
if (existsSync(sitemap)) {
  for (const [, loc] of readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const path = new URL(loc).pathname;
    expected.push(path === "/" ? "index.html" : `${path.slice(1)}.html`);
  }
} else problems.push("sitemap.xml is missing");
for (const f of new Set(expected)) if (!existsSync(join(dist, f))) problems.push(`${f} is missing`);

if (problems.length) {
  console.error(`check-dist: ${problems.length} problem(s), so this build must not deploy\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`check-dist: ${pages} HTML files built and prerendered, no template tokens, every sitemap page present`);
