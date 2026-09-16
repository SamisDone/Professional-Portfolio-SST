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

A seven-route single-page site for Samonwita Sarker, a CSE undergraduate at CUET.
React 19, TypeScript, Vite, Tailwind 3, React Router, framer-motion, Phosphor
icons. No other runtime dependencies.

**Not deployed.** The origin in the meta tags is a placeholder until it is.

Routes: `/`, `/work`, `/experience`, `/research`, `/about`, `/activities`,
`/contact`, plus `/repositories` (by link, not in the arrow-key sequence) and a
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
   Plus Jakarta, then Climate Crisis for headings, then Lobster Two for
   headings with Bricolage Grotesque for text, and now **Instrument Serif for
   display, Instrument Sans for body and UI, and DM Mono for labels**, which
   reverses the first instruction on purpose (see the typography notes below).
   All three are self-hosted woff2 in `src/fonts` with their OFL licences.
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
wide, and it holds under Instrument Serif for a different reason: a condensed
display face is harder to read at length than a text face. Where a heading
needs more, the sentence goes underneath as a standfirst in Instrument Sans.

---

## Current project inventory

Ten in the sliding rail, every one of them with a real screenshot, in this
order on purpose: paid client work second, the strongest build third, MediHub
still fourth.

`greenlight`, `pierra`, `kilnwatch`, `medihub`, `riphours`, `unread`,
`narrativeguard`, `tabsaver`, `resumeforge`, `stockmaster`

Fifteen in `otherWork`, none of them named on the page. They are reached
through the "List them all" link in the band under the rail, which opens
`/repositories`:

`kandesk`, `anomlite`, `finpulse`, `sortnplay`, `pixelart`, `hangman`,
`glitch`, `task-scheduling`, `page-replacement`, `roundrobin`, `microops`,
`ems`, `rentease`, `debate-marksheet`, `ssis-ssrs`

KanDesk came off the rail in the review pass below and stays off for a second
reason: its deployment is gone, so there is no preview to put on a card.
ResumeForge came off with it and went back on, because it is a real tool with
a running deployment. The four browser games stay in the index, as instructed
twice.

`kilnwatch`, `unread`, `narrativeguard`, `ems` and `rentease` are not on her
account. They carry a `role` for that reason, and it is measured rather than
generous: see the survey note at the end of this file.

`financetracker` was deleted. `github.com/SamisDone/Finance-Tracker` redirects
to `FinPulse`, because the repository was renamed, so the two entries were one
project listed twice, and the older of them advertised PostgreSQL over code
that uses MySQL through PDO.

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
- An unknown URL serves 404.html *and answers 404*, not 200. There is no
  catch-all rewrite; a rewrite would make every missing page a soft 404.
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
  against a server that resolves the filesystem the way Vercel does, file then
  directory index. `vite preview` applies its own SPA fallback and every route
  comes back with the home page's metadata, which hides the whole problem.
- No display text computes to a weight other than 400. Instrument Serif ships
  only Regular and Italic, so anything asking for bold gets a synthetic one.
- No Instrument Serif below 28px.
- No console errors.

`scripts/capture-shots.mjs` re-shoots the project screenshots, and
`scripts/make-og.mjs` re-renders the social card. The card reads its copy out of
`content.ts`, so run it after any change to the name, the standfirst, the
positioning line or the proof figures.

---

## The recruiter review pass

A marksheet written from a recruiter's point of view was worked through in
full. What it changed, and why, because several of these look like arbitrary
rewrites and are not.

**Nothing claims a number its own link disproves.** The proof strip said "300+
competitive programming problems solved" over a link to Codeforces, where the
profile shows 83 solved at 1053. The 300+ is real and spread across judges, as
the CV says, but the receipt attached to it argued the opposite on the first
click. That slot now counts the deployed projects, computed from `live` on the
two project lists rather than typed in, so it cannot drift.

**No cumulative CGPA appears anywhere.** The CV prints "Current CGPA: 3.85",
which is also the level 3 term II figure in `cgpaHistory`, and a cumulative
cannot equal the highest single term unless the others carried no credits. Six
of eight terms are sat. The chart shows the terms, the caption says each point
is that term alone, and no single number stands in for a degree that is not
finished. The PDF still says 3.85 and only she can correct it.

