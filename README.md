# Samonwita Sarker, portfolio

Personal site for a CSE undergraduate at CUET. Full-stack work, two published
Chrome extensions, and research in explainable AI and NLP.

Not deployed yet. See Deployment below.

`CONTEXT.md` sits beside this file and covers how the project got here: the
instructions behind the design choices, what was tried and reversed, the bugs
that were hard to find, and what is still open. Read it before changing
anything visual.

## The idea

Explainable AI attributes a prediction back to the features that caused it, and
a debater attaches evidence to every claim. The site works the same way: every
project states its problem, what was built and the outcome, and every figure in
the strip under the hero links to the thing that proves it.

## Colour

Five colours, used together in one scheme rather than split across a light mode
and a dark one. There is no theme toggle.

| | | Job |
|---|---|---|
| `#3F194D` | plum | cards and panels; a darker cut is the page ground |
| `#68097E` | violet | second surface, and the rules between things |
| `#C91C7A` | magenta | primary actions and the page-transition panels |
| `#E8675C` | coral | links, hovers, the pager, negative attribution bars |
| `#FFCA06` | yellow | numbers, labels and figures |

One thing worth not undoing: magenta reads at only 3.5 to 1 against the ground,
so it is never used for type. It is a fill, with white on it at 5.3 to 1.
Yellow is the text accent at 12.0, coral at 5.7.

## Type

Lobster Two for headings, h1 through h3. Bricolage Grotesque for everything
else. Both self-hosted from the files in `src/fonts`, taken from the design
handoff rather than a package, subset to Latin and converted to woff2:
Bricolage went 398kB to 149kB, Lobster Two 116kB to 47kB. The OFL licences sit
beside them as the licence requires.

Only Lobster Two's Regular is shipped. Every heading on the page computes to
weight 400, and the Bold file is another 47kB for nothing. If a heading ever
needs bold, add the second face rather than letting the browser smear a
synthetic one over a script.

Bricolage's file defaults to ExtraBold at 96pt optical size, so the `@font-face`
has to declare `font-weight: 200 800` or every word on the page renders at 800.

**Lobster Two is a joined script, and that governs three things.** Its letters
connect through the `calt` and `liga` features, so the subset keeps every
layout feature; strip them and the script comes apart. It takes no negative
tracking, so no heading carries one. And its ascenders and descenders are deep,
so headings are set at 1.1 to 1.18 rather than the near-solid leading a slab
face tolerates, and the mask boxes in `MaskText` clear 0.2em below the baseline
so a descender is not shaved off.

Headings are still short phrases. That began as a constraint of the previous
face, which was extremely wide, and it survives because a script is harder to
read at length than a grotesque. Where a heading needs more, the sentence goes
underneath as a standfirst in Bricolage.

## Structure

Six routes, one per section: `/`, `/work`, `/experience`, `/research`,
`/about`, `/contact`, plus a 404.

**Every page fits one screen.** Verified from 1920x1080 down to 1280x720. The
vertical rhythm clamps against `vh` as well as `vw`, and `index.css` carries
`max-height` blocks that compress further on short laptops.

**Left and right arrow keys** walk the sections in reading order, with the same
two moves at the bottom edge as buttons so the shortcut is discoverable. The
handler stands down inside form fields and while a dialog is open.

The header nav is generated from the same `ROUTES` list the arrows walk, so the
two orders cannot drift apart. The CV is a download, not a section, so it sits
off to the right rather than inline, where it read as the next step and sent
people somewhere the arrow key did not.

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
  pages/        One per route, each composing section components
  components/   Sections, plus Figure, Reveal, MaskText, Backdrop,
                Pager, PageTransition, ProjectDialog
  data/         content.ts, every string a visitor reads
  hooks/        useReducedMotion
  lib/          routes.ts
public/
  shots/        Real screenshots of the live projects
  og.png        Social card, generated; do not hand-edit
scripts/
  capture-shots.mjs
  make-og.mjs
