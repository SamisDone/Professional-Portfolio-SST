/*
 * Renders public/favicon.svg into public/favicon.ico, at 16, 32 and 48px.
 *
 * Browsers that read the SVG never ask for this file, but crawlers, feed
 * readers and older browsers ask for /favicon.ico by name. Each size is a PNG
 * inside the ICO container, which every browser since IE11 reads.
 *
 * Run by hand after changing the SVG, never during a build:
 *
 *   node scripts/make-favicon.mjs
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(resolve(root, "public/favicon.svg"), "utf8");
const SIZES = [16, 32, 48];

const browser = await chromium.launch();
const pngs = [];
for (const size of SIZES) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(
    `<!doctype html><style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
  );
  pngs.push(await page.screenshot({ type: "png" }));
  await page.close();
}
await browser.close();

// ICONDIR, one ICONDIRENTRY per size, then the PNGs.
const header = Buffer.alloc(6 + 16 * SIZES.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(SIZES.length, 4);
let offset = header.length;
SIZES.forEach((size, i) => {
  const at = 6 + 16 * i;
  header.writeUInt8(size, at);
  header.writeUInt8(size, at + 1);
  header.writeUInt8(0, at + 2);
  header.writeUInt8(0, at + 3);
  header.writeUInt16LE(1, at + 4);
  header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(pngs[i].length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += pngs[i].length;
});

const ico = Buffer.concat([header, ...pngs]);
writeFileSync(resolve(root, "public/favicon.ico"), ico);
console.log(`favicon.ico: ${SIZES.join(", ")}px, ${(ico.length / 1024).toFixed(1)}kB`);
