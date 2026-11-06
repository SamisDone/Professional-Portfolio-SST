/**
 * Per-route title, description and social card.
 *
 * Read in two places: `Page` sets it on the document as the visitor
 * navigates, and the `route-meta` plugin in `vite.config.ts` stamps it into a
 * real HTML file per route at build time, which is what a crawler reads.
 *
 * Rules, enforced after every build by scripts/check-seo.mjs:
 *   - titles are "Page name / Samonwita Sarker", and unique;
 *   - descriptions are 120 to 160 characters, and unique;
 *   - no em or en dashes, like every other string on the site.
 */
import { featured, notable, otherWork, type Project } from "../data/content.ts";
import { SITE_NAME as NAME } from "./site.ts";

export type PageMeta = {
  title: string;
  description: string;
  /** The words on this page's social card, and its alt text. */
  heading: string;
  /** Kept out of search and out of the sitemap. */
  noindex?: boolean;
};

const page = (heading: string, description: string, extra: Partial<PageMeta> = {}): PageMeta => ({
  title: `${heading} / ${NAME}`,
  description,
  heading,
  ...extra,
});

/** "A, B and C". */
const list = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

/**
 * A case study's description, built from its own entry in content.ts: the
 * summary, then what kind of project and when, then the stack, then whether it
 * is live, each added only while the whole stays within 160 characters.
 * `metaDescription` on the project overrides it where that reads badly.
 */
export function caseDescription(p: Project) {
  if (p.metaDescription) return p.metaDescription;
  const parts = [
    p.summary,
    `${p.kind}, ${p.year}.`,
    `Built with ${list(p.stack.slice(0, 3))}.`,
    p.live ? "Live, with the source on GitHub." : "Source on GitHub.",
  ];
  let out = parts[0];
  for (const part of parts.slice(1)) {
    if (`${out} ${part}`.length <= 160) out = `${out} ${part}`;
  }
  return out;
}

const workCount = [...featured, ...notable].length;

export const DEFAULT_META: PageMeta = page(
  "Full-stack engineering and explainable AI",
  "Two Chrome extensions on the Web Store, a bilingual site shipped for a Montreal design firm, and explainable AI research peer reviewed at IEEE. CSE '27 at CUET.",
);

export const ROUTE_META: Record<string, PageMeta> = {
  "/": DEFAULT_META,
  "/work": page(
    "Projects",
    `${workCount} projects, each with its own case study, led by a privacy-first Chrome extension, a paid bilingual client site and a browser-driven robot arm.`,
  ),
  "/experience": page(
    "Experience",
    "Team lead on a crawler team at BdREN Innovation (Cortex), AI evaluation contracting at Fleet AI, and freelance web development for a Montreal design firm.",
  ),
  "/research": page(
    "Research and publications",
    "A co-authored IEEE paper on explainable AI with SHAP, a first-author system paper placing 7th at DravidianLangTech ACL 2026, and a Bangla scene text thesis.",
  ),
  "/about": page(
    "About",
    "CSE undergraduate at CUET, graduating 2027, CGPA 3.51 with a latest term of 3.85. Full-stack engineering and explainable AI research, and the stack behind both.",
  ),
  "/activities": page(
    "Leadership and competitions",
    "Vice President (Organizing) of the CUET Computer Club and three more club roles, plus hackathons, a datathon final, a 7th-place shared task and certificates.",
  ),
  "/contact": page(
    "Contact",
    "Open to software engineering and ML job opportunities, remote now or on site after graduating in 2027. Reach me by email, on LinkedIn, or through the form.",
  ),
  /*
   * Outside `ROUTES`, so not in the tabs and skipped by the arrow keys, but
   * here so the build emits each as a real file with its own metadata.
   */
  "/repositories": page(
    "All projects and source",
    "Every project in one table, with the source repository for each and a live demo where one exists, including the ones built on other people's repositories.",
  ),
  "/privacy": page(
    "Privacy",
    "What this site collects and why: the contact form's fields and where they go, what the analytics records, whether any cookies are set, and how to reach me.",
  ),
  /* The page the contact form returns to when JavaScript is off. Reached only
     by posting the form, so it is kept out of search and the sitemap. */
  "/contact/sent": page(
    "Message sent",
    "Your message is on its way. This is the page the contact form returns to after a successful send, with the ways back to the work, the research and the CV.",
    { noindex: true },
  ),
};

/* The motion layer's review page, in local development only: a production
   build has no such route, so it gets no HTML file, sitemap entry or card.
   Read through a cast, because vite.config.ts loads this file in Node. */
if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
  ROUTE_META["/motion-lab"] = page(
    "Motion lab",
    "Every motion of the site's motion layer as a labelled specimen with a replay button, for review before it is rolled out. Not part of the site's navigation.",
    { noindex: true },
  );
}

/* One page per project at /work/slug, outside `ROUTES` like /repositories. */
for (const p of [...featured, ...notable, ...otherWork]) {
  ROUTE_META[`/work/${p.slug}`] = {
    title: `${p.title}, ${p.kind} / ${NAME}`,
    description: caseDescription(p),
    heading: p.title,
  };
}

export const NOT_FOUND_META: PageMeta = page(
  "Page not found",
  "That page does not exist on this site. The work, the research, the experience and a way to get in touch are each one click away from here.",
  { noindex: true },
);

export function metaFor(pathname: string): PageMeta {
  return ROUTE_META[pathname] ?? NOT_FOUND_META;
}

/**
 * The file name of a page's social card in public/og, written by
 * scripts/make-og.mjs. "/" is "home", "/work/dimsum" is "work-dimsum".
 */
export const ogKey = (path: string) => (path === "/" ? "home" : path.slice(1).replaceAll("/", "-"));