```

`make-og.mjs` renders `public/og.png` from the site's own font files and colour
tokens, and reads the name, standfirst, positioning line and proof figures out
of `content.ts`. Run it after changing any of those. Rendering rather than
drawing it is the point: the previous card was hand-made, and it was still
light-background Helvetica long after the site had become dark plum and Lobster
Two, quoting a positioning line the site no longer said.

## Notes for future edits

**Screenshots, not illustrations.** Project imagery is a real capture of the
running product. Where a project has no deployment, it can still be cloned and
run locally to be captured; StockMaster and KanDesk were shot that way. Where
even that is impractical, the frame carries real figures or the capabilities
the project actually has, never a mocked-up interface.

Every shot is stored at 16:10 and each frame is locked to the file's own ratio,
so an image fills its box with nothing cropped and no bars around it. Card
height is governed by card **width**, never by a height cap on the image. A
height cap is what was silently cropping them before.

**The work rail** slides continuously and never repeats. The track is
translated left a fraction of a pixel per frame, and once the leading card has
passed the edge it is sent to the back by rewriting its flex `order`, with the
same width taken off the offset. Each project appears once.

`order` rather than rotating a React array is deliberate: a style write lands in
the same frame as the transform, whereas rotating state leaves the DOM a render
behind and jumps a card width on every recycle.

Cards stretch to a common height, so any space left above the footer gets filled
with content rather than the card being shrunk. It stops on hover, on focus,
while a dialog is open, when the tab is hidden, and under reduced motion. Below
`lg` it collapses to a column.

**The index band** under the rail is `otherWork`, and it is deliberately a
single line: the heading, how many there are, and a link to the repositories.
It used to be a slide inside the rail, where it read as one more project rather
than as the index it is. It names none of them either. Most of what is behind
that link is coursework and browser toys, and setting those titles next to the
eight builds above argues against the work rather than for it.

**Case studies live in `ProjectDialog`,** not on the card. That is deliberate:
an earlier version folded them behind a disclosure and hid them entirely on
short screens, which cut the substance to save height. Keep them in the dialog.

**The pager never sits on the footer.** It is fixed to the bottom of the
viewport and used to land on top of the footer links, covering 68px of "Get in
touch" at 1280x720. `Footer` publishes its own height as `--footer-h` through a
`ResizeObserver`, and the pager offsets itself by that. Measured rather than
hard-coded, because the footer stacks to two rows below `sm`.

Every route fills its viewport exactly, so on a 720px screen the pager still
reached a few pixels past where content ends. It takes its buttons in below
`max-height: 780px`.

**Touch targets.** The footer and contact links are set at 12 to 14px and come
out around 20px tall, which is fine for a cursor and too small for a thumb. The
`.tap` utility in `index.css` grows the hit area to 44px with a pseudo-element,
so nothing moves visually. It is behind `pointer: coarse`, so a mouse does not
get invisible targets bleeding into neighbours.

**Transition timing.** A navigation used to take about a second before the new
page was readable. Arrow keys walking between sections is the whole point of
the site, so that was a tax on the one interaction it is built around. The
curtain constants at the top of `PageTransition` and the delay in `Page` are
where that time lives; it is around 560ms now. The hold is still long enough to
read the section name, which is the only thing the pause is for.

**Loading.** Two skeleton layers, both shaped like the content they replace. The
boot shell is inlined in `index.html` so it paints before the bundles arrive.
`Figure` holds a skeleton in the image's own box until the file decodes.

**Motion.** Everything checks `useReducedMotion` or sits behind the
`prefers-reduced-motion` block in `index.css`.

A framer-motion trap worth knowing: a bare four-number `ease` array next to a
keyframe track is parsed as one easing per segment, not as a cubic bezier, and
the animation silently refuses to run. Use a named easing on keyframed tracks.

**Absolute URLs.** The canonical link, the Open Graph tags and `sitemap.xml`
need the deployed origin, because Open Graph crawlers do not resolve relative
paths. All are stamped at build time from one value. `index.html` carries a
`__SITE_URL__` token, and `robots.txt` and `sitemap.xml` are generated by the
`site-url` plugin in `vite.config.ts`. The default is the deployed origin, so a
build anywhere produces correct tags; `VITE_SITE_URL` overrides it.

**Per-route HTML.** `src/lib/meta.ts` holds a title and description for every
route, and it is read twice. `Page` applies it to the document as the visitor
navigates, and the `route-meta` plugin writes a real `work/index.html`,
`about/index.html` and so on at build time, each with its own title,
description, canonical link and Open Graph tags.

The build-time half is the half that matters. This is a single-page app, so
every route otherwise serves one identical `index.html`, and a crawler that
does not run JavaScript, which is most social-preview crawlers, reads the same
title and description for all six pages. Vercel serves a matching file before
it consults the rewrite in `vercel.json`, so a crawler gets the real page while
a visitor still lands in the app and navigates client-side.

**Prerendering.** Without it the deployed body carried zero text. Search
engines run JavaScript and coped, but a plain HTTP fetch did not, and neither
do link scrapers, applicant tracking systems, or any tool that reads a URL
without a browser. They all received a shell.

`npm run build` therefore runs three things after the typecheck: the client
build, an SSR build of `src/entry-server.tsx`, and `scripts/prerender.mjs`,
which imports that bundle, renders each route with `renderToString`, and writes
the result into the route's HTML file.

`App` is split for this. `AppShell` holds everything inside the router, so it
can run under `BrowserRouter` in the browser and `StaticRouter` on the server.

Rendering through React rather than a real browser is deliberate, and it was
not the first attempt. The first version drove Chromium through Playwright. It
worked locally and the deploy failed, because it made every build depend on a
browser binary being downloadable in the host's container. A build that cannot
finish is worse than a thin page.

`useReducedMotion` returns **true** when there is no `window`, and that is
load-bearing. Under reduced motion each component renders its plain final
state; with motion on, the markup is saved frozen at the start of an entry
animation holding `opacity: 0`, which ships text that is present but invisible.
Check for it: the built HTML should contain no `opacity:0` in the body.

Case-study text lives in a dialog that mounts only when opened, so it is not
included. Every heading, card title, summary and stack is.

React replaces this markup when it mounts, and there is no gap: on a throttled
connection the text is on screen at about 120ms and never returns to empty.

**The site works with JavaScript off.** That falls out of prerendering rather
than being designed for, but it is worth not breaking. Router links render as
real `<a href>` and every route is a real file, so a visitor with no JavaScript
navigates by full page loads and sees everything, screenshots included.

`Figure` starts in its loaded state when there is no `window`. The skeleton is
client-side state, and writing it into the HTML left every screenshot as a grey
box for anyone not running JavaScript, which turned the work page into a set of
empty frames.

**404s are a real document.** `vercel.json` rewrites anything matching no file
to `404.html`, which is built and prerendered like any other route. Before, an
unknown URL fell through to `index.html` and served the home page's title and
content under the wrong address.

**One `h1` per route.** Each route's own heading is its `h1`, and ranks below
it run without a gap. Only the home page had an `h1` before, which read to a
crawler as five pages with no subject.

**Images.** Captures come off `capture-shots.mjs` at 2240px, which is about
five times what any box on the page renders. `optimise-shots.mjs` rebuilds each
one as a 1400px and a 700px WebP plus a same-size fallback in the original
format, and `Figure` picks between them with `srcset` and a `sizes` hint of
430px, which is roughly where both a rail card and the dialog land. That took
the work page's imagery from 948kB to 132kB.

**Caching.** Hashed assets under `/assets/` are immutable for a year. The
screenshots, the social card and the CV keep stable filenames so they cannot be,
and take a day of freshness with a week of stale-while-revalidate instead: a
repeat visitor pays nothing and a re-captured shot still reaches people quickly.

Keep `vercel.json` to keys Vercel's schema accepts. There is no `comment` field,
and an unrecognised key fails the whole file the same way a syntax error does.

**No em-dashes.** Deliberate, throughout the copy, and in the page titles too.
The old title carried one, where the check for them never looked, so it showed
in the browser tab and in every search result.

## Still to do

- FinPulse sits in `otherWork` rather than the rail. It has no screenshot,
  because it is PHP and its free host times out. Redeploy it, or run it
  locally against MySQL, and it can be captured like the others, which is what
  it would need before it could go back on the rail.
- Confirm the contact form end to end. It posts to formsubmit.co, which holds
  the first message to a new address until a confirmation link is clicked.
  Until that is done a visitor sees "sent" and nothing arrives.
- The old portfolio at `samonwitaportfolio.netlify.app` still exists and will
  compete with this one in search results. The CV no longer links to it.

## Deployment

Configured for Vercel via `vercel.json`, which adds the SPA rewrite, immutable
caching for hashed assets, and basic security headers. `public/_redirects`
covers the equivalent fallback on Netlify.

The origin resolves in this order:

1. `VITE_SITE_URL`, if set. Use this for a custom domain.
2. `VERCEL_PROJECT_PRODUCTION_URL` on Vercel, or `URL` on Netlify. Both hosts
   set these automatically, so a normal deploy needs no configuration.
3. A placeholder, with a build warning.

```bash
npm i -g vercel
vercel login
vercel --prod
```

After the first production deploy, paste the URL into LinkedIn's Post Inspector
to confirm the card renders. It caches on first scrape, so check before sharing.
