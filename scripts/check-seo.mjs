/*
 * Checks the finished HTML in dist/, after prerendering, for what search
 * engines and link previews read. The last step of `npm run build`: any
 * failure fails the build.
 *
 *   titles        present, "Page name / Samonwita Sarker", unique
 *   descriptions  present, 120 to 160 characters, unique
 *   headings      exactly one h1 per page
 *   images        every <img> has an alt attribute (alt="" for decoration)
 *   canonical     one per page, SITE_URL plus the page's path (none on 404)
 *   social        og:title, og:description, og:url, og:image (file exists),
 *                 og:image:alt, twitter:card summary_large_image
 *   structured    every JSON-LD block parses and names a @context
 *   crawl files   robots.txt points at the sitemap; every sitemap URL is a page
 *   links         no indexable page without an inbound link; pages with fewer
 *                 than two are listed
 *
 *   node scripts/check-seo.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE_URL = readFileSync(join(root, "src/lib/site.ts"), "utf8").match(/SITE_URL = "([^"]+)"/)[1];
const NAME = "Samonwita Sarker";

function pages(dir, prefix = "") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory()) return ["assets", "shots", "og"].includes(e.name) ? [] : pages(join(dir, e.name), `${prefix}/${e.name}`);
    if (!e.name.endsWith(".html")) return [];
    const name = e.name.slice(0, -5);
    const path = !prefix && name === "index" ? "/" : !prefix && name === "404" ? "/404" : `${prefix}/${name}`;
    return [{ path, html: readFileSync(join(dir, e.name), "utf8") }];
  });
}

const all = pages(dist);
const failures = [];
const fail = (path, why) => failures.push(`${path.padEnd(28)} ${why}`);
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const meta = (html, key) => {
  const tag = html.match(new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]*>`))?.[0];
  return tag ? attr(tag, "content") : undefined;
};
const decode = (s) => s.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");

const titles = new Map();
const descriptions = new Map();
const inbound = new Map(all.map((p) => [p.path, new Set()]));

for (const { path, html } of all) {
  const noindex = /<meta name="robots" content="noindex"/.test(html);

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  if (!title) fail(path, "no <title>");
  else if (!title.endsWith(` / ${NAME}`)) fail(path, `title not "Page name / ${NAME}": ${title}`);
  else if (path !== "/404") {
    if (titles.has(title)) fail(path, `duplicate title, also on ${titles.get(title)}`);
    titles.set(title, path);
  }

  const description = decode(meta(html, "description") ?? "");
  if (!description) fail(path, "no meta description");
  else {
    if (description.length < 120 || description.length > 160)
      fail(path, `description is ${description.length} characters, not 120 to 160`);
    if (path !== "/404") {
      if (descriptions.has(description)) fail(path, `duplicate description, also on ${descriptions.get(description)}`);
      descriptions.set(description, path);
    }
  }

  const body = html.slice(html.indexOf("<body"));
  const h1s = (body.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) fail(path, `${h1s} h1 elements, not 1`);

  for (const img of body.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\salt="/.test(img)) fail(path, `img without alt: ${img.slice(0, 80)}`);
  }

  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
  if (path === "/404") {
    if (canonicals.length) fail(path, "the 404 page should have no canonical");
  } else {
    const want = `${SITE_URL}${path}`;
    if (canonicals.length !== 1 || canonicals[0] !== want) fail(path, `canonical ${JSON.stringify(canonicals)}, want ${want}`);
  }

  for (const key of ["og:title", "og:description", "og:url", "og:image", "og:image:alt", "twitter:card"]) {
    if (!meta(html, key)) fail(path, `no ${key}`);
  }
  if (meta(html, "twitter:card") !== "summary_large_image") fail(path, "twitter:card is not summary_large_image");
  const card = meta(html, "og:image") ?? "";
  if (!card.startsWith(`${SITE_URL}/og/`) || !existsSync(join(dist, card.slice(SITE_URL.length))))
    fail(path, `og:image missing or not built: ${card}`);

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(json);
      if (data["@context"] !== "https://schema.org") fail(path, "JSON-LD without a schema.org @context");
    } catch (e) {
      fail(path, `JSON-LD does not parse: ${e.message}`);
    }
  }

  // Inbound links: every distinct page that links here, other than itself.
  for (const [, href] of body.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)/g)) {
    const target = href.length > 1 ? href.replace(/\/$/, "") : href;
    if (target !== path && inbound.has(target)) inbound.get(target).add(path);
  }
  if (noindex) inbound.delete(path);
}
inbound.delete("/404");

const robots = readFileSync(join(dist, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) fail("/robots.txt", "does not point at the sitemap");
const locs = [...readFileSync(join(dist, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const indexable = all.filter((p) => p.path !== "/404" && !/<meta name="robots" content="noindex"/.test(p.html));
for (const loc of locs) {
  if (!indexable.some((p) => `${SITE_URL}${p.path}` === loc)) fail("/sitemap.xml", `lists ${loc}, which is not an indexable page`);
}
for (const p of indexable) {
  if (!locs.includes(`${SITE_URL}${p.path}`)) fail("/sitemap.xml", `misses ${p.path}`);
}

const thin = [...inbound].filter(([, from]) => from.size < 2);
for (const [path, from] of thin) if (from.size === 0) fail(path, "orphan: no page links here");

if (failures.length) {
  console.error(`check-seo: ${failures.length} problem(s)\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(
  `check-seo: ${all.length} pages, ${titles.size} unique titles and descriptions, one h1 each, ` +
    `every img with alt, canonicals and social tags set, ${locs.length} sitemap URLs`,
);
if (thin.length) for (const [path, from] of thin) console.log(`  fewer than two inbound links: ${path} (${[...from].join(", ")})`);
else console.log("  every indexable page has at least two inbound links");
