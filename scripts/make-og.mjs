/*
 * Renders the social cards in public/og, one 1200 by 630 PNG per page, and
 * public/apple-touch-icon.png, the iOS home-screen icon.
 *
 * Everything comes from the site's own sources, so the cards cannot drift
 * from the pages: the colour tokens out of src/index.css, the fonts out of
 * src/fonts, each page's heading and section out of src/lib/meta.ts and
 * src/lib/routes.ts, and the home card's copy out of src/data/content.ts.
 *
 * Each card: the paper ground, the page's heading, a 4px rule in the page's
 * section colour between two 2px ink rules, and the name. The home card shows
 * the name on its section band, the role line and the four proof figures.
 *
 * Needs Node 22.18 or later, which imports the TypeScript sources directly,
 * and a Playwright browser. It is run by hand and never during a build:
 *
 *   node scripts/make-og.mjs
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");
const b64 = (p) => readFileSync(resolve(root, p)).toString("base64");
const load = (p) => import(pathToFileURL(resolve(root, p)).href);

const { ROUTE_META, ogKey } = await load("src/lib/meta.ts");
const { sectionFor } = await load("src/lib/routes.ts");
const { profile, proof } = await load("src/data/content.ts");

const css = read("src/index.css");
const token = (name) => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`no --${name} token in src/index.css`);
  return m[1];
};
const T = { paper: token("paper"), ink: token("ink"), ink2: token("ink-2") };
const SECTION = Object.fromEntries(["orange", "blue", "green", "pink"].map((s) => [s, token(s)]));

const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const FONTS = `
@font-face { font-family: "Archivo"; src: url(data:font/woff2;base64,${b64("src/fonts/Archivo.woff2")}) format("woff2"); font-weight: 400 900; font-stretch: 100% 125% }
@font-face { font-family: "Martian Mono"; src: url(data:font/woff2;base64,${b64("src/fonts/MartianMono-Label.woff2")}) format("woff2"); font-weight: 500 }`;

const BASE = (section) => `
* { box-sizing: border-box; margin: 0 }
body { width: 1200px; height: 630px; padding: 56px 64px; display: flex; flex-direction: column;
  background: ${T.paper}; color: ${T.ink}; font-family: "Archivo", sans-serif }
.label { font-family: "Martian Mono", monospace; font-weight: 500; font-size: 18px; letter-spacing: 0.06em; text-transform: uppercase }
.rule { height: 8px; border-top: 2px solid ${T.ink}; border-bottom: 2px solid ${T.ink}; background: ${section} }`;

/** Every page but the home page. */
function pageCard(meta, section) {
  const h = meta.heading;
  const size = h.length <= 14 ? 132 : h.length <= 26 ? 104 : 80;
  return `<!doctype html><meta charset="utf-8"><style>${FONTS}${BASE(section)}
h1 { margin-top: auto; font-weight: 850; font-stretch: 125%; font-size: ${size}px; line-height: 0.92; letter-spacing: -0.03em; max-width: 15ch; text-wrap: balance }
.rule { margin-top: 40px }
.name { margin-top: 28px; font-weight: 800; font-stretch: 112%; font-size: 34px }
</style>
<p class="label">${esc(profile.standfirst)} / ${esc(profile.openTo)}</p>
<h1>${esc(h)}</h1>
<div class="rule"></div>
<p class="name">${esc(profile.name)}</p>`;
}

/** The home card: the name on its band, the role line and the proof figures. */
function homeCard(section) {
  const [first, ...rest] = profile.name.split(" ");
  return `<!doctype html><meta charset="utf-8"><style>${FONTS}${BASE(section)}
h1 { margin-top: 18px; font-weight: 850; font-stretch: 125%; font-size: 104px; line-height: 0.9; letter-spacing: -0.03em; text-transform: uppercase }
h1 span { display: block; width: fit-content; background: ${section}; border: 2px solid ${T.ink}; padding: 0.08em 0.22em 0.04em }
h1 span + span { margin-top: -2px }
.role { margin-top: 22px; max-width: 34ch; font-size: 28px; line-height: 1.35 }
.proof { margin-top: auto; display: flex; border-top: 4px solid ${T.ink}; padding-top: 18px }
.proof > div { flex: 1; padding-right: 20px }
.proof > div + div { border-left: 2px solid ${T.ink}; padding-left: 20px }
.v { font-weight: 850; font-stretch: 125%; font-size: 40px; line-height: 0.9; letter-spacing: -0.03em }
.l { margin-top: 10px; font-size: 16px; line-height: 1.35; color: ${T.ink2} }
</style>
<p class="label">${esc(profile.standfirst)} / ${esc(profile.openTo)}</p>
<h1><span>${esc(first)}</span><span>${esc(rest.join(" "))}</span></h1>
<p class="role">${esc(profile.positioning)}</p>
<div class="proof">${proof.map((p) => `<div><div class="v">${esc(p.value)}</div><div class="l">${esc(p.label)}</div></div>`).join("")}</div>`;
}

const out = resolve(root, "public/og");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

for (const [path, meta] of Object.entries(ROUTE_META)) {
  const section = SECTION[sectionFor(path)];
  await page.setContent(path === "/" ? homeCard(section) : pageCard(meta, section), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  writeFileSync(resolve(out, `${ogKey(path)}.png`), await page.screenshot({ type: "png" }));
}

// The favicon is already paths, so it renders the same anywhere.
const icon = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
await icon.setContent(
  `<style>*{margin:0}</style><img src="data:image/svg+xml;base64,${b64("public/favicon.svg")}" width="180" height="180">`,
  { waitUntil: "load" },
);
writeFileSync(resolve(root, "public/apple-touch-icon.png"), await icon.screenshot({ type: "png" }));

await browser.close();
console.log(`${readdirSync(out).length} cards in public/og, and apple-touch-icon.png`);
