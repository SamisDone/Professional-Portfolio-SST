import { createElement, type ComponentType } from "react";

/**
 * Each page's code as its own chunk, loaded ahead of the navigation.
 *
 * A view transition captures the new page synchronously, so a page must be
 * ready before the navigation commits: this keeps its own cache rather than
 * using React.lazy, which would suspend inside that commit. `main.tsx` waits
 * for the first page, `TransitionRouter` waits for each later one, and a link
 * being pointed at, focused or touched starts the load early, so by the click
 * there is nothing left to wait for.
 */
type PageModule = { default: ComponentType };

const LOADERS: Record<string, () => Promise<PageModule>> = {
  HomePage: () => import("../pages/HomePage"),
  WorkPage: () => import("../pages/WorkPage"),
  CaseStudyPage: () => import("../pages/CaseStudyPage"),
  ExperiencePage: () => import("../pages/ExperiencePage"),
  ResearchPage: () => import("../pages/ResearchPage"),
  AboutPage: () => import("../pages/AboutPage"),
  ActivitiesPage: () => import("../pages/ActivitiesPage"),
  ContactPage: () => import("../pages/ContactPage"),
  RepositoriesPage: () => import("../pages/RepositoriesPage"),
  PrivacyPage: () => import("../pages/PrivacyPage"),
  CertificatesPage: () => import("../pages/CertificatesPage"),
  ContactSentPage: () => import("../pages/ContactSentPage"),
  NotFoundPage: () => import("../pages/NotFoundPage"),
};

const NAMED: Record<string, string> = {
  "/": "HomePage",
  "/work": "WorkPage",
  "/experience": "ExperiencePage",
  "/research": "ResearchPage",
  "/about": "AboutPage",
  "/activities": "ActivitiesPage",
  "/contact": "ContactPage",
  "/repositories": "RepositoriesPage",
  "/privacy": "PrivacyPage",
  "/certificates": "CertificatesPage",
  "/contact/sent": "ContactSentPage",
};

const loaded = new Map<string, ComponentType>();
const loading = new Map<string, Promise<void>>();

const nameFor = (pathname: string) => NAMED[pathname] ?? (/^\/work\/[^/]+$/.test(pathname) ? "CaseStudyPage" : "NotFoundPage");

/** The prerender has every page already; see pages.server.ts. */
export const registerPage = (name: string, page: ComponentType) => void loaded.set(name, page);

/** Nothing when the page is ready, or a promise that settles when it is. */
export function loadPage(pathname: string): Promise<void> | undefined {
  const name = nameFor(pathname);
  if (loaded.has(name)) return undefined;
  let pending = loading.get(name);
  if (!pending) {
    pending = LOADERS[name]().then(
      (m) => void loaded.set(name, m.default),
      (error) => {
        // Not cached, so the next attempt tries again.
        loading.delete(name);
        throw error;
      },
    );
    loading.set(name, pending);
  }
  return pending;
}

/** Starts fetching the page behind an internal link the visitor is heading for. */
function onIntent(event: Event) {
  const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
  if (link && link.origin === window.location.origin) loadPage(link.pathname)?.catch(() => {});
}

export function preloadOnIntent() {
  for (const type of ["pointerover", "focusin", "touchstart"]) {
    document.addEventListener(type, onIntent, { passive: true, capture: true });
  }
}

/** Renders a loaded page. Every navigation waits for `loadPage` first. */
export function RoutePage({ name }: { name: string }) {
  const page = loaded.get(name);
  return page ? createElement(page) : null;
}
