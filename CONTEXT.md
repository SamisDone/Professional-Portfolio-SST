# Context and handoff

`README.md` covers how the project works. This file covers how it got here:
the decisions that were made, the ones that were reversed and why, and what is
still open. Read it before changing anything visual, because several things
that look arbitrary are the result of an explicit instruction or a bug that
took a while to find.

Written at commit `58974b1`. If you are picking this up much later, check
`git log` before trusting the specifics.

---

## Where the project stands

A six-route single-page site for Samonwita Sarker, a CSE undergraduate at CUET.
React 19, TypeScript, Vite, Tailwind 3, React Router, framer-motion, Phosphor
icons. No other runtime dependencies.

**Not deployed.** The origin in the meta tags is a placeholder until it is.

Routes: `/`, `/work`, `/experience`, `/research`, `/about`, `/contact`, plus a
404. Every page is built to fit one screen, verified 1920x1080 down to
1280x720.

---

## Instructions given, in order

These were all explicit. Do not quietly undo them.

1. **Not templated.** The starting point was a dark site with Instrument Serif,
   a stock space video and a bento grid. It was called generic. Everything
   below follows from that.
2. **Real pages per section**, not anchors on one long page, each with a proper
   transition animation.
3. **Arrow keys** move between sections, left and right.
4. **Least scrollability.** Each page should fit the screen.
5. **Horizontal scrolling on desktop where it helps**, but mobile responsive.
6. **Fonts**, in order of instruction: not Instrument Serif, then not Geist
   ("identical to my boyfriend's"), then IBM Plex ("so freaking ugly"), then
   Plus Jakarta, then Climate Crisis for headings, and now **Lobster Two for
   headings with Bricolage Grotesque for text**. All from zips supplied in the
   project root; the Lobster Two files are in the three-family zip.
7. **Colour**, in order: not the blue gradient, then espresso and baby pink,
   then dark green and strong red and bright white, then three Pantone
   references, then finally the **five hex values** now in use. And used
   *together in one scheme*, not split across a light theme and a dark one.
8. **Projects**: more of them, drawn from the real GitHub account. No repeats
   in the sliding rail. Games and toys out of the standout rail. MediHub
   fourth, not second.
9. **FinPulse off the rail**, and the "Everything else" index off the same row
   as the projects. It is not a project and should not sit in a project frame.

---

## Things that were tried and rejected

Do not reintroduce these without asking.

- **A light theme and a theme toggle.** Built, then removed. The five colours
  are meant to appear together on one screen. `lib/theme.ts` and the
  view-transition CSS that animated the toggle are gone with it.
- **The name as a navigation compass**, with section links bracketing it in the
  hero. Built, disliked, removed when sections became routes.
- **AnomLite in the standout rail.** Promoted, then pulled back to the index at
  request. It is still in `otherWork` with its real metrics in the copy.
- **Hangman, Pixel Art Pad, Glitch Breach, SortnPlay in the rail.** Moved to
  the index as toys next to the rest.
- **Case studies folded behind a disclosure on the card**, and hidden entirely
  on short screens. This cut the substance to save height and was the wrong
  trade. They live in `ProjectDialog` now. Keep them there.
- **Duplicating the project set** to make the slide loop seamlessly. Visible as
  repetition. The rail recycles instead.
- **The index as a slide in the rail.** It was the last card in the track, and
  in the same row of frames it read as a ninth project. It is a band under the
  rail now, on the page gutter, plainly a different kind of thing.
- **Naming the eleven in that band.** Built as a wrapped row of titles, then
  cut. Four of them are browser toys and four are coursework, and those titles
  standing next to the eight builds above argued against the work. The band
  gives the count and the link and nothing else.

---

## Bugs that were hard to find

Each of these looked like a design problem and was actually a defect. If a
symptom below reappears, start here.

**The rail looked frozen.** The drift advanced the scroll offset while the
easing pulled that same offset back toward a target that never moved. The two
cancelled at about three pixels. The drift now advances the *target* and the
offset chases it. Symptom: projects appear static or barely creep.

**`scrollLeft` rounds to whole pixels.** An earlier version added a sub-pixel
drift to the value read back off the element, which rounded straight back down
every frame. Never accumulate a sub-pixel position by reading it back off the
DOM.

**Per-frame motion is refresh-rate dependent.** The drift step was per frame,
so it measured 2.7 px/sec where the loop ran slow. It is per second now, with
the elapsed time clamped so a backgrounded tab does not jump on return.

**An effect that depends on a pause flag tears itself down.** The frame loop
depended on `halted`, so every hover ran its cleanup, wiped the transform and
reset the recycle head. It reads the flag from a ref now and is never torn
down.

**A bare four-number `ease` array next to a keyframe track** is parsed by
framer-motion as one easing per segment, not as a cubic bezier, and the
animation silently refuses to run. This is what made the page transition look
like it was not there at all. Use a named easing on keyframed tracks.

