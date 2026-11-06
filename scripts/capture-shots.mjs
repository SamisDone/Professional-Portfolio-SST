/**
 * Re-captures the project screenshots in public/shots, and records the date
 * and URL of each capture in src/data/shots.json.
 *
 * Project imagery on this site is a real capture of the running product,
 * never a mockup. Every exhibit carries a caption bar reading the name, the
 * domain and the capture date out of shots.json, so a stale image says how
 * stale it is instead of going stale silently.
 *
 *   node scripts/capture-shots.mjs              # all of them
 *   node scripts/capture-shots.mjs sixpence     # just this one
 *   node scripts/optimise-shots.mjs sixpence    # then the WebP sizes
 *
 * Name the ids you want when only one site has changed. The free hosts some
 * of these sit on are slow to wake.
 *
 * Projects with no live deployment are absent: they get no image rather than
 * an invented one. A few shots come from the project's own README instead of
 * a capture, where that image shows the product better than its landing page
 * does (RIPHours, Sixpence); shots.json marks those `"kind": "readme"`, and
 * re-capturing one here replaces it with a capture.
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const TARGETS = [
  { id: "medihub", url: "https://ai-powered-hospital-management-syst.vercel.app/" },
  { id: "narrativeguard", url: "https://narrative-guard.vercel.app/" },
  { id: "kilnwatch", url: "https://sciblitz-ptsd-ibkd.vercel.app" },
  { id: "huntrix", url: "https://huntrix-friction.vercel.app/" },
  { id: "pierra", url: "https://pierrafinal.vercel.app/" },
  { id: "resumeforge", url: "https://resumeforge-sam.netlify.app/" },
  { id: "greenlight", url: "https://greenlight-ptsd.vercel.app/" },
  { id: "sortnplay", url: "https://sortnplay.netlify.app/" },
  { id: "pixelart", url: "https://pixelartweb.netlify.app/" },
  { id: "hangman", url: "https://hangman-sam.netlify.app/" },
  { id: "glitch", url: "https://glitch-breach-sam.netlify.app/" },
  // Render free tier: the first request can take ~30-60s to wake the service.
  { id: "sixpence", url: "https://sixpence.onrender.com/", wake: true },
  { id: "dimsum", url: "https://dimsum-y32f.onrender.com/", wake: true },
  { id: "kakertheng", url: "https://kaker-theng-api.onrender.com/", wake: true },
];

const LOG = "src/data/shots.json";
const only = new Set(process.argv.slice(2));
const targets = only.size ? TARGETS.filter((t) => only.has(t.id)) : TARGETS;
const unknown = [...only].filter((id) => !TARGETS.some((t) => t.id === id));
if (unknown.length) throw new Error(`no such target: ${unknown.join(", ")}`);

const log = JSON.parse(readFileSync(LOG, "utf8"));
const today = new Date().toISOString().slice(0, 10);
const browser = await chromium.launch();

for (const target of targets) {
  const page = await browser.newPage({
    viewport: { width: 1400, height: 875 },
    // Retina capture, then JPEG at 80 keeps each file near 150 KB.
    deviceScaleFactor: 1.6,
  });
  try {
    await page.goto(target.url, { waitUntil: "networkidle", timeout: target.wake ? 120000 : 45000 });
    // Render serves its own "service waking up" page while a free instance
    // starts, with a 200. A capture taken then is a picture of Render, so
    // wait it out, for up to three minutes.
    for (let i = 0; target.wake && i < 36; i++) {
      const waking = await page.evaluate(() =>
        /SERVICE WAKING UP|APPLICATION LOADING/i.test(document.body?.innerText ?? ""),
      );
      if (!waking) break;
      await page.waitForTimeout(5000);
      await page.goto(target.url, { waitUntil: "networkidle", timeout: 120000 });
    }
    // Give entry animations on the target site time to settle.
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `public/shots/${target.id}.jpg`, type: "jpeg", quality: 80 });
    log[target.id] = { captured: today, url: target.url };
    console.log("captured", target.id);
  } catch (error) {
    console.error("failed", target.id, error.message.split("\n")[0]);
  }
  await page.close();
}

await browser.close();
writeFileSync(LOG, JSON.stringify(log, null, 2) + "\n");

// tabsaver.jpg and riphours.png are not captured here: an extension's popup
// is not a page a headless browser can open at a URL. Replace them by hand.
