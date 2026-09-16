# Session context

A record of the working session that started on 16 September 2026 from a
recruiter-style review of the portfolio and ran into 17 September. Read
`CONTEXT.md` for the longer history of the project and its standing rules;
this file covers what was asked in this session, what was done, what was
decided and why, and what is still open.

Everything from this session was committed and pushed to `main` on 17 September
2026, except `github_repositories.csv`, which stays untracked.

---

## 1. Where it started

The session opened with a pasted "Portfolio Review Marksheet" scoring the site
about 6.5/10. Its main complaints were credibility gaps:

- CV said "Current CGPA: 3.85", which is also the highest single term.
- "300+ problems solved" linked to a Codeforces profile showing 83.
- The ACL entry was listed as a competition only, and described wrongly.
- PIERRA was called "in production" on a `vercel.app` URL.
- Projects: generic builds too high, stronger work missing.
- Experience copy full of internal jargon.
- No education or leadership on the site.

Every item in the marksheet was worked through. Some needed facts only the
owner has; those are listed under open items.

---

## 2. Facts established during the session

These came from the owner, from the CV PDF, from GitHub, or from public
sources, and were checked where they could be.

**Academic**
- Term GPAs: 3.45, 3.44, 3.43, 3.33, 3.58, 3.85 (L1-T1 to L3-T2). Six of eight
  terms done. Equal-credit mean is 3.51. The official cumulative has not been
  confirmed against a transcript.
- HSC: Viqarunnisa Noon College, 2021, GPA 5.00/5.00.

**Research**
- IEEE ICECTE 2026: "A Machine Learning and Explainable AI-Based Multiclass
  Police Fraud Prediction Scheme with SHAP Based Interpretability". Authors:
  M. Chowdhury, J. Islam, Md. A. I. Semon, S. Sarker, M. M. Barua, A. Akter
  (fourth of six).
- ACL 2026: "Still Loading@DravidianLangTech 2026: Telugu Prompt-Style Recovery
  using Multilingual Transformers". First author of five. Nine-class
  communicative style classification of Telugu text (text only, not
  multimodal). MuRIL system placed 7th, macro F1 0.1703 (chance about 0.11).
  Anthology: https://aclanthology.org/2026.dravidianlangtech-1.58/ . Code:
  https://github.com/Priyontee1713/Still-Loading-Prompt-Recovery-for-LLM-in-Telugu
- Thesis in progress: grapheme-aware Bangla and English scene text recognition.

**Roles (as given by the owner on 17 September)**
- CUET Computer Club: Vice President (Organizing)
- IEEE Computer Society, CUET Student Branch Chapter: General Secretary,
  Development Wing
- CUET Debating Society: Joint General Secretary
- CUET MUN Club: Joint Organizing Secretary

**Team versus solo (as given by the owner)**
- Greenlight and Microops were team builds. The other projects she owns were
  solo.

**Contribution levels on repositories she does not own** (GitHub contributor
counts, checked with `gh`)
- Unread (`Seyamalam/Huntrix_friction`): 9 of 59 commits, 4 contributors.
- Narrative Guard (`PratikDev/narrative-guard`): 3 of 129.
- Energy Monitoring System (`PratikDev/energy-monitoring-system`): 10 of 55.
- RentEase (`maha-shweta/Rent_Ease`): 6 of 102.
- KilnWatch (`PratikDev/illegal-brick-kiln-detector`): she does not appear in
  the contributor list (PratikDev 30, Seyamalam 17). The README credits
  PratikDev. She holds a SciBlitz 2.0 AI Hackathon certificate, and the demo
  URL is `sciblitz-ptsd-ibkd`, which matches the `ptsd` naming on Greenlight,
  her own team build. That suggests she was on the team but does not confirm
  it.
- OfflineOJ (`prism-rkive/OfflineOJ`): 1 of 52 and a one-line README. Not
  added.

**Repositories**
- 56 repos on the account; 35 public (42 rows in the owner's CSV including
  contributions, all public). The owner said: do not show private repos.
  Every URL on the site was checked without authentication and is public.
- `github.com/SamisDone/Finance-Tracker` redirects to `FinPulse`. They are
  the same repository, renamed.
- Dead deployments: `kandesk.vercel.app` (404), `finpulse.infinityfree.me`
  (times out), `ems-ptsd.vercel.app` (404).
