/*
 * Regenerates public/og.png, the image link previews show.
 *
 * It renders from the site's own font files and colour tokens rather than
 * being drawn by hand, so the card cannot drift away from the page the way the
 * previous one did: that file was still light-background Helvetica long after
 * the site had become dark plum and had changed its type twice since.
 *
 * The copy is read out of src/data/content.ts, so the card can never quote a
 * line the site no longer says. Re-run it whenever the name, the standfirst,
 * the positioning line or the proof figures change:
 *
 *   node scripts/make-og.mjs
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const b64 = (p) => readFileSync(resolve(root, p)).toString("base64");
const serif = b64("src/fonts/InstrumentSerif.woff2");
const sans = b64("src/fonts/InstrumentSans.woff2");
const mono = b64("src/fonts/DMMono.woff2");

const src = readFileSync(resolve(root, "src/data/content.ts"), "utf8");

function field(key) {
  const m = src.match(new RegExp(key + ':\\s*\\n?\\s*"([^"]+)"'));
  if (!m) throw new Error(`could not read "${key}" out of content.ts`);
  return m[1];
}

const name = field("name");
const standfirst = field("standfirst");
const positioning = field("positioning");
/*
 * The last proof figure is computed on the page rather than typed, so it is
 * computed the same way here: the count of projects carrying a live URL.
 * Matching only quoted values read three entries and threw.
 */
const deployed = (src.match(/^\s*live: "/gm) ?? []).length;
const proof = [...src.matchAll(/value: (?:"([^"]+)"|String\(deployed\)),\s*\n\s*label: "([^"]+)"/g)]
  .slice(0, 4)
  .map(([, value, label]) => ({ value: value ?? String(deployed), label }));

if (proof.length !== 4) throw new Error(`expected 4 proof entries, read ${proof.length}`);
if (!deployed) throw new Error("read no live URLs out of content.ts");

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: "Instrument Serif"; src: url(data:font/woff2;base64,${serif}) format("woff2"); font-weight: 400 }
@font-face { font-family: "Instrument Sans"; src: url(data:font/woff2;base64,${sans}) format("woff2"); font-weight: 400 700 }
@font-face { font-family: "DM Mono"; src: url(data:font/woff2;base64,${mono}) format("woff2"); font-weight: 400 }
:root {
  --paper: 284 51% 10%; --ink: 284 22% 94%; --muted: 284 16% 74%;
  --rule: 284 45% 27%; --accent: 47 100% 51%; --accent-solid: 327 76% 45%;
}
* { box-sizing: border-box; margin: 0 }
body {
  width: 1200px; height: 630px; display: flex; flex-direction: column;
  justify-content: space-between; padding: 60px 72px;
  background: hsl(var(--paper)); color: hsl(var(--ink));
  font-family: "Instrument Sans", sans-serif; font-optical-sizing: auto;
}
/* The same backdrop grid and the same yellow top rule the site carries. */
body::before {
  content: ""; position: absolute; inset: 0; z-index: 0;
  background-image:
    linear-gradient(to right, hsl(var(--ink) / 0.07) 1px, transparent 1px),
    linear-gradient(to bottom, hsl(var(--ink) / 0.07) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(ellipse 90% 70% at 40% 40%, #000 35%, transparent 100%);
}
body::after {
  content: ""; position: absolute; inset: 0 0 auto 0; height: 4px;
  background: hsl(var(--accent)); z-index: 2;
}
.layer { position: relative; z-index: 1 }
.top { display: flex; justify-content: space-between; align-items: baseline }
.eyebrow, .wordmark { font-family: "DM Mono", monospace; font-size: 16px; letter-spacing: 0.18em; text-transform: uppercase }
.eyebrow { color: hsl(var(--accent)) }
.wordmark { color: hsl(var(--muted)) }
h1 { font-family: "Instrument Serif", serif; font-weight: 400; font-size: 104px; line-height: 1.02; letter-spacing: -0.015em }
.rule { width: 92px; height: 5px; margin-top: 26px; background: hsl(var(--accent-solid)) }
.positioning { margin-top: 22px; max-width: 32ch; font-size: 26px; line-height: 1.5; color: hsl(var(--muted)) }
.proof { display: flex; gap: 44px; border-top: 1px solid hsl(var(--rule)); padding-top: 26px }
.proof div { flex: 1 }
.v { font-family: "Instrument Serif", serif; font-size: 44px; line-height: 1; color: hsl(var(--accent)) }
.l { margin-top: 9px; font-size: 16px; line-height: 1.35; color: hsl(var(--muted)) }
</style>
<div class="layer top"><span class="eyebrow">${standfirst}</span><span class="wordmark">${name}</span></div>
<div class="layer">
  <h1>${name}</h1>
  <div class="rule"></div>
  <p class="positioning">${positioning}</p>
</div>
<div class="layer proof">
  ${proof.map((p) => `<div><div class="v">${p.value}</div><div class="l">${p.label}</div></div>`).join("")}
</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
writeFileSync(resolve(root, "public/og.png"), await page.screenshot({ type: "png" }));
await browser.close();
console.log(`og.png written\n  ${name}\n  ${positioning}`);
