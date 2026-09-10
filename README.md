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

Climate Crisis for headings, h1 through h3. Bricolage Grotesque for everything
else. Both self-hosted from the files in `src/fonts`, taken from the variable
builds in the design handoff rather than a package, subset to Latin and
converted to woff2. Bricolage went 398kB to 149kB, Climate Crisis 3.5MB to
46kB, which is the difference between shipping them and not. The OFL licences
sit beside them as the licence requires.

Bricolage's file defaults to ExtraBold at 96pt optical size, so the `@font-face`
has to declare `font-weight: 200 800` or every word on the page renders at 800.

Climate Crisis is extremely wide, so headings are short phrases. Long sentences
in it wrap to three lines and swallow the screen. Where a heading needs more,
the sentence goes underneath as a standfirst in Libre Franklin.

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
  og.png        Social card, regenerate if the positioning line changes
scripts/
  capture-shots.mjs
```

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

**Case studies live in `ProjectDialog`,** not on the card. That is deliberate:
an earlier version folded them behind a disclosure and hid them entirely on
short screens, which cut the substance to save height. Keep them in the dialog.

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
paths. All three are stamped at build time from one value. `index.html` carries
a `__SITE_URL__` token, and `robots.txt` and `sitemap.xml` are generated by the
`site-url` plugin in `vite.config.ts`.

**No em-dashes.** Deliberate, throughout the copy.

## Still to do

- The Fleet AI entry in `src/data/content.ts` says only that it was contract
  work for a US-based AI company, because that is all the CV gave. It needs two
  or three lines about what was actually done there.
- FinPulse is the one card in the rail with no screenshot, because it is PHP
  and its free host times out. Redeploy it, or run it locally against MySQL,
  and it can be captured like the others.
- Deploy, then set the origin.

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