**Tailwind emits `.relative` after `.absolute`.** A wrapper carrying both
resolves to `relative`, its absolutely positioned children stop contributing
height, and the whole thing collapses to zero. This is what made every project
card render empty in the original site.

**A nested `calc()` inside `max()` did not survive the Tailwind class parser.**
The rail gutter lives in `index.css` as real CSS for that reason, with the
class doubled (`.work-rail.work-rail`) so it outranks the utility on the same
element.

**Images were cropped, then letterboxed.** Both were wrong. A frame must match
its file's own ratio, and card height must be governed by card *width*. A
height cap on the image is what crops it.

**Bricolage Grotesque's variable file defaults to ExtraBold at 96pt optical
size.** The `@font-face` must declare `font-weight: 200 800` or every word on
the page renders at 800.

**A regex in `vercel.json` needs its backslashes doubled.** The SPA rewrite
source is a regex inside a JSON string, and JSON has no `\.` escape, so the
file fails to parse and Vercel rejects the whole deployment with "invalid
vercel.json file provided". It has to be written `\\.`, which decodes to the
`\.` the regex wants. Run the file through a JSON parser before pushing it.

**Client-side state written into prerendered HTML becomes permanent.** `Figure`
holds a skeleton until its image decodes, which is a state React flips. Rendered
to a string that skeleton is just markup, so with JavaScript off every
screenshot stayed a grey shimmering box forever. Anything whose initial state
means "not ready yet" needs to render its ready state when there is no window.
The same applies to `useReducedMotion`.

**A fixed element at the bottom of the viewport will find the footer.** The
pager was covering footer links, 68px of "Get in touch" at 1280x720, on a page
that had been checked at five viewports for everything except overlap. Fit
checks compare scroll height to viewport height and say nothing about two
things occupying the same pixels. Test for overlap separately: walk the pager
buttons against every text node and compare rectangles.

**A single-page app ships an empty body, and checking the `<head>` does not
catch it.** Per-route titles and descriptions were added and verified, and the
body was still zero characters of text in the deployed HTML. Anything reading
the page without a browser saw nothing: link scrapers, applicant tracking
systems, a plain `curl`. `scripts/prerender.mjs` now writes the rendered HTML
into each route's file at build time. The check is to fetch the deployed URL
and strip the tags, not to read the head and assume the rest followed.

**Prerendering with a real browser broke the deploy.** The first version of
that script drove Chromium through Playwright. It worked locally and the
Vercel build never shipped, because it made every build depend on downloading
a browser binary in the host's container. It renders through
`react-dom/server` now and needs nothing but Node. If a build step works on
this machine and the deploy goes quiet, suspect the step, not the host.

**Prerendering with motion on is worse than not prerendering.** Rendered with
animations enabled, the markup is saved frozen at the start of every entry
animation, holding `opacity: 0`. The text is in the file and invisible.
`useReducedMotion` returns true when there is no `window` for exactly this
reason. `Pager` was the one component not checking the hook at all, so it kept
coming out hidden until it did.

**A joined script needs the type settings undone, not just the family swapped.**
Climate Crisis was a wide slab and every heading carried `tracking-tight` and
leading near 1.0 to suit it. Both are wrong for Lobster Two: negative tracking
collides the joins, and the deep descenders hit the next line. All fifteen
`tracking-tight` classes came off, leading went to 1.1 and 1.18, and the mask
boxes in `MaskText` were opened to 0.2em. The face is also far narrower, so the
heading clamps had to grow or every heading under-filled its column by half.

**Narrowing a rail card does not always shorten it.** The screenshot shrinks,
but the stack chips underneath wrap onto another row and take the height
straight back. At 1280x720 a card went from 265px wide to 250px and got
*taller*. Measure before assuming the width ladder in `index.css` is the lever.

---

## Content rules

**Nothing about the work is invented.** Every case study was written from the
project's own README or from the CV. Where a number appears, it came from the
source. If you add a project, read its README first.

**Project imagery is a real capture of the running product.** Where there is no
deployment, the app can be cloned and run locally and captured; StockMaster and
KanDesk were shot that way. Where even that is impractical, the frame carries
real figures or the project's actual capabilities. Never a mocked-up interface.

**No em-dashes anywhere in the copy.** Deliberate. Verified as zero on every
route.

**Headings are short phrases.** This began under Climate Crisis, which was very
wide, and it holds under Lobster Two for a different reason: a joined script is
harder to read at length than a grotesque. Where a heading needs more, the
sentence goes underneath as a standfirst in Bricolage.

---

## Current project inventory

Eight in the sliding rail, every one of them with a real screenshot:

`greenlight`, `kandesk`, `riphours`, `medihub`, `stockmaster`, `pierra`,
`tabsaver`, `resumeforge`

Eleven in `otherWork`, none of them named on the page. They are reached through
the "All repositories" link in the band under the rail:

