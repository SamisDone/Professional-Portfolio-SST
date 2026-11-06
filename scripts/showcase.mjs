/**
 * Records the portfolio showcase video.
 *
 *   npm run preview                 # in one terminal, serves the built site
 *   node scripts/showcase.mjs       # in another
 *
 * Output lands in `showcase/`: an MP4 at 1920x1080, an SRT of the captions,
 * and the raw WebM Playwright produced. None of it is committed.
 *
 * The captions are burned into the frame as well as written to the SRT, so the
 * video reads correctly on a platform that ignores subtitle tracks, which is
 * most of the places a recruiter would open it.
 *
 * Two things are drawn on top of the page and are not part of the site: the
 * caption bar and a cursor dot. Playwright moves a real mouse but renders no
 * pointer, so without the dot every click looks like the page acting on its
 * own. The overlay is appended to `document.body` rather than to `#root`, and
 * navigation happens by clicking the real nav links, so React never unmounts
 * it mid-take.
 *
 * Timing is fixed rather than emergent. Each beat declares how long it holds;
 * `beat()` runs its actions and then waits out whatever is left, so the cut
 * does not drift when a page loads a little faster or slower than last time.
 */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, readdirSync, writeFileSync, renameSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "showcase");
const BASE = process.env.SHOWCASE_BASE || "http://localhost:4173";

// 16:9 at a width that clears the 1240px shell with room to breathe. The MP4
// is upscaled to 1920x1080 afterwards; recording at 1080 makes the type render
// small relative to the frame, because the layout is capped either way.
const W = 1440;
const H = 810;

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

/* ---------------------------------------------------------------- overlay -- */

