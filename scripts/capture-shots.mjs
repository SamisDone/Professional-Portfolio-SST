/**
 * Re-captures the project screenshots in public/shots.
 *
 * Project imagery on this site is a real capture of the running product, never
 * a mockup, so when one of these sites changes the portfolio should be
 * re-shot rather than left showing a stale design.
 *
 *   node scripts/capture-shots.mjs
 *
 * Projects with no live deployment are deliberately absent. They get no image
 * rather than an invented one.
 */
import { chromium } from "playwright";

const TARGETS = [
  { id: "medihub", url: "https://ai-powered-hospital-management-syst.vercel.app/" },
  { id: "narrativeguard", url: "https://narrative-guard.vercel.app/" },
  { id: "kilnwatch", url: "https://sciblitz-ptsd-ibkd.vercel.app" },
  { id: "huntrix", url: "https://huntrix-friction.vercel.app/" },
  { id: "pierra", url: "https://pierrafinal.vercel.app/" },
  { id: "resumeforge", url: "https://resumeforge-sam.netlify.app/" },
  { id: "sortnplay", url: "https://sortnplay.netlify.app/" },
];

const browser = await chromium.launch();

for (const target of TARGETS) {
  const page = await browser.newPage({
    viewport: { width: 1400, height: 875 },
    // Retina capture, then JPEG at 80 keeps each file near 150 KB.
    deviceScaleFactor: 1.6,
  });
  try {
    await page.goto(target.url, { waitUntil: "networkidle", timeout: 45000 });
    // Give entry animations on the target site time to settle.
    await page.waitForTimeout(3500);
    await page.screenshot({
      path: `public/shots/${target.id}.jpg`,
      type: "jpeg",
      quality: 80,
    });
    console.log("captured", target.id);
  } catch (error) {
    console.error("failed", target.id, error.message.split("\n")[0]);
  }
  await page.close();
}

await browser.close();

// riphours.png is the extension's own promo image from its Chrome Web Store
// listing. The store page itself is mostly Google's UI, so it is not worth
// capturing; replace that file by hand if the listing artwork changes.
