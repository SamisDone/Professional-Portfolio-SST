/*
 * Every page, bundled in, for the prerender only: renderToString cannot wait
 * for a chunk. Imported by entry-server.tsx and nothing else.
 */
import { registerPage } from "./pages";
import HomePage from "../pages/HomePage";
import WorkPage from "../pages/WorkPage";
import CaseStudyPage from "../pages/CaseStudyPage";
import ExperiencePage from "../pages/ExperiencePage";
import ResearchPage from "../pages/ResearchPage";
import AboutPage from "../pages/AboutPage";
import ActivitiesPage from "../pages/ActivitiesPage";
import ContactPage from "../pages/ContactPage";
import RepositoriesPage from "../pages/RepositoriesPage";
import PrivacyPage from "../pages/PrivacyPage";
import CertificatesPage from "../pages/CertificatesPage";
import ContactSentPage from "../pages/ContactSentPage";
import NotFoundPage from "../pages/NotFoundPage";

for (const [name, page] of Object.entries({
  HomePage,
  WorkPage,
  CaseStudyPage,
  ExperiencePage,
  ResearchPage,
  AboutPage,
  ActivitiesPage,
  ContactPage,
  RepositoriesPage,
  PrivacyPage,
  CertificatesPage,
  ContactSentPage,
  NotFoundPage,
})) {
  registerPage(name, page);
}