const OVERLAY = `
(() => {
  const css = document.createElement("style");
  css.textContent = \`
    #sc-layer { position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;
                font-family: "Instrument Sans", system-ui, sans-serif; }
    /* Kept shallow on purpose. The case study dialog is 889px tall in an 810px
       frame, so every pixel the scrim takes is a pixel of it a viewer loses. */
    #sc-scrim { position: absolute; left: 0; right: 0; bottom: 0; height: 132px;
                background: linear-gradient(to top, rgba(10,4,14,0.94) 0%,
                            rgba(10,4,14,0.74) 46%, rgba(10,4,14,0) 100%);
                opacity: 0; transition: opacity .45s ease; }
    #sc-cap  { position: absolute; left: 50%; bottom: 34px; transform: translateX(-50%);
               width: min(1080px, 82vw); text-align: center; color: #fff;
               font-size: 25px; line-height: 1.32; letter-spacing: -0.005em;
               opacity: 0; transition: opacity .38s ease, transform .38s ease;
               text-shadow: 0 2px 18px rgba(0,0,0,.7); }
    #sc-cap.in { opacity: 1; }
    #sc-rule { position: absolute; left: 50%; bottom: 17px; transform: translateX(-50%);
               width: 40px; height: 2px; background: #ff2d87; opacity: 0;
               transition: opacity .38s ease; }
    #sc-bar  { position: absolute; left: 0; bottom: 0; height: 3px; width: 0%;
               background: #ff2d87; opacity: .9; }
    #sc-cur  { position: absolute; width: 20px; height: 20px; margin: -10px 0 0 -10px;
               border-radius: 50%; background: rgba(255,255,255,.92);
               box-shadow: 0 0 0 2px rgba(0,0,0,.35), 0 4px 14px rgba(0,0,0,.5);
               opacity: 0; transition: opacity .3s ease, width .12s ease, height .12s ease;
               left: -100px; top: -100px; }
    #sc-cur.down { width: 13px; height: 13px; margin: -6.5px 0 0 -6.5px; }
    #sc-card { position: absolute; inset: 0; background: #14061c;
               display: flex; flex-direction: column; align-items: center;
               justify-content: center; gap: 18px; opacity: 0;
               transition: opacity .6s ease; }
    #sc-card .t { font-family: "Instrument Serif", Georgia, serif; font-size: 84px;
                  color: #fdf7ff; line-height: 1; letter-spacing: -0.02em; }
    #sc-card .s { font-family: "DM Mono", ui-monospace, monospace; font-size: 17px;
                  color: #e9a2ff; letter-spacing: .16em; text-transform: uppercase; }
    #sc-card .u { font-family: "DM Mono", ui-monospace, monospace; font-size: 22px;
                  color: #fff; margin-top: 10px; }
  \`;
  document.head.appendChild(css);

  const l = document.createElement("div");
  l.id = "sc-layer";
  l.innerHTML =
    '<div id="sc-scrim"></div><div id="sc-cap"></div><div id="sc-rule"></div>' +
    '<div id="sc-bar"></div><div id="sc-cur"></div>' +
    '<div id="sc-card"><div class="s"></div><div class="t"></div><div class="u"></div></div>';
  document.body.appendChild(l);

  const $ = (id) => document.getElementById(id);

  window.__sc = {
    say(text) {
      const cap = $("sc-cap");
      cap.classList.remove("in");
      $("sc-rule").style.opacity = "0";
      setTimeout(() => {
        cap.textContent = text;
        if (!text) { $("sc-scrim").style.opacity = "0"; return; }
        $("sc-scrim").style.opacity = "1";
        cap.classList.add("in");
        $("sc-rule").style.opacity = ".95";
      }, 380);
    },
    progress(p) { $("sc-bar").style.width = (p * 100).toFixed(2) + "%"; },
    cursor(x, y, show) {
      const c = $("sc-cur");
      c.style.left = x + "px";
      c.style.top = y + "px";
      c.style.opacity = show === false ? "0" : "1";
    },
    press(down) { $("sc-cur").classList.toggle("down", !!down); },
    card(sub, title, url) {
      const c = $("sc-card");
      c.querySelector(".s").textContent = sub || "";
      c.querySelector(".t").textContent = title || "";
      c.querySelector(".u").textContent = url || "";
      c.style.opacity = "1";
    },
    uncard() { $("sc-card").style.opacity = "0"; },
    scrollTo(target, ms) {
      return this._ease(
        () => window.scrollY,
        (v) => window.scrollTo(0, v),
        target,
        ms,
      );
    },
    /**
     * The case study opens in its own scroll container, not the document, and
     * it opens scrolled to the bottom because the panel takes focus. Reading
     * it on camera means driving that element rather than the window.
     */
    dialogTo(frac, ms) {
      const el = document.querySelector("div.fixed.inset-0.overflow-y-auto");
      if (!el) return Promise.resolve();
      const max = el.scrollHeight - el.clientHeight;
      return this._ease(
        () => el.scrollTop,
        (v) => { el.scrollTop = v; },
        Math.max(0, max) * frac,
        ms,
      );
    },
    _ease(get, set, target, ms) {
      return new Promise((done) => {
        const start = get();
        const delta = target - start;
        if (Math.abs(delta) < 2 || ms <= 0) { set(target); return done(); }
        const t0 = performance.now();
        const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        const step = (now) => {
          const t = Math.min(1, (now - t0) / ms);
          set(start + delta * ease(t));
          t < 1 ? requestAnimationFrame(step) : done();
        };
        requestAnimationFrame(step);
      });
    },
  };
})();
`;

/* ------------------------------------------------------------------ beats -- */

/**
 * The script. `hold` is the beat's total screen time in milliseconds,
 * including whatever `run` does, so these sum to the finished runtime.
 */
