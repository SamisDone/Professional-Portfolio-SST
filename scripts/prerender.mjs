/*
 * Writes the rendered HTML of every route into that route's file in dist.
 *
 * This is a single-page app, so the deployed HTML shipped a body with zero
 * text in it: the shell, a script tag, and nothing a reader could see until
 * JavaScript ran. Search engines render JavaScript and coped, but plenty of
 * things that read a URL do not, including link scrapers, applicant tracking
 * systems and anything doing a plain HTTP fetch. All of them got an empty page.
 *
 * Runs as part of `npm run build`, after both vite passes.
 *
 * It renders through react-dom/server, from the bundle vite builds out of
 * src/entry-server.tsx. An earlier version drove a real Chromium through
 * Playwright. That worked locally and failed on the host, because it made the
 * deploy depend on a browser binary being downloadable inside the build
 * container, and a build that cannot finish is worse than a thin page. This
 * needs nothing but Node.
 *
 * Case studies live in a dialog that mounts only when opened, so their text is
 * not included. Every heading, card title, summary and stack is.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve, join } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssrEntry = join(root, "dist-ssr", "entry-server.js");

if (!existsSync(ssrEntry)) {
  console.error(`prerender: no SSR bundle at ${ssrEntry}`);
  console.error("Run `vite build --ssr src/entry-server.tsx` first.");
  process.exit(1);
}

const { render } = await import(pathToFileURL(ssrEntry).href);

// The routes are whatever HTML files the build emitted. vite.config.ts decides
// which exist; reading them off disk keeps this script from having to import
// TypeScript.
const routes = [
  "/",
  ...readdirSync(dist, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(dist, e.name, "index.html")))
    .map((e) => `/${e.name}`),
];

const OPEN = '<div id="root">';
let failures = 0;

for (const path of routes) {
  const file = path === "/" ? join(dist, "index.html") : join(dist, path.slice(1), "index.html");

  let markup;
  try {
    markup = render(path);
  } catch (error) {
    console.error(`  ${path} failed to render: ${error.message}`);
    failures++;
    continue;
  }

  const text = markup.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length === 0) {
    console.error(`  ${path} rendered no text, leaving its HTML alone`);
    failures++;
    continue;
  }

  const html = readFileSync(file, "utf8");
  // Located by scanning rather than by one regex: the boot skeleton nests its
  // own </div> tags inside the mount point, and vite hoists the module script
  // into the head, so there is no single reliable pattern for the closing tag.
  // The root div is the last thing to close before </body>.
  const start = html.indexOf(OPEN);
  const bodyEnd = html.lastIndexOf("</body>");
  const end = start === -1 ? -1 : html.lastIndexOf("</div>", bodyEnd);

  if (start === -1 || end === -1 || end < start) {
    console.error(`  could not find the mount point in ${file}`);
    failures++;
    continue;
  }

  writeFileSync(file, html.slice(0, start + OPEN.length) + markup + html.slice(end));
  console.log(
    `  ${path.padEnd(12)} ${(markup.length / 1024).toFixed(0).padStart(4)}kB markup, ` +
      `${text.split(" ").length} words`,
  );
}

if (failures > 0) {
  console.error(`\nprerender: ${failures} route(s) failed`);
  process.exit(1);
}
console.log("prerender: every route ships its text in the HTML");
