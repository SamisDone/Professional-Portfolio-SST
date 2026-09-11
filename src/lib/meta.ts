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
 * identical title and description for all six pages.
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

export const DEFAULT_META: PageMeta = {
  title: `${NAME} | Full-stack developer and AI researcher`,
  description:
    "CSE undergraduate at CUET. Two Chrome extensions published on the Web Store, a co-authored IEEE paper on explainable AI, and 7th place at an ACL 2026 shared task.",
};

export const ROUTE_META: Record<string, PageMeta> = {
  "/": DEFAULT_META,
  "/work": {
    title: `Projects | ${NAME}`,
    description:
      "Eight builds with full case studies: a browser-driven robot arm, two published Chrome extensions, an AI hospital platform, and a production bilingual site for a Montreal firm.",
  },
  "/experience": {
    title: `Experience | ${NAME}`,
    description:
      "Generalist contractor at Fleet AI, authoring long-horizon agentic AI evaluation tasks and QA-reviewing other contributors' work. Freelance web development for a Montreal design firm.",
  },
  "/research": {
    title: `Research and publications | ${NAME}`,
    description:
      "A co-authored IEEE paper on explainable AI using SHAP interpretability, first-author work placing 7th at DravidianLangTech ACL 2026, and a datathon finalist placing.",
  },
  "/about": {
    title: `About | ${NAME}`,
    description:
      "CSE undergraduate at CUET, graduating 2027. Full-stack engineering on one side, explainable AI research on the other, and a preference for problems where both have to hold up.",
  },
  "/contact": {
    title: `Contact | ${NAME}`,
    description:
      "Open to internships and research collaborations. Reach me by email, on LinkedIn, or through the form.",
  },
};

export const NOT_FOUND_META: PageMeta = {
  title: `Page not found | ${NAME}`,
  description: "That page does not exist. Everything else is one click away.",
};

export function metaFor(pathname: string): PageMeta {
  return ROUTE_META[pathname] ?? NOT_FOUND_META;
}
