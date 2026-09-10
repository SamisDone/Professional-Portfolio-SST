import { useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import { shouldShowIntro } from "../lib/intro";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SelectedWorks from "../components/SelectedWorks";
import About from "../components/About";
import Publications from "../components/Publications";
import Explorations from "../components/Explorations";
import Stats from "../components/Stats";
import CgpaProgress from "../components/CgpaProgress";
import Contact from "../components/Contact";

export default function Index() {
  // Evaluated once on mount: skipped on repeat visits within a session and for
  // anyone who has asked their system to reduce motion.
  const [isLoading, setIsLoading] = useState(shouldShowIntro);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <Navbar />
      <main id="main">
        <Hero />
        <SelectedWorks />
        <About />
        <Publications />
        <Explorations />
        <Stats />
        <CgpaProgress />
        <Contact />
      </main>
    </>
  );
}
