import { useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SelectedWorks from "../components/SelectedWorks";
import Publications from "../components/Publications";
import Explorations from "../components/Explorations";
import Stats from "../components/Stats";
import CgpaProgress from "../components/CgpaProgress";
import Contact from "../components/Contact";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <Navbar />
      <main>
        <Hero />
        <SelectedWorks />
        <Publications />
        <Explorations />
        <Stats />
        <CgpaProgress />
        <Contact />
      </main>
    </>
  );
}
