/*
 * Measures every page against the page-length rule. Measuring only: it
 * changes nothing, and for now it reports rather than fails.
 *
 *   npm run build && node scripts/measure-pages.mjs [--out dir]
 *
 * It serves dist/ with server.mjs on a spare port, loads each route at
 * 1280x720, 1280x800, 1440x900 and 390x844, with JavaScript on and again with
 * reduced motion, and records:
 *
 *   height    document height without the header and footer, in px and in
 *             screens of that viewport
 *   rule 1    whether each first-screen item is fully inside the first screen:
 *             the H1, the page's strongest proof, its next action, and on
 *             Home the name, role line, whole proof row and "See the work".
 *             404 and /privacy are exempt from the proof item; /privacy must
 *             still show a contact line. On Contact the next action is the
 *             form's first field, and the email address must show as well.
 *   rule 2    the pages in ROUTES and the 404 at most 1600px at 1280x800
 *             (two screens) and at most 2532px at 390x844 (three screens).
 *             /repositories is exempt, an index whose length is the point;
 *             so are /privacy and the case studies, which have an index.
 *   rule 3    case studies: H1, role and the Live and Code links on screen
 *   rule 4    on a page that scrolls, the top of the next section (its heading
 *             or its opening rule) inside the first screen, 48px or more above
 *             its bottom edge. On Home the same holds for Flagship 01: from
 *             1024px wide, the top of its screenshot; on a phone, its 4px
 *             opening rule and its kind and year label (by their top edges).
 *
 *   sideways  no page may scroll sideways at any width from 320 to 1920
 *             (320, 360, 390, 768, 1024, 1280, 1440, 1920). This one fails
 *             the script: a page that scrolls sideways is broken.
 *
 * Full-page screenshots at 1280x800 and 390x844 go to the output directory.
 * Each page is scrolled to the bottom and back first, so every entrance has
 * played; a capture straight after load shows them in their starting state.
 */
import { spawn } from "node:child_process";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outArg = process.argv.indexOf("--out");
const OUT = resolve(outArg > -1 ? process.argv[outArg + 1] : join(root, ".measure"));
mkdirSync(join(OUT, "screens"), { recursive: true });

const PORT = 4321 + Math.floor(Math.random() * 500);
const BASE = `http://localhost:${PORT}`;
const VIEWPORTS = [
  [1280, 720],
  [1280, 800],
  [1440, 900],
  [390, 844],
];
/** Rule 2's limits, by viewport: two screens on a desktop, three on a phone. */
const MAX_LENGTH = { "1280x800": 1600, "390x844": 2532 };
const MARGIN = 48;

/*
 * What each page must show on its first screen, as CSS selectors: `proof` is
 * its strongest piece of proof, `action` its next action, and `next` the top
 * of the section after the page's opening (rule 4). Named per page rather
 * than guessed from the markup, so the choice is visible and can be argued
 * with. Where a page has no element that fits, the entry is null, which is
 * reported as a failure of the page rather than skipped.
 */
