/**
 * Which part of the site a page belongs to. Each one has its own colour, like
 * the coloured dividers in a ring binder; `src/index.css` maps the name to
 * `--section` and `--section-tint`, and nothing reads a colour by name.
 */
export type Section = "orange" | "blue" | "green" | "pink";

export type RouteDef = { path: string; label: string; section: Section };

/** Reading order. The file tabs, the arrow keys and the pager walk this list. */
export const ROUTES: RouteDef[] = [
  { path: "/", label: "Home", section: "orange" },
  { path: "/work", label: "Work", section: "orange" },
  { path: "/experience", label: "Experience", section: "blue" },
  { path: "/research", label: "Research", section: "green" },
  { path: "/about", label: "About", section: "pink" },
  { path: "/activities", label: "Activities", section: "pink" },
  { path: "/contact", label: "Get in touch", section: "orange" },
];

/**
 * The section of any path. Routes in `ROUTES` carry their own; everything
 * outside it (case studies at /work/:slug, /repositories, a 404) is orange,
 * the colour of Work.
 */
export function sectionFor(pathname: string): Section {
  return ROUTES.find((r) => r.path === pathname)?.section ?? "orange";
}

export function routeIndex(pathname: string): number {
  return ROUTES.findIndex((r) => r.path === pathname);
}

export function neighbours(pathname: string) {
  const i = routeIndex(pathname);
  if (i === -1) return { prev: undefined, next: undefined };
  return { prev: ROUTES[i - 1], next: ROUTES[i + 1] };
}