const BEATS = [
  {
    hold: 7000,
    caption: null,
    async run(c) {
      await c.page.evaluate(() =>
        window.__sc.card("Full stack engineering and explainable AI", "Samonwita Sarker", ""),
      );
      await c.wait(4200);
      await c.page.evaluate(() => window.__sc.uncard());
    },
  },
  {
    hold: 7000,
    caption: "The first screen is five products that are live right now, not mockups.",
    async run(c) {
      await c.glide(1080, 330);
    },
  },
  {
    hold: 7000,
    caption: "Under it, four figures. Every one is a link to the thing that proves it.",
    async run(c) {
      await c.scroll(560, 1400);
      await c.glide(700, 470);
    },
  },
  {
    hold: 8000,
    caption: "The work page opens on eight builds, each with a screenshot of the real thing.",
    async run(c) {
      await c.scroll(0, 700);
      await c.nav("Work");
      await c.wait(900);
      await c.scroll(260, 1500);
    },
  },
  {
    hold: 13000,
    caption: "Open any card for the problem it solved, what was built, and how it turned out.",
    async run(c) {
      await c.clickAt('button[aria-label="Open the Sixpence case study"]');
      await c.dialog(0, 0);
      await c.wait(4600);
      await c.dialog(1, 2400);
      await c.wait(4200);
      await c.page.keyboard.press("Escape");
    },
  },
  {
    hold: 10000,
    caption: "On team projects it names my share, taken from the commit history.",
    async run(c) {
      await c.wait(600);
      await c.scroll(760, 900);
      await c.clickAt('button[aria-label="Open the DimSum case study"]');
      await c.dialog(0, 0);
      await c.wait(2600);
      await c.dialog(1, 2200);
      await c.wait(2400);
      await c.page.keyboard.press("Escape");
    },
  },
  {
    hold: 6000,
    caption: "Eighteen more sit below it, down to the coursework and the browser games.",
    async run(c) {
      await c.wait(500);
      await c.scroll(1560, 4000);
    },
  },
  {
    // Straight after the rows, because the only link to /repositories in the
    // whole site sits at the top of them. Reaching it from anywhere else means
    // a page load, and a page load takes the caption overlay with it.
    hold: 9000,
    caption: "Every repository in one table, with the owner named on each.",
    async run(c) {
      await c.goLink('a[href="/repositories"]');
      await c.wait(1100);
      await c.scroll(520, 2600);
    },
  },
  {
    hold: 8000,
    caption: "Experience, with what each role actually involved.",
    async run(c) {
      await c.nav("Experience");
      await c.wait(1000);
      await c.scroll(300, 1900);
    },
  },
  {
    hold: 9000,
    caption: "Two published papers, and a thesis in progress on reading Bangla off photographs.",
    async run(c) {
      await c.nav("Research");
      await c.wait(1000);
      await c.scroll(380, 2300);
    },
  },
  {
    hold: 10000,
    caption: "The grades are plotted in full, including the term that went badly.",
    async run(c) {
      await c.nav("About");
      await c.wait(1000);
      await c.scroll(620, 2600);
    },
  },
  {
    hold: 8000,
    caption: "Leadership, certifications and competition placings.",
    async run(c) {
      await c.nav("Activities");
      await c.wait(1000);
      await c.scroll(340, 1900);
    },
  },
  {
    hold: 7000,
    caption: "A contact form that reaches my inbox directly.",
    async run(c) {
      await c.nav("Get in touch");
      await c.wait(1000);
      await c.scroll(240, 1500);
    },
  },
  {
    hold: 8000,
    caption: "Arrow keys walk the whole site in reading order.",
    async run(c) {
      // The handler in `Pager` ignores arrow keys raised from an input, which
      // is exactly where focus lands after the contact form scrolls into view.
      await c.page.evaluate(() => document.activeElement?.blur());
      for (const _ of [0, 1, 2]) {
        await c.page.keyboard.press("ArrowLeft");
        await c.wait(1500);
      }
    },
  },
  {
    hold: 7000,
    caption: null,
    async run(c) {
      await c.page.evaluate(() => window.__sc.say(""));
      await c.wait(500);
      await c.page.evaluate(() =>
        window.__sc.card("Open to job opportunities", "Samonwita Sarker", "samonwita.vercel.app"),
      );
    },
  },
];

const TOTAL = BEATS.reduce((n, b) => n + b.hold, 0);
console.log(`script: ${BEATS.length} beats, ${(TOTAL / 1000).toFixed(1)}s`);

/* ----------------------------------------------------------------- record -- */

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: W, height: H },
  recordVideo: { dir: outDir, size: { width: W, height: H } },
  reducedMotion: "no-preference",
  deviceScaleFactor: 1,
});
const page = await context.newPage();

const recordStart = Date.now();
await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
await page.evaluate(OVERLAY);
await page.waitForTimeout(1200);

const wait = (ms) => page.waitForTimeout(ms);

