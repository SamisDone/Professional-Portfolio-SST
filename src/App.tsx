import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Pager from "./components/Pager";
import Footer from "./components/Footer";
import RouteEffects from "./components/RouteEffects";
import Inspect from "./components/Inspect";
import TerminalCrumb from "./components/TerminalCrumb";
import { RoutePage } from "./lib/pages";
import { sectionFor } from "./lib/routes";

// The motion layer's specimens, for review in local development only. In a
// production build DEV is false, so the route and its chunk are dropped.
const MotionLabPage = import.meta.env.DEV ? lazy(() => import("./pages/MotionLabPage")) : null;

/** Every motion of the layer is switched on here, for the whole site; see
    src/motion.css. Taking one name out turns that motion off. */
const MOTION =
  "m-a1 m-a2 m-a3 m-a4 m-a6 m-b1 m-b2 m-b3 m-b4 m-b5 m-b6 m-c1 m-e2 m-f1 m-f2 m-f3 m-f5 m-f7";

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
      {/* F4: the sheet a screenshot opens in. */}
      <Inspect />
      <TerminalCrumb />
      {/* The one place a page change is announced. RouteEffects writes the
          new page's title here after each swap. */}
      <p id="route-announcer" aria-live="polite" aria-atomic="true" className="sr-only" />
      <div className="flex min-h-[100dvh] flex-col">
        <Header />
        {/* The part of the page that slides on a page change. */}
        <div className="page-stage flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<RoutePage name="HomePage" />} />
          <Route path="/work" element={<RoutePage name="WorkPage" />} />
          {/* Outside ROUTES, like /repositories: no tab, no arrow-key stop. */}
          <Route path="/work/:slug" element={<RoutePage name="CaseStudyPage" />} />
          <Route path="/experience" element={<RoutePage name="ExperiencePage" />} />
          <Route path="/research" element={<RoutePage name="ResearchPage" />} />
          <Route path="/about" element={<RoutePage name="AboutPage" />} />
          <Route path="/activities" element={<RoutePage name="ActivitiesPage" />} />
          <Route path="/contact" element={<RoutePage name="ContactPage" />} />
          <Route path="/repositories" element={<RoutePage name="RepositoriesPage" />} />
          <Route path="/privacy" element={<RoutePage name="PrivacyPage" />} />
          <Route path="/certificates" element={<RoutePage name="CertificatesPage" />} />
          {/* Where the contact form returns with JavaScript off. */}
          <Route path="/contact/sent" element={<RoutePage name="ContactSentPage" />} />
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
          <Route path="*" element={<RoutePage name="NotFoundPage" />} />
        </Routes>
        <Pager />
        </div>
        <Footer />
      </div>
    </div>
  );
}