`anomlite`, `finpulse`, `sortnplay`, `pixelart`, `hangman`, `glitch`,
`task-scheduling`, `page-replacement`, `roundrobin`, `financetracker`,
`microops`

The band is a single line and its only variable is `otherWork.length`, so
moving a project between the two lists needs no copy change.

---

## Open items

1. **Confirm the contact form end to end.** It posts to formsubmit.co, which
   holds the first message sent to a new address until a confirmation link in
   the inbox is clicked. Until that happens a visitor fills the form, sees
   "sent", and nothing arrives. This is the one item on the site that can fail
   silently and lose a real message, so test it on the deployed URL.

2. **FinPulse has no screenshot.** PHP against MySQL, and its free host times
   out. It is in `otherWork` now, so nothing on the page is missing an image,
   but a capture is what it would need to go back on the rail.

3. **The old portfolio** at `samonwitaportfolio.netlify.app` still exists and
   will compete with this one in search results. The CV's portfolio link was
   repointed at the new site, but the old deployment itself is still up and
   only she can take it down or redirect it.

4. **The JavaScript bundle is about 143kB gzipped**, and splitting it by route
   would not help. Measured by chunk: react-dom 56kB, framer-motion 47kB, app
   code 20kB, react-router 14kB, phosphor 4.5kB. The icons already tree-shake.
   Route splitting only moves that 20kB of app code around. The one reducible
   piece is framer-motion, through `LazyMotion` with `m` components in place of
   `motion`, worth perhaps 15kB and touching every animated component. It was
   left alone: the page is prerendered, so none of this blocks first paint.

### Resolved, and how

- **Fleet AI** used to be one thin sentence, on the belief that the CV said no
  more. The CV in `public/` describes the work in full on page one. Read the
  source before recording that a source is empty.
- **Team versus solo authorship** was left open for the same reason. The CV
  names a role for eight of the projects, and those are now in `role` on
  `Project`, shown in the dialog. The ones the CV does not name have no role
  set, and nothing is rendered for them: a guess at authorship is the one
  mistake here worth avoiding.
- **The origin** is set. `vite.config.ts` defaults to the deployed URL.

---

## How to check your work

```bash
npm run build     # typecheck then build; both must pass
npm run lint      # oxlint; currently zero warnings, keep it there
npm run preview   # serve the production build on :4173
```

Beyond that, the checks worth repeating after any visual change, all of which
were run against the production build with Playwright:

- Every route fits one screen at 1920x1080, 1536x864, 1440x900, 1366x768 and
  1280x720. Compare `document.documentElement.scrollHeight` to
  `window.innerHeight` per route.
- No horizontal overflow at 390px.
- Arrow keys walk forward and back through all six routes, and do not fire
  while a form field has focus or a dialog is open.
- The rail's transform advances at about 40 px/sec, stops on hover, and resumes
  on leave. Give the easing a second to settle before sampling a paused rail,
  or the tail of the lerp reads as drift.
- Under `prefers-reduced-motion` the page still renders and the rail becomes
  manually scrollable rather than a frozen strip.
- Nothing overlaps the pager. Compare its buttons' rectangles against every
  text node in `main` and `footer`, at every viewport. Fitting one screen and
  not colliding are different checks.
- No touch target under 44px at 390px wide, counting the `.tap` pseudo-element.
- The site still works with JavaScript disabled. Screenshots must render, not
  skeletons, and the header links must navigate.
- An unknown URL serves 404.html, not the home page.
- Zero em-dashes in the rendered text, and none in the page titles either.
  `document.body.innerText` never sees a `<title>`, which is how one sat in
  the browser tab and in every search result for months.
- Exactly one `h1` per route, and no gap in the heading ranks below it.
- Fetch a deployed route with no browser and strip the tags. The body must
  contain the page's real text. `curl -s URL | grep Greenlight` is enough.
- The built HTML must contain no `opacity:0` inside `<body>`. That is the
  signature of markup prerendered mid-animation, which reads as a blank page.
- Measure the rail's speed only against a known frame rate. A headless browser
  under load drops to 20-odd fps, and a naive sample then reads half the real
  speed. The drift is per second, so it should hold at about 42 px/sec at any
  frame rate; if it scales with fps, the per-second fix has been undone.
- Each route serves its own title, description and canonical link. Check this
  against a server that resolves the filesystem before the SPA rewrite, the
  way Vercel does. `vite preview` goes straight to the rewrite and every route
  comes back with the home page's metadata, which hides the whole problem.
- No heading computes to a weight other than 400. Only Lobster Two Regular is
  shipped, so anything asking for bold gets a synthetic one.
- No console errors.

`scripts/capture-shots.mjs` re-shoots the project screenshots, and
`scripts/make-og.mjs` re-renders the social card. The card reads its copy out of
`content.ts`, so run it after any change to the name, the standfirst, the
positioning line or the proof figures.
