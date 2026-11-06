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
import MotionLabPage from "./pages/MotionLabPage";
import { sectionFor } from "./lib/routes";

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
    <div data-section={sectionFor(pathname)}>
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
          {/* The motion layer's specimens, for review. noindex, no links in. */}
          <Route path="/motion-lab" element={<MotionLabPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Pager />
        <Footer />
      </div>
    </div>
  );
}
