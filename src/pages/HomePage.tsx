import Page from "../components/Page";
import Hero from "../components/Hero";
import Proof from "../components/Proof";
import Flagships from "../components/Flagships";

export default function HomePage() {
  return (
    <Page title="Samonwita Sarker">
      <Hero />
      <Proof />
      <Flagships />
    </Page>
  );
}