- Two public repos (`Computer-Network-3-2`, `Software-Engineering-3-2`) hold
  large commercial textbook PDFs. Flagged to the owner as a copyright risk.

**Certificates** (public Drive folder linked from the CV:
https://drive.google.com/drive/folders/1ybnT2oynox40j0Shpx_cueBbHoDCKC4j )

Read so far:
- SciBlitz 2.0 AI Hackathon, IEEE CUET Student Branch with SheSTEM:
  certificate of achievement, names participation, no placing.
- MATRIX MUN Ver. 1, 16 and 17 March 2024: participation.
- SheSTEM TECHTalk, the first impromptu speech contest at CUET (IEEE CUET WIE
  Affinity Group): participation.
- IEEE CUET Student Branch webinar "Level Up Your Skill: CV Making & Social
  Communication Excellence": appreciation, not a competition.
- CUET CSE and Mysoft Heaven day-long workshop "Challenges of Quality Software
  Development with AI & IT Entrepreneurship", 25 July 2026: participation, not
  a competition.

Not yet read (attempts were blocked by permission prompts the owner says she
did not send): `IMG-20240329-WA0003.jpg`, `IMG-20260827-WA0000.jpg`,
`Scan_20260805_123633.jpg`, `MicroOps Hackathon.png`,
`THE_INFINITY_AI_BUILDFEST_2026_-_Participation_Certificate_Samonwita_Sarker (1).png`.
Course certificates in the folder (Docker, SQL, Python, Prompt Engineering,
LaTeX, freeCodeCamp Legacy JavaScript and Responsive Web Design, EDGE Python
and React) and `SPONSORSHIP-PROPOSAL-TLAP-2026.pdf` were not opened.
Downloaded copies are in the session scratchpad, not the repo.

---

## 3. What changed on the site

### Content (`src/data/content.ts`)
- Positioning line reworded ("how to make a model's predictions explainable").
- Proof strip: "300+" tile replaced by a computed count of projects with a
  live URL (links to `/work`). ACL tile says "7th at a DravidianLangTech shared
  task, ACL 2026" and links to the Anthology. `Proof` supports internal links.
- `profile.status`: "Software and ML research internships".
- Research ledger: both papers as Publications with full author lists and the
  owner's position; ACL entry has a Code link; thesis block added. Competition
  entries removed from it.
- Experience: jargon removed, PIERRA bullet made concrete, standfirst changed
  to "Where someone paid me for the work."
- About: education and the grade chart (moved from Research), beside the
  introduction. Leadership, competitions and certifications with the Drive
  link are on `/activities`.
- Competitions list now: 7th at the ACL shared task, and finalist at SciBlitz
  2.0 AI Hackathon, IUT Techathon, The Infinity AI BuildFest 2026,
  PoliMemeDecode Datathon (0.9008 macro F1) and MicroOps Hackathon. The
  finalist results are from the owner (17 September); the SciBlitz certificate
  itself names no placing. MATRIX MUN and the TECHTalk speech contest are not
  in it yet.
- Every project now has a `role`.

### Projects
- Rail (10, in this order): Greenlight, PIERRA, KilnWatch, MediHub, RIPHours,
  Unread, Narrative Guard, TabSaver, ResumeForge, StockMaster.
- Index (15): KanDesk, AnomLite, FinPulse, SortnPlay, Pixel Art Pad, Hangman,
  Glitch Breach, Task Scheduling, Page Replacement, Adaptive Round Robin,
  Microops, Energy Monitoring System, RentEase, Debate Marksheet (Bangla), ETL
  and Reporting Pipeline (SSIS/SSRS).
- Removed: the duplicate Finance Tracker entry.
- New screenshots in `public/shots/`: `kilnwatch`, `huntrix`,
  `narrativeguard` (jpg, webp, 700w webp). Existing shots were not re-encoded.
- `scripts/capture-shots.mjs` lists the new targets.

### New page
- `/repositories`: every project in one table with Code and Live links; rows
  for repositories she does not own show the role and owner. In `ROUTE_META`,
  not in `ROUTES`, so it has a real prerendered file but no nav slot or pager.
  The band under the rail now says "List them all" and links here.
- `/activities`: leadership, competitions and certifications, split off
  `/about` so both fit one screen. In `ROUTES` after About, so it is in the nav
  and the arrow-key sequence. `Entry` is shared between the two pages.

### Home page
- Rebuilt to be more striking: the name at poster scale on two lines with the
  surname in the italic accent, "CSE '27, CUET / Open to internships" above it,
  and a shuffling stack of real screenshots (Greenlight, PIERRA, TabSaver,
  RIPHours) in `ShotDeck.tsx` beside it. `Attribution.tsx` was deleted.
- Buttons are "See the work" and "Read the research"; the résumé button went,
  because the header already has the CV.
- Fixed in passing: `MaskText` rendered its italic accent upright under
  reduced motion and with JavaScript off (`not-italic` beat `italic`).

### CV rebuilt from source (17 September)
- The CV had no LaTeX source, so it was rebuilt as `cv/Samonwita_Sarker_CV.tex`
  with the same fonts (URW Palladio, Latin Modern Mono), sizes and spacing;
  line positions match the old PDF to within 0.2pt.
- Corrected: the ACL entry (text classification into nine styles, MuRIL 7th at
  0.1703 macro F1, links to the Anthology and the code instead of OpenReview);
  Finance Tracker became FinPulse (PHP 8, PDO, SQLite/MySQL, Chart.js, solo);
  MediHub's AI is described as report summaries, as the code does, not symptom
  assessments; "300+ coding challenges" removed from Certifications; TypeScript
  added to Languages; the AI skills line lists Transformers and Explainable AI
  (SHAP) in place of "LLM Prompt Recovery"; the datathon entry gained its
  models and score; the Debating line says she helps run the society.
- Pages now break only between entries, and REFERENCES lines up with the other
  section headings.
- The site's MediHub copy claimed symptom routing to departments. The repo has
  no such feature; it summarises uploaded medical reports with Gemini. The
  case study was corrected to match.

### Type consistency pass
- Audited the computed type on every route and in the project dialog, then
  collapsed it onto one scale (recorded in the README): 13.5px became 14px,
  12.5px became 13px, 11.5px and 13-14px mono became 12px, the pager hint went
  from 10px to 11px, and every uppercase label is mono at 0.16em tracking.
- Fixed elements off the system: the dialog's Problem/What I built/Outcome
  labels were uppercase sans; the repositories table header was bold; the 404
  button was mono; About's buttons were 13px against 14px everywhere else;
  Experience company names were 32px against 33.6px for the same job in the
  dialog; project figures were semibold sans; "The grades" and "Everything
  else" were 16px next to 18px subsection headings; paper titles grew to 16px.
- Dialog kind, year, role and stack, and the grade chart's figures, are mono
  now, like every other date, kind and figure.

### Components and behaviour
- Rail cards: stretched button for the case study, plus Live and Code links in
  the footer; `data-card` hook; title arrow replaces "View case".
- Hover bug fixed: the rail clipped the card's top border on its 4px lift,
  because both `overflow-hidden` and the edge-fade mask clip at the rail box.
  The rail now has `pt-2` with `mt-3` in place of `mt-5`.
- Pager: `aria-label` per button, hint spans `aria-hidden`, trailing space so
  scrapers do not read "keyWork"; on pages that scroll it shows only at the
  bottom.
- Header wordmark: full name at `md` and up, initials below.
- `MaskText` gained `italicFrom` for one italic accent ("Build, then *ask
  why*." on About).

### Typography
- Instrument Serif (display, never below 28px), Instrument Sans (body and UI),
  DM Mono (labels). Self-hosted woff2 with OFL licences in `src/fonts`. Lobster
  Two and Bricolage Grotesque removed.
- The owner's guide was written for Next.js; this is Vite, so fonts are
  self-hosted instead of `next/font`. The guide's colour tokens were not
  applied; the palette is unchanged. No global `p { max-width }`.
- Instrument Serif had been rejected earlier in the project's history; this
  was a deliberate reversal by the owner.
- Four stale short-screen selectors fixed (`[data-case] h3`,
  `[data-case] > div > button`, `#research li h4`, `.index-band h3`).
- `.page-pad` floor lowered in the 790px block; at 720px the clamp floor, not
  the `vh` term, was what applied.
- OG image regenerated with the new fonts; `make-og.mjs` reads the computed
  deployed count.

### Meta
- Route descriptions updated and kept to 160 characters or fewer; `/repositories`
  added; structured data description in `index.html` reworded.

### Docs
- `README.md` and `CONTEXT.md` updated for all of the above.

---

## 4. What changed in the CV (`public/Samonwita_Sarker_CV.pdf`)

The CV is pdfTeX output with no `.tex` source on the account. Edits were made
in the content streams with pypdf and checked by rendering the page.

- Education line: "Current CGPA: 3.85" became "CGPA: 3.51/4.00, rising:
  latest term 3.85". Two earlier attempts were rejected: a list of all six
  term GPAs (the owner said a recruiter would reject it), and "up from 3.33 to
  3.85" (overran the margin and lost its "f").
- Leadership (page 3): Computer Club and Debating Society titles updated to the
  owner's roles; new IEEE CS Development Wing entry added before References;
  References and its rule moved down to make room. Date kerns were recomputed
  from the embedded font widths so dates stay right-aligned.

Constraints learned while editing:
- The bold subset has no lowercase `f` or `q`. The regular subset has no `5`,
  `8`, `K`, `Y` or `Z`.
- Parentheses inside a PDF string must be written as the text `\050` and
  `\051`, not raw bytes.
- A table or graph cannot be added without re-typesetting. `pdflatex` (MiKTeX)
  is installed if the CV is ever rebuilt as source.

Backups of the CV from before the edits are in the session scratchpad.

---

## 5. Verification state at the end of the session

- `tsc -b` and `oxlint` clean; `npm run build` succeeds and prerenders every
  route.
- One-screen fit: every route in the sequence fits at 1920x1080, 1536x864,
  1440x900, 1366x768 and 1280x720, including `/about` and `/activities` after
  the split. Measured with Playwright on the built site.
- No horizontal page scroll at any tested width; `/repositories` scrolls its
  table inside its own container on phones.
- Colour contrast passes WCAG AA on every route.
- All 13 live links and every repo link on the site return 200 without auth.
- No em-dashes and no "keyWork" style joins in the prerendered text.

The last competitions edit was built but not re-screenshotted.

---

## 6. Open items

Needs the owner:
1. **KilnWatch role.** Currently "Contributor". Confirm whether she was on the
   SciBlitz team and what she did, or remove it.
2. **Narrative Guard role.** 3 of 129 commits; labelled "Contributor". Confirm
   or change.
3. **CGPA.** Check 3.51 against the official transcript before the CV is sent.
4. ~~**Placings.**~~ Resolved: the owner confirmed finalist at every event
   that was marked "Participant".
5. **Remaining certificates.** Five files in the Drive folder have not been
   read. Either allow reading them or list what they are.
6. **Add MATRIX MUN and the TECHTalk speech contest** to Competitions, if she
   wants them there.
7. **CV leadership dates.** Computer Club and Debating still show
   (2023 – Present), which was membership, not the role. IEEE shows (Present)
   with no start year.
8. **CV descriptions.** The IEEE line is a placeholder that repeats the title.
   The Debating line still says "Assisted in coordinating", which undersells a
   Joint General Secretary.
9. **CV links.** The ACL "[Paper]" still goes to OpenReview; the Finance
   Tracker "[GitHub]" goes to the renamed FinPulse repo. Offered to repoint.
9a. **CV copy that contradicts the site.** The ACL entry and the skills line
   still say "multimodal" (the task is text only); page 3 still claims "300+
   coding challenges solved", which the site dropped; Finance Tracker is
   described with PostgreSQL, but FinPulse is PHP and MySQL; MediHub claims
   "preliminary symptom assessments", where the site says routing, not
   diagnosis. Needs replacement wording that fits the embedded font subsets.
9b. **Certificates without a file.** "Full-Stack Development, freeCodeCamp"
   and "Data Science and Python, DataCamp" are named on the site and the CV
   but were not among the files seen in the Drive folder.
10. **KanDesk deployment** is gone; redeploy to put it back on the rail.
11. **Old Netlify portfolio** (`samonwitaportfolio.netlify.app`) still live.
12. **Textbook PDFs** in two public repos.
13. **Contact form** still needs an end-to-end test on the deployed site.

Unavailable in this environment: the Gmail, Google Calendar and Ninout
connectors need authorising in claude.ai connector settings before they can be
used.