/** Cursor and real mouse together, eased, so a click reads as a click. */
let cx = W / 2;
let cy = H / 2;
async function glide(x, y, ms = 620) {
  const steps = Math.max(8, Math.round(ms / 16));
  const [sx, sy] = [cx, cy];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const px = sx + (x - sx) * e;
    const py = sy + (y - sy) * e;
    await page.mouse.move(px, py);
    await page.evaluate(([a, b]) => window.__sc.cursor(a, b, true), [px, py]);
    await page.waitForTimeout(ms / steps);
  }
  cx = x;
  cy = y;
}

async function clickAt(selector) {
  const el = page.locator(selector).first();
  const box = await el.boundingBox();
  if (!box) throw new Error("no box for " + selector);
  await glide(box.x + box.width / 2, box.y + Math.min(box.height / 2, 120));
  await page.evaluate(() => window.__sc.press(true));
  await wait(140);
  await el.click({ force: true });
  await page.evaluate(() => window.__sc.press(false));
}

const scroll = (y, ms) => page.evaluate(([a, b]) => window.__sc.scrollTo(a, b), [y, ms]);
const dialog = (frac, ms) => page.evaluate(([a, b]) => window.__sc.dialogTo(a, b), [frac, ms]);
const nav = (label) => clickAt(`header a:has-text("${label}")`);
const goLink = (sel) => clickAt(sel);

const ctx = { page, wait, glide, clickAt, scroll, dialog, nav, goLink };

const cues = [];
let elapsed = 0;
const beatsStart = Date.now() - recordStart;

for (const [i, b] of BEATS.entries()) {
  const t0 = Date.now();
  if (b.caption) {
    cues.push({ from: elapsed, to: elapsed + b.hold, text: b.caption });
    await page.evaluate((t) => window.__sc.say(t), b.caption);
  }
  await page.evaluate((p) => window.__sc.progress(p), (elapsed + b.hold) / TOTAL);
  try {
    await b.run(ctx);
  } catch (err) {
    console.error(`beat ${i + 1} failed: ${err.message.split("\n")[0]}`);
  }
  const left = b.hold - (Date.now() - t0);
  if (left > 0) await wait(left);
  elapsed += b.hold;
  console.log(
    `  ${String(i + 1).padStart(2)}  ${(elapsed / 1000).toFixed(1)}s  ` +
      `${b.caption ? b.caption.slice(0, 52) : "(card)"}`,
  );
}

await context.close();
await browser.close();

/* --------------------------------------------------------------- assemble -- */

const raw = readdirSync(outDir).find((f) => f.endsWith(".webm"));
if (!raw) throw new Error("playwright wrote no video");
renameSync(join(outDir, raw), join(outDir, "showcase-raw.webm"));

const ts = (ms) => {
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, "0");
  const s = String(Math.floor(ms / 1000) % 60).padStart(2, "0");
  return `${h}:${m}:${s},${String(Math.floor(ms % 1000)).padStart(3, "0")}`;
};
writeFileSync(
  join(outDir, "showcase.srt"),
  cues
    .map((c, i) => `${i + 1}\n${ts(c.from)} --> ${ts(c.to)}\n${c.text}\n`)
    .join("\n"),
  "utf8",
);

// Trim the lead-in: the recording starts before the page has painted, and the
// first frame a viewer should see is the title card.
const skip = (beatsStart / 1000).toFixed(3);
execFileSync(
  "ffmpeg",
  [
    "-y", "-ss", skip,
    "-i", join(outDir, "showcase-raw.webm"),
    "-t", String(TOTAL / 1000),
    "-vf", "scale=1920:1080:flags=lanczos",
    "-r", "25", "-fps_mode", "cfr",
    "-c:v", "libx264", "-preset", "slow", "-crf", "20",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    "-an",
    join(outDir, "showcase.mp4"),
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);

const dur = execFileSync("ffprobe", [
  "-v", "error", "-show_entries", "format=duration",
  "-of", "default=noprint_wrappers=1:nokey=1",
  join(outDir, "showcase.mp4"),
])
  .toString()
  .trim();

const secs = Number(dur);
console.log(
  `\nshowcase.mp4  1920x1080  ${Math.floor(secs / 60)}:${String(Math.round(secs % 60)).padStart(2, "0")}` +
    `  (${secs.toFixed(2)}s)\nshowcase.srt  ${cues.length} cues`,
);
