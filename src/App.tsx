import Header from "./components/Header";
import Hero from "./components/Hero";
import Proof from "./components/Proof";
import Work from "./components/Work";
import Research from "./components/Research";
import About from "./components/About";
import Trajectory from "./components/Trajectory";
import OtherWork from "./components/OtherWork";
import Contact from "./components/Contact";

export default function App() {
  return (
    <>
      <a href="#work" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main>
        <Hero />
        <Proof />
        <Work />
        <Research />
        <About />
        <Trajectory />
        <OtherWork />
        <Contact />
      </main>
    </>
  );
}
