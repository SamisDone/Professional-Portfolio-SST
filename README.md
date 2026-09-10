# Samonwita Sarker — Portfolio

Personal site for a CSE undergraduate at CUET. Full-stack work, published Chrome
extensions, and research in explainable AI and NLP.

**Live:** https://samonwita.vercel.app

## Stack

React 19 and TypeScript on Vite, styled with Tailwind. Motion is split between
GSAP for scroll-driven work (the pinned project marquee) and Framer Motion for
component-level transitions. The hero and contact backgrounds stream a single
Mux HLS asset, with `hls.js` code-split so it is only fetched by browsers that
cannot play HLS natively.

## Running it

```bash
npm install
npm run dev      # dev server on :5173
npm run build    # typecheck, then production build to dist/
npm run preview  # serve the production build
npm run lint     # oxlint
```

## Layout

```
src/
  components/   Section components, one per page section
  data/         content.ts — all copy, projects and case studies live here
  hooks/        useReducedMotion
  lib/          intro.ts — session flag for the loading screen
  pages/        Index, NotFound
public/         Résumé PDF, favicon, og.png, robots.txt, sitemap.xml
```

All page copy is in `src/data/content.ts`. Adding a project means adding one
object there and one SVG motif in `components/ProjectVisual.tsx`; nothing else
needs to change.

## Notes for future edits

**Absolute URLs.** The canonical link, the Open Graph tags and `sitemap.xml`
hard-code the deployed origin. Open Graph crawlers do not resolve relative
paths, so these must be updated together if the domain changes. They live in
`index.html`, `public/sitemap.xml` and `public/robots.txt`.

**Positioning `ProjectVisual`.** Pass the `fill` prop rather than an
`absolute inset-0` class. Tailwind emits `.relative` after `.absolute`, so a
wrapper carrying both resolves to `relative` and the artwork collapses to a
zero-height box.

**Motion.** Every decorative animation checks `useReducedMotion`. The project
marquee falls back to a static grid, and the intro is skipped entirely.

## Deployment

Configured for Vercel via `vercel.json`, which adds the SPA rewrite, immutable
caching for hashed assets, and basic security headers. `public/_redirects`
covers the equivalent SPA fallback on Netlify.
