import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Backdrop from "./components/Backdrop";
import Pager from "./components/Pager";
import Footer from "./components/Footer";
import PageTransition, { RouteEffects } from "./components/PageTransition";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import ExperiencePage from "./pages/ExperiencePage";
import ResearchPage from "./pages/ResearchPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

function Routed() {
  const location = useLocation();

  return (
    // mode="wait" so the old page unmounts before the new one arrives, which is
    // what keeps the swap hidden behind the curtain.
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * Everything inside the router, with no router of its own.
 *
 * Split out so it can be rendered twice: under `BrowserRouter` in the browser,
 * and under `StaticRouter` by `entry-server.tsx`, which prerenders each route
 * to HTML at build time. Keeping the router here would mean the prerender
 * needed a real browser to resolve a location.
 */
export function AppShell() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Backdrop />
      <RouteEffects />
      <PageTransition />
      {/* Everything above the backdrop needs a stacking context of its own. */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <Header />
        <Routed />
        <Footer />
      </div>
      <Pager />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