const FIRST_SCREEN = {
  "/": {
    proof: 'section[aria-label="Proof"] ul',
    action: 'a.btn-primary[href="/work"]',
    next: 'section[aria-label="Proof"]',
    extra: { name: "#hero-name", "role line": "main section > div p.t-lead" },
    cue: { "Flagship 01 screenshot": "[data-flag-frame] figure" },
    phoneCue: { "Flagship 01 rule": "[data-flagships]", "Flagship 01 label": "[data-flag-row] .t-label" },
  },
  "/work": { proof: "main ol > li:first-child", action: "main ol > li:first-child h2 a", next: 'section[aria-label="Project index"]' },
  "/experience": { proof: "main ol > li:first-child h2", action: "main a.btn-primary", next: "main ol > li:first-child" },
  "/research": { proof: "main .proof-mark", action: "main .proof-mark", next: "main section[aria-label]" },
  "/about": { proof: 'section[aria-labelledby="education"] li:first-child', action: "main a.btn-primary", next: "#education" },
  "/activities": { proof: 'section[aria-labelledby="leadership"] li:first-child', action: "main a.btn-primary", next: "#leadership" },
  "/contact": {
    proof: 'main a[href^="mailto:"]',
    action: "#c-name",
    next: 'section[aria-label="Contact form"]',
    extra: { "email address": 'main a[href^="mailto:"]' },
  },
  "/repositories": { proof: "main tbody tr:first-child", action: "main tbody tr:first-child a", next: "main section:nth-of-type(2)" },
  // Exempt from the proof item. The contact line is its next action.
  "/privacy": { proof: false, action: 'main a[href^="mailto:"]', next: "main dl" },
  "/404": { proof: false, action: "main a.btn-primary", next: null },
};
const CASE = {
  proof: "main header dl",
  // The live link is a proof mark and Code a text link (the proof rule);
  // a project with no deployment has Code as its next action.
  action: "main header .proof-mark, main header a.link",
  next: "main article > div.tier-b, main article > dl",
  extra: { role: "main header dl > div:first-child", "Code link": 'main header a.link[href*="github.com"]' },
};

const cases = readdirSync(join(root, "dist/work"))
  .filter((f) => f.endsWith(".html"))
  .map((f) => `/work/${f.slice(0, -5)}`);
const TOP = ["/", "/work", "/experience", "/research", "/about", "/activities", "/contact", "/repositories", "/404"];
const ROUTES = [...TOP, "/privacy", ...cases];
// Rule 2 applies to these. /repositories, /privacy and the case studies are
// left out.
const LENGTH_RULE = new Set(["/", "/work", "/experience", "/research", "/about", "/activities", "/contact", "/404"]);

const server = spawn(process.execPath, [join(root, "server.mjs")], { env: { ...process.env, PORT: String(PORT) }, stdio: "pipe" });
await new Promise((ok, fail) => {
  server.stdout.on("data", (d) => String(d).includes("listening") && ok());
  server.on("exit", (code) => fail(new Error(`server.mjs exited with ${code}`)));
});

const browser = await chromium.launch();
const rows = [];
const sideways = [];

