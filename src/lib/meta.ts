/**
 * Per-route title and description.
 *
 * Read in two places, which is the point of keeping it here rather than in a
 * component: `Page` sets it on the document as the visitor navigates, and the
 * `route-meta` plugin in `vite.config.ts` stamps it into a real HTML file per
 * route at build time.
 *
 * The build-time half is the half that matters. This is a single-page app, so
 * every route is served the same `index.html`; a crawler that does not run
 * JavaScript, which is most social-preview crawlers, would otherwise see one
 * identical title and description for every page.
 *
 * No em-dashes here either. They were in the old title, where the check for
 * them never looked, so they showed in the browser tab and in search results.
 */
export type PageMeta = {
  /** The <title>. Ends with the name, because search results truncate the end. */
  title: string;
  /** Under about 160 characters, or search results cut it off. */
  description: string;
};

const NAME = "Samonwita Sarker";

/**
 * Two fields in parallel, not two job titles side by side.
 *
 * "Full-stack developer and AI researcher" asked the reader to pick which one
 * I am, and a recruiter screening against one opening picks neither. Naming
 * the two fields instead makes the pair the position. "Full-stack" stays in
 * because it is the word people actually search and filter on.
 *
 * The description leads with things that exist and are running, and puts the
 * credential last. A list of what someone has is weaker than a list of what
 * they built.
 */
export const DEFAULT_META: PageMeta = {
  title: `${NAME} | Full-stack engineering and explainable AI`,
  description:
    "Two Chrome extensions on the Web Store, a bilingual site shipped for a Montreal design firm, and explainable AI research peer reviewed at IEEE. CSE '27 at CUET.",
};

export const ROUTE_META: Record<string, PageMeta> = {
  "/": DEFAULT_META,
  "/work": {
    title: `Projects | ${NAME}`,
    description:
      "Twelve case studies, led by an AI hospital platform, a privacy-first Chrome extension, a paid bilingual client site and a browser-driven robot arm.",
  },
  "/experience": {
    title: `Experience | ${NAME}`,
    description:
      "Industrial attachment at BdREN Innovation - Cortex, AI evaluation contracting at Fleet AI, and freelance web development for a Montreal design firm.",
  },
  "/research": {
    title: `Research and publications | ${NAME}`,
    description:
      "A co-authored IEEE paper on explainable AI with SHAP, a first-author system paper placing 7th at DravidianLangTech ACL 2026, and a Bangla scene text thesis.",
  },
  "/about": {
    title: `About | ${NAME}`,
    description:
      "CSE undergraduate at CUET, graduating 2027, CGPA 3.51 with a latest term of 3.85. Full-stack engineering and explainable AI research, and the stack behind both.",
  },
  "/activities": {
    title: `Leadership and competitions | ${NAME}`,
    description:
      "Vice President (Organizing) of the CUET Computer Club and three more club roles, plus hackathons, a datathon final, a 7th-place shared task and certificates.",
  },
  /*
   * Not in `ROUTES`, so it is not in the nav and the arrow keys skip it, but it
   * is here so the build emits it as a real file with its own title and puts it
   * in the sitemap. A page that lists every project is worth indexing.
   */
  "/repositories": {
    title: `All projects and source | ${NAME}`,
    description:
      "Every project in one table, with the source repository for each and a live demo where one exists, including the ones built on other people's repositories.",
  },
  "/contact": {
    title: `Contact | ${NAME}`,
    description:
      "Open to software engineering and ML job opportunities, remote now or on site after graduating in 2027. Reach me by email, on LinkedIn, or through the form.",
  },
};

export const NOT_FOUND_META: PageMeta = {
  title: `Page not found | ${NAME}`,
  description: "That page does not exist. Everything else is one click away.",
};

export function metaFor(pathname: string): PageMeta {
  return ROUTE_META[pathname] ?? NOT_FOUND_META;
}