**The ACL work is a publication, not a placing.** It was filed under
Competition with a one-line note about "recovering the prompt behind a
generated Telugu text". The paper is a first-author system paper, published,
with a DOI, and the task is nine-way style classification, not prompt
reconstruction. The link moved from OpenReview, which stops visitors at a
browser check, to the Anthology page. The 0.1703 macro F1 is stated with the
chance baseline next to it, because a reader who finds the number alone will
read it as a failure.

**Author lists are printed in full, with position visible.** Fourth of six and
first of five are different contributions. Names are spelled the way each venue
spells them, which is why one list is initials and the other is not.

**The card is no longer a single button.** Live and source were three clicks
away behind the case study. They are links in the card footer now, with the
case study still the whole card as a stretched button underneath them. The
"View case" wording moved to an arrow in the title row, so the footer carries
two new destinations at exactly the height it had before. This mattered: the
first version of the change put the page 62px over one screen at 1280x720.

**Education, leadership and the grade chart moved onto `/about`.** They were
CV-only, which means a visitor had to decide to download a PDF to learn where
she studies. The grade chart came off `/research`, where it sat beside a list
of publications answering a question nobody was asking there. `/research` has
the thesis in that column instead.

**`/about` stopped fitting a screen, so it was split.** With leadership,
competitions and certifications on it, it ran about 700px over at 1280x720.
Those three moved to a new `/activities` route, after About in the sequence.
Education and the grade chart stayed on About, beside the introduction, because
where she studies is the first thing a recruiter checks; the stack became a
single four-column row under them. Two new pages (education and activities
separately) was considered and rejected: education is two entries, too thin
for a page, and every route adds a nav slot and an arrow-key stop.

Both pages fit at 1920x1080, 1536x864, 1440x900, 1366x768 and 1280x720, with
their own `max-height` blocks in `index.css`. `/activities` starts compressing
at 920px rather than 850px, because it has the most rows of any route.

**The home page was rebuilt to be more striking**, at the owner's request
("very normal looking"). The name is now the display at poster scale, and a
stack of real screenshots (`ShotDeck`) replaced the attribution diagram and the
"Based in / Focus / Open to" list. The palette, the fonts, the dark theme and
the one-screen rule were all kept. MediHub was in the stack first and was
swapped for TabSaver at her request. Checked: fits one screen at 1920x1080,
1536x864, 1440x900, 1366x768, 1280x720 and 1024x768; no sideways scroll down to
360px; static under reduced motion; readable with JavaScript off.

**Competition results are the owner's.** Every event but the ACL placing is
"Finalist", as she stated on 17 September. The SciBlitz certificate itself names
no placing, so that one rests on her word, not the document.

**The pager stopped floating over body text.** See the README. It was safe only
while every page fitted.

**The chart type was set in viewBox units and rendered at about 6px.** The SVG
scales with its column, so an 11-unit label in a five-column aside came out
unreadable. Sizes and padding were opened up to land near 12px.

### What the review asked for and did not get

- **Narrative Guard, PoliMemeDecode and the Bengali QA RAG pipeline** have no
  repository on the account, so there is nothing to link, screenshot or read a
  README from. PoliMemeDecode's real figures are in the research ledger.
- **Team versus solo** is still unmarked on Greenlight, KanDesk, Microops and
  SortnPlay. The CV names a role for the other eight.
- **"7th of N teams"** needs N, and the shared task overview does not publish
  it in the abstract.
- **Months on the freelance entry**, and whether PIERRA runs on a client domain
  rather than `pierrafinal.vercel.app`, are both hers to supply.

---

## The typography change

The brief arrived as a Next.js guide. This is Vite, so `next/font/google` does
not apply and the three families are self-hosted in `src/fonts` the way the
previous two were. Everything else in that guide was followed.

**The palette did not change.** The guide carried a set of colour tokens
alongside the type; the five hex values in `index.css` are the result of a long
argument and were left exactly as they were. The guide was read as what it is
called, a typography guide.

