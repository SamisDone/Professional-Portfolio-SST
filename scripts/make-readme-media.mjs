/**
 * Records the screenshots and animations in docs/ that the README shows.
 *
 *   npm run build && npm run preview     # in one terminal
 *   node scripts/make-readme-media.mjs   # in another
 *   node scripts/make-readme-media.mjs work-filter about-chart   # just these
 *
 * Stills are taken with reduced motion, so each shows a page at rest. Clips
 * are recorded by Playwright as WebM in a fresh browser context, so every
 * first-visit effect plays as a new visitor would see it, then cut and
 * encoded by ffmpeg as looping animated WebP at 15fps and 960px wide, which
 * GitHub plays inline like a GIF at a fraction of a GIF's size.
 *
 * Playwright moves a real mouse but draws no pointer, so clips that point at
 * things carry a small cursor dot, appended to document.body outside the
 * React root. It is the only thing in a clip that is not the site.
 *
 * Needs a Playwright browser (npx playwright install chromium) and ffmpeg
 * with libwebp on the PATH.
 */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "docs");
const tmp = join(root, ".readme-media");
const BASE = process.env.MEDIA_BASE || "http://localhost:4173";
const W = 1280;
const H = 800;

const only = process.argv.slice(2);
const wanted = (name) => only.length === 0 || only.includes(name);

/** The cursor dot: ink with a paper ring, so it reads on every ground. */
const CURSOR = () => {
  const add = () => {
    if (document.getElementById("rm-cursor")) return;
    const dot = document.createElement("div");
    dot.id = "rm-cursor";
    dot.style.cssText =
      "position:fixed;left:-40px;top:-40px;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;" +
      "background:#111;border:3px solid #f3f1ec;z-index:2147483647;pointer-events:none;transition:transform 80ms";
    document.body.append(dot);
    addEventListener("mousemove", (e) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    }, true);
    addEventListener("mousedown", () => (dot.style.transform = "scale(0.7)"), true);
    addEventListener("mouseup", () => (dot.style.transform = ""), true);
  };
  if (document.body) add();
  else addEventListener("DOMContentLoaded", add);
};

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

/** Moves the mouse to the middle of a locator in visible steps. */
async function pointAt(page, locator, steps = 18) {
  const box = await locator.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps });
}

/**
 * Records one clip. `setup` runs before recording counts (it may navigate),
 * `act` is what the clip shows. The WebM is cut from the moment `act`
 * begins, so a slow first load never opens on a blank frame by accident.
 */
async function clip(browser, name, { setup, act, cursor = false, width = W, height = H }) {
  if (!wanted(name)) return;
  const dir = join(tmp, name);
  rmSync(dir, { recursive: true, force: true });
  const born = Date.now();
  const ctx = await browser.newContext({
    viewport: { width, height },
    recordVideo: { dir, size: { width, height } },
  });
  if (cursor) await ctx.addInitScript(CURSOR);
  const page = await ctx.newPage();
  if (setup) await setup(page);
  const start = (Date.now() - born) / 1000;
  await act(page);
  const end = (Date.now() - born) / 1000;
  await ctx.close();
  const webm = join(dir, readdirSync(dir).find((f) => f.endsWith(".webm")));
  const out = join(docs, `${name}.webp`);
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-ss", start.toFixed(2), "-to", end.toFixed(2), "-i", webm,
    // 960px is wider than GitHub's README column, so nothing is lost there,
    // and 15fps keeps a six-second clip near 2MB.
    "-vf", `fps=15,scale=${Math.round((width * 3) / 4)}:-2:flags=lanczos`,
    "-c:v", "libwebp_anim", "-lossless", "0", "-quality", "70", "-compression_level", "4", "-loop", "0",
    out,
  ]);
  console.log(`${name}.webp  ${(end - start).toFixed(1)}s  ${Math.round(statSync(out).size / 1024)}kB`);
}