try {
  for (const reduced of [false, true]) {
    for (const [w, h] of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? "reduce" : "no-preference" });
      const page = await ctx.newPage();
      for (const route of ROUTES) {
        const url = route === "/404" ? `${BASE}/this-page-does-not-exist` : BASE + route;
        await page.goto(url, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        const spec = route.startsWith("/work/") ? CASE : FIRST_SCREEN[route];
        const m = await page.evaluate(
          ({ spec, margin }) => {
            const vh = innerHeight;
            const header = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
            const footer = document.querySelector("footer")?.getBoundingClientRect().height ?? 0;
            const length = Math.round(document.documentElement.scrollHeight - header - footer);
            const visible = (sel) => {
              if (sel === false) return { ok: true, why: "exempt" };
              if (!sel) return { ok: false, why: "page has none" };
              const el = document.querySelector(sel);
              if (!el) return { ok: false, why: "not found" };
              const r = el.getBoundingClientRect();
              const ok = r.height > 0 && r.top >= 0 && r.bottom <= vh;
              return { ok, why: ok ? "" : `bottom at ${Math.round(r.bottom)}px of ${vh}` };
            };
            const items = { H1: visible("main h1"), proof: visible(spec.proof), action: visible(spec.action) };
            for (const [k, sel] of Object.entries(spec.extra ?? {})) items[k] = visible(sel);
            // A cue only needs its top edge in view, with the rule 4 margin.
            const cues = innerWidth < 1024 && spec.phoneCue ? spec.phoneCue : spec.cue;
            for (const [k, sel] of Object.entries(cues ?? {})) {
              // The first matching element that is displayed.
              const el = [...document.querySelectorAll(sel)].find((e) => e.getBoundingClientRect().height > 0);
              const top = el?.getBoundingClientRect().top;
              const ok = top !== undefined && top <= vh - margin;
              items[k] = { ok, why: top === undefined ? "not found" : `top at ${Math.round(top)}px of ${vh}`, top: Math.round(top ?? -1) };
            }

            const scrolls = document.documentElement.scrollHeight > vh + 1;
            const next = spec.next ? document.querySelector(spec.next)?.getBoundingClientRect().top : undefined;
            const gap = next === undefined ? null : Math.round(vh - next);
            return { length, items, scrolls, gap, rule4: !scrolls || (gap !== null && gap >= margin) };
          },
          { spec, margin: MARGIN },
        );
        const rule1 = Object.values(m.items).every((i) => i.ok);
        const max = MAX_LENGTH[`${w}x${h}`];
        const rule2 = !(max && LENGTH_RULE.has(route)) || m.length <= max;
        rows.push({ route, vp: `${w}x${h}`, reduced, ...m, rule1, rule2 });

        if (!reduced && ((w === 1280 && h === 800) || w === 390)) {
          const name = route === "/" ? "home" : route.slice(1).replaceAll("/", "_");
          await page.evaluate(async () => {
            for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) {
              scrollTo(0, y);
              await new Promise((r) => setTimeout(r, 120));
            }
            await new Promise((r) => setTimeout(r, 1800));
            scrollTo(0, 0);
          });
          await page.screenshot({ path: join(OUT, "screens", `${w}x${h}__${name}.png`), fullPage: true });
        }
      }
      await ctx.close();
    }
  }

  // Sideways scrolling, at every width a visitor might have.
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  for (const w of [320, 360, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width: w, height: 900 });
    for (const route of ROUTES) {
      await page.goto(route === "/404" ? `${BASE}/this-page-does-not-exist` : BASE + route, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 0) sideways.push(`${route} at ${w}px: ${over}px wider than the screen`);
    }
  }
  await ctx.close();
} finally {
  await browser.close();
  server.kill();
}

writeFileSync(join(OUT, "measure.json"), JSON.stringify(rows, null, 2));

// The table: one line per route and viewport, JavaScript on. Reduced motion
// is reported only where it differs.
const fmt = (r) => {
  const fails = Object.entries(r.items).filter(([, i]) => !i.ok).map(([k, i]) => `${k} (${i.why})`);
  return [
    r.route.padEnd(24),
    r.vp.padEnd(9),
    `${String(r.length).padStart(5)}px`,
    `${(r.length / Number(r.vp.split("x")[1])).toFixed(1).padStart(4)} scr`,
    r.rule1 ? "R1 ok  " : "R1 FAIL",
    r.rule2 ? "R2 ok  " : "R2 FAIL",
    r.rule4 ? "R4 ok  " : "R4 FAIL",
    r.scrolls ? `next ${r.gap === null ? "none" : `${r.gap}px`}` : "fits",
    fails.length ? `missing: ${fails.join("; ")}` : "",
  ].join("  ");
};
const on = rows.filter((r) => !r.reduced);
console.log(on.map(fmt).join("\n"));
const diffs = rows.filter((r) => r.reduced).filter((r) => {
  const twin = on.find((o) => o.route === r.route && o.vp === r.vp);
  return twin && (twin.length !== r.length || twin.rule1 !== r.rule1 || twin.rule4 !== r.rule4);
});
console.log(diffs.length ? `\nreduced motion differs:\n${diffs.map(fmt).join("\n")}` : "\nreduced motion: identical results");
console.log(sideways.length ? `\nSIDEWAYS FAIL:\n  ${sideways.join("\n  ")}` : "\nsideways: no page scrolls sideways from 320 to 1920");
console.log(`\nscreenshots and measure.json in ${OUT}`);
if (sideways.length) process.exitCode = 1;