**`p { max-width: 68ch }` was not applied globally.** The project already has
`max-w-measure` at 68ch and puts it on the paragraphs that want it; a global
rule would have capped the ones that are meant to fill their column. `text-wrap:
pretty` on `p` and `balance` on the display classes were applied.

**Instrument Serif was explicitly rejected once before**, in the font sequence
recorded above, and asked for by name this time. That is a reversal, not an
oversight, and it is recorded here so the earlier note does not read as an
instruction that was quietly undone.

### Three stale CSS selectors turned up doing nothing

The short-screen rules are the tightest part of this codebase and three of them
named elements the markup had stopped having:

- `.work-rail [data-case] h3` shrank the card title. The title is an `h2`, and
  had been for a while, so the rule had been dead.
- `.work-rail [data-case] > div > button` padded the card. The card became a
  `div` with a stretched button inside it when the live and source links were
  added, so the rule started matching the invisible overlay instead.
- `#research li h4` and `.index-band h3` were the same kind of miss.

They are fixed, and the card now carries a `data-card` attribute so a rule
about the card cannot go stale on the tag name again.

### The clamp floor, not the vh term

`/` and `/research` sat three pixels over at exactly 1280x720 through several
rounds of tuning the `vh` term in `.page-pad`. At 720px tall, `5vh` is 36px and
the clamp lifts it back to its 2.75rem floor, so the term being tuned was never
the one applying. Lowering the floor fixed it in one edit. When a `clamp()`
refuses to respond, check which of its three arguments is actually winning.

---

## The repositories page

`/repositories` lists every project in one table, each row with its source link
and a live link where there is one.

**It is in `ROUTE_META` but not in `ROUTES`.** Those two lists do different
jobs: `ROUTES` is the reading sequence the arrow keys and the nav walk, and
`ROUTE_META` is what the build turns into real prerendered files and sitemap
entries. Being in one and not the other gives the page a real URL, its own
title and description, and its text in the HTML, while taking no slot in the
nav and no place in the arrow-key walk. `Pager` returns null there on its own,
because `neighbours()` finds no index for it. The 404 works the same way.

**It replaced a link that was wrong.** The band under the rail said "All
repositories" and pointed at the GitHub repositories tab. That tab lists
coursework, PDFs and empty repositories that are not projects, and it does not
list the five projects that live on someone else's account. The band says "List
them all" and points here; the GitHub link is still on this page, at the
bottom, described as what it actually is.

**Rows for repositories that are not hers say so**, with the role and the owner
in the row. That is the whole reason the page is worth having over a link.

It is the one page allowed to scroll and the one element allowed to scroll
sideways: the table drops to three columns under `lg` and two under `md`, and
below that it scrolls inside its own container rather than pushing the page
wide.

## The CV

`public/Samonwita_Sarker_CV.pdf` is pdfTeX output and there is no `.tex` for it
on the account, so it cannot be recompiled. It can still be edited: the text
lives in one Flate-compressed content stream and pypdf will rewrite the object
and fix the xref.

"Current CGPA: 3.85" is now "CGPA: 3.51/4.00, rising: latest term 3.85".
3.85 was the level 3 term II figure, and a cumulative cannot equal the highest
single term. 3.51 is the equal-credit mean of the six terms; **it must be checked
against the official transcript**, because unequal credit loads move it.

Two versions were rejected on the way. Six bare term GPAs in a row read as noise
to a recruiter scanning for one number, and put 3.33 in front of them. A version
saying "up from 3.33 to 3.85" ran past the margin and lost its "f": the bold
subset pdfTeX embedded has no standalone f, only the fi ligature, so any word
with a lone f renders with a hole in it. Check the glyph before writing a word.

Parentheses inside a PDF string have to be written as the escape `(` and
`)` as literal characters. Passed as raw bytes they close the string and
the operators print on the page.

**A table or a graph in the CV needs the LaTeX source.** In-place editing can
replace text inside an existing line; it cannot add rows, draw axes or reflow
the page. Either supply the `.tex`, or the CV gets rebuilt from scratch as a
source she owns.
