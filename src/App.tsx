import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Pager from "./components/Pager";
import Footer from "./components/Footer";
import RouteEffects from "./components/RouteEffects";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import CaseStudyPage from "./pages/CaseStudyPage";
import ExperiencePage from "./pages/ExperiencePage";
import ResearchPage from "./pages/ResearchPage";
import AboutPage from "./pages/AboutPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import ContactPage from "./pages/ContactPage";
import RepositoriesPage from "./pages/RepositoriesPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPage from "./pages/PrivacyPage";
import ContactSentPage from "./pages/ContactSentPage";
import { sectionFor } from "./lib/routes";

// The motion layer's specimens, for review in local development only. In a
// production build DEV is false, so the route and its chunk are dropped.
const MotionLabPage = import.meta.env.DEV ? lazy(() => import("./pages/MotionLabPage")) : null;

/** Every motion of the layer is switched on here, for the whole site; see
    src/motion.css. Taking one name out turns that motion off. */
const MOTION = "m-a1 m-a2 m-a3 m-a4 m-a5 m-a6 m-b1 m-b2 m-b3 m-b4 m-b5 m-b6 m-c1 m-e2 m-e3 m-e4";

/**
 * Everything inside the router, with no router of its own.
 *
 * Split out so it can be rendered twice: under `TransitionRouter` in the
 * browser (see main.tsx), and under `StaticRouter` by `entry-server.tsx`,
 * which prerenders each route to HTML at build time.
 *
 * The root carries `data-section`, which part of the site this page is in,
 * so the prerendered HTML is already in the right colour with JavaScript off.
 * Page changes are handled by lib/transitions.ts.
 */
export function AppShell() {
  const { pathname } = useLocation();

  return (
    <div data-section={sectionFor(pathname)} className={MOTION}>
      <a href="#main" className="skip-link btn btn-primary press">
        Skip to main content
      </a>
      <RouteEffects />
      {/* The one place a page change is announced. RouteEffects writes the
          new page's title here after each swap. */}
      <p id="route-announcer" aria-live="polite" aria-atomic="true" className="sr-only" />
      <div className="flex min-h-[100dvh] flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          {/* Outside ROUTES, like /repositories: no tab, no arrow-key stop. */}
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/repositories" element={<RepositoriesPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          {/* Where the contact form returns with JavaScript off. */}
          <Route path="/contact/sent" element={<ContactSentPage />} />
          {MotionLabPage && (
            <Route
              path="/motion-lab"
              element={
                <Suspense fallback={null}>
                  <MotionLabPage />
                </Suspense>
              }
            />
          )}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Pager />
        <Footer />
      </div>
    </div>
  );
}
