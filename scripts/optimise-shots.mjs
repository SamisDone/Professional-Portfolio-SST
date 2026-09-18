/*
 * Re-encodes public/shots into the sizes the page actually renders.
 *
 * The captures come off scripts/capture-shots.mjs at 2240px wide. A rail card
 * is at most 430 CSS pixels and the dialog is about 700, so every visitor was
 * downloading roughly five times the pixels they could see, eight times over
 * on the work page.
 *
 * Each shot becomes a 1400px and a 700px WebP, and the JPEG is rebuilt at
 * 1400px as the fallback for anything that cannot read WebP. `Figure` picks
 * between them with srcset.
 *
 * The encoding runs in Chromium through a canvas rather than an image library,
 * because Playwright is already a dev dependency and this needs no new one.
 *
 *   node scripts/optimise-shots.mjs             # all of them
 *   node scripts/optimise-shots.mjs sixpence    # just this one
 *
 * Name the shots you want when only one has been re-captured. A shot that is
 * already optimised gains nothing from a second pass and loses a little to
 * the re-encode, so the whole folder is worth running only after a full
 * re-capture.
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, basename, extname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public", "shots");

const WIDTHS = [
  { width: 1400, suffix: "" },
  { width: 700, suffix: "-700" },
];
const WEBP_QUALITY = 0.82;
const JPEG_QUALITY = 0.82;

// Both capture formats. One shot is a PNG, and an extension filter that only
// looked for .jpg quietly skipped it.
const SOURCE_EXT = new Set([".jpg", ".png"]);
const only = new Set(process.argv.slice(2));
const sources = readdirSync(dir).filter(
  (f) =>
    SOURCE_EXT.has(extname(f)) &&
    !f.includes("-700") &&
    (only.size === 0 || only.has(basename(f, extname(f)))),
);
if (sources.length === 0)
  throw new Error(
    only.size ? `no source image for ${[...only].join(", ")}` : `no source images in ${dir}`,
  );

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("about:blank");

/** Draws the image at `width` and returns the encoded bytes. */
async function encode(dataUrl, width, type, quality) {
  const out = await page.evaluate(
    async ([src, w, mime, q]) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      // Never upscale: a shot narrower than the target keeps its own width.
      const targetW = Math.min(w, img.naturalWidth);
      const targetH = Math.round((targetW / img.naturalWidth) * img.naturalHeight);
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetW, targetH);
      return { url: canvas.toDataURL(mime, q), w: targetW, h: targetH };
    },
    [dataUrl, width, type, quality],
  );
  return { buf: Buffer.from(out.url.split(",")[1], "base64"), w: out.w, h: out.h };
}

let before = 0;
let after = 0;

for (const file of sources) {
  const ext = extname(file);
  const name = basename(file, ext);
  const path = join(dir, file);
  before += statSync(path).size;

  const mime = ext === ".png" ? "image/png" : "image/jpeg";
  const dataUrl = `data:${mime};base64,` + readFileSync(path).toString("base64");
  const parts = [];

  for (const { width, suffix } of WIDTHS) {
    const webp = await encode(dataUrl, width, "image/webp", WEBP_QUALITY);
    // Both variants are always written, even when the source is narrower than
    // the larger target and the two come out identical. `Figure` builds its
    // srcset from the filename alone, so a missing variant is a 404 on every
    // page view, and that costs more than a duplicate few kB in the repo.
    const out = join(dir, `${name}${suffix}.webp`);
    writeFileSync(out, webp.buf);
    after += webp.buf.length;
    parts.push(`${webp.w}w webp ${(webp.buf.length / 1024).toFixed(0)}kB`);
  }

  // The original format stays as the fallback for anything that cannot read
  // WebP, rebuilt at the larger of the two sizes. Re-encoding is only worth it
  // if it actually helps: a small PNG round-tripped through a canvas comes back
  // lossless and several times heavier than the file it replaced.
  const fallback = await encode(dataUrl, WIDTHS[0].width, mime, JPEG_QUALITY);
  const original = statSync(path).size;
  if (fallback.buf.length < original) {
    writeFileSync(path, fallback.buf);
    after += fallback.buf.length;
    parts.push(`${fallback.w}w ${ext.slice(1)} ${(fallback.buf.length / 1024).toFixed(0)}kB`);
  } else {
    after += original;
    parts.push(`${ext.slice(1)} kept at ${(original / 1024).toFixed(0)}kB`);
  }

  console.log(`${name.padEnd(14)} ${parts.join("  ")}`);
}

await browser.close();
console.log(
  `\n${sources.length} shots: ${(before / 1024).toFixed(0)}kB in, ` +
    `${(after / 1024).toFixed(0)}kB out across all three variants.`,
);
