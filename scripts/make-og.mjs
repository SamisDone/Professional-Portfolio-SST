/*
 * Regenerates public/og.png, the image link previews show, and
 * public/apple-touch-icon.png, the iOS home-screen icon.
 *
 * Both render from the site's own fonts and colour tokens, read out of
 * src/index.css rather than copied here, so the card cannot drift from the
 * page the way earlier ones did. The copy is read out of src/data/content.ts,
 * so the card never quotes a line the site no longer says.
 *
 * Re-run after changing the name, the standfirst, the positioning line, the
 * proof figures or a token:
 *
 *   node scripts/make-og.mjs
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");
const b64 = (p) => readFileSync(resolve(root, p)).toString("base64");

const css = read("src/index.css");
const token = (name) => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`no --${name} token in src/index.css`);
  return m[1];
};
// The card stands for the home page, so it carries the home page's section
// colour, orange, on the band behind the name.
const T = { paper: token("paper"), ink: token("ink"), ink2: token("ink-2"), section: token("orange") };

const src = read("src/data/content.ts");
function field(key) {
  const m = src.match(new RegExp(key + ':\\s*\\n?\\s*"([^"]+)"'));
  if (!m) throw new Error(`could not read "${key}" out of content.ts`);
  return m[1];
}
const name = field("name");
const standfirst = field("standfirst");
const openTo = field("openTo");
const positioning = field("positioning");

// Counted the way the page counts it: featured and notable only. Counting the
// whole file took in the coursework under otherWork and printed 15 where the
// site says 11.
const counted = src.slice(0, src.indexOf("export const otherWork"));
const deployed = (counted.match(/^\s*live: "/gm) ?? []).length;
const proof = [...src.matchAll(/value: (?:"([^"]+)"|String\(deployed\)),\s*\n\s*label: "([^"]+)"/g)]
  .slice(0, 4)
  .map(([, value, label]) => ({ value: value ?? String(deployed), label }));
if (proof.length !== 4) throw new Error(`expected 4 proof entries, read ${proof.length}`);

const [first, last] = [name.split(" ")[0], name.split(" ").slice(1).join(" ")];

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: "Archivo"; src: url(data:font/woff2;base64,${b64("src/fonts/Archivo.woff2")}) format("woff2"); font-weight: 400 900; font-stretch: 100% 125% }
@font-face { font-family: "Martian Mono"; src: url(data:font/woff2;base64,${b64("src/fonts/MartianMono-Label.woff2")}) format("woff2"); font-weight: 500 }
* { box-sizing: border-box; margin: 0 }
body {
  width: 1200px; height: 630px; padding: 56px 64px; display: flex; flex-direction: column;
  background: ${T.paper}; color: ${T.ink}; font-family: "Archivo", sans-serif;
}
.label { font-family: "Martian Mono", monospace; font-weight: 500; font-size: 18px; letter-spacing: 0.06em; text-transform: uppercase }
h1 { margin-top: 18px; font-weight: 850; font-stretch: 125%; font-size: 104px; line-height: 0.9; letter-spacing: -0.03em; text-transform: uppercase }
h1 span { display: block; width: fit-content; background: ${T.section}; border: 2px solid ${T.ink}; padding: 0.08em 0.22em 0.04em }
h1 span + span { margin-top: -2px }
.role { margin-top: 22px; max-width: 34ch; font-size: 28px; line-height: 1.35 }
.proof { margin-top: auto; display: flex; border-top: 4px solid ${T.ink}; padding-top: 18px; gap: 0 }
.proof > div { flex: 1; padding-right: 20px }
.proof > div + div { border-left: 2px solid ${T.ink}; padding-left: 20px }
.v { font-weight: 850; font-stretch: 125%; font-size: 40px; line-height: 0.9; letter-spacing: -0.03em }
.l { margin-top: 10px; font-size: 16px; line-height: 1.35; color: ${T.ink2} }
</style>
<p class="label">${standfirst} / ${openTo}</p>
<h1><span>${first}</span><span>${last}</span></h1>
<p class="role">${positioning}</p>
<div class="proof">${proof.map((p) => `<div><div class="v">${p.value}</div><div class="l">${p.label}</div></div>`).join("")}</div>`;

const browser = await chromium.launch();

const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await og.setContent(html, { waitUntil: "load" });
await og.evaluate(() => document.fonts.ready);
writeFileSync(resolve(root, "public/og.png"), await og.screenshot({ type: "png" }));

// The favicon is already paths, so it renders the same anywhere.
const icon = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
await icon.setContent(
  `<style>*{margin:0}</style><img src="data:image/svg+xml;base64,${b64("public/favicon.svg")}" width="180" height="180">`,
  { waitUntil: "load" },
);
writeFileSync(resolve(root, "public/apple-touch-icon.png"), await icon.screenshot({ type: "png" }));

await browser.close();
console.log(`og.png and apple-touch-icon.png written\n  ${name}\n  ${positioning}`);