/** One still, at rest, with motion off. */
async function still(browser, name, path, { width = 1440, height = 900, scale = 1, scroll } = {}) {
  if (!wanted(name)) return;
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  if (scroll) await page.evaluate((y) => window.scrollTo(0, y), scroll);
  // A screenshot below the fold is lazy: until it decodes, its frame shows a
  // blurred 20px preview, which is not what a visitor sees for long.
  // Hidden ones never load, so only those with a box on screen count.
  await page.waitForFunction(() =>
    [...document.images]
      .filter((img) => {
        const r = img.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top < window.innerHeight && getComputedStyle(img).visibility !== "hidden";
      })
      .every((img) => img.complete && img.naturalWidth > 0),
  );
  await pause(400);
  await page.screenshot({ path: join(docs, `${name}.jpg`), type: "jpeg", quality: 86 });
  console.log(`${name}.jpg`);
  await ctx.close();
}

mkdirSync(tmp, { recursive: true });
const browser = await chromium.launch();

// ---- Stills, the gallery under the banner.
await still(browser, "home", "/");
await still(browser, "work", "/work");
await still(browser, "research", "/research");
await still(browser, "about", "/about");
await still(browser, "contact", "/contact");
await still(browser, "not-found", "/no/such/page");
await still(browser, "home-mobile", "/", { width: 390, height: 844, scale: 2 });

// ---- Clips, the motion table.

// Home on a first visit: the tabs drop, the tape goes down behind the name
// while it is read into place, the proof row prints, the exhibit uncovers.
await clip(browser, "home-first-load", {
  act: async (page) => {
    await page.goto(BASE + "/", { waitUntil: "commit" });
    await pause(2600);
  },
});

// Paging with the arrow keys: each page slides over the last as a sheet, the
// tab fill travels, and on each first visit the heading is read and the
// cd line typed. Back with the left arrow.
await clip(browser, "arrow-paging", {
  setup: async (page) => {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await pause(2200);
  },
  act: async (page) => {
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press("ArrowRight");
      await pause(1500);
    }
    await page.keyboard.press("ArrowLeft");
    await pause(1100);
  },
});

// A row on /work: pointing puts its screenshot in the frame, and clicking it
// grows that screenshot into the case study's exhibit. Then back.
await clip(browser, "work-to-case-study", {
  cursor: true,
  setup: async (page) => {
    await page.goto(BASE + "/work", { waitUntil: "networkidle" });
    await pause(1800);
    await page.mouse.move(W - 60, 300);
  },
  act: async (page) => {
    const row = (title) => page.locator("[data-row]").filter({ hasText: title }).first();
    for (const title of ["RIPHours", "PIERRA", "Greenlight"]) {
      await pointAt(page, row(title).getByText(title, { exact: true }), 14);
      await pause(650);
    }
    await row("Greenlight").getByText("Greenlight", { exact: true }).click();
    await pause(1800);
    await page.goBack();
    await pause(1300);
  },
});

// The filter: rows that leave are cut, the rest slide to their places.
await clip(browser, "work-filter", {
  cursor: true,
  setup: async (page) => {
    await page.goto(BASE + "/work", { waitUntil: "networkidle" });
    await pause(1800);
    await page.mouse.move(W / 2, 500);
  },
  act: async (page) => {
    // The chips are links (?kind=), marked by data-chip with the kind's key.
    const keys = await page.locator("[data-chip]").evaluateAll((els) => els.map((e) => e.dataset.chip));
    const picks = [keys.find((k) => /chrome/.test(k)), keys.find((k) => /ai|ml/.test(k)), "all"].filter(Boolean);
    for (const key of picks) {
      const chip = page.locator(`[data-chip="${key}"]`).first();
      await pointAt(page, chip, 16);
      await chip.click();
      await pause(1100);
    }
  },
});

// Research on a first visit: the scan bar passes down the list, sharp above
// and soft below, and the PEER REVIEWED stamp lands on the IEEE paper.
await clip(browser, "research-scan", {
  act: async (page) => {
    await page.goto(BASE + "/research", { waitUntil: "commit" });
    await pause(2400);
  },
});

// About on a first visit: the heading is read in, then the grades chart, on
// the first screen at this size, draws its line term by term and stamps
// each point.
await clip(browser, "about-chart", {
  act: async (page) => {
    await page.goto(BASE + "/about", { waitUntil: "commit" });
    await pause(2800);
  },
});

await browser.close();
rmSync(tmp, { recursive: true, force: true });
