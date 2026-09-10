export type RouteDef = { path: string; label: string };

/** Reading order. Arrow keys and the pager walk this list. */
export const ROUTES: RouteDef[] = [
  { path: "/", label: "Home" },
  { path: "/work", label: "Work" },
  { path: "/experience", label: "Experience" },
  { path: "/research", label: "Research" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Get in touch" },
];

export function routeIndex(pathname: string): number {
  return ROUTES.findIndex((r) => r.path === pathname);
}

export function neighbours(pathname: string) {
  const i = routeIndex(pathname);
  if (i === -1) return { prev: undefined, next: undefined };
  return { prev: ROUTES[i - 1], next: ROUTES[i + 1] };
}
