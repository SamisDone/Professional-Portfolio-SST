import Page from "../components/Page";
import Hero from "../components/Hero";
import Proof from "../components/Proof";
import Flagships from "../components/Flagships";
import Credentials from "../components/Credentials";
import JsonLd from "../components/JsonLd";
import { personAndWebsite } from "../lib/structured";

export default function HomePage() {
  return (
    <Page title="Samonwita Sarker">
      <Hero />
      <Proof />
      <Flagships />
      <Credentials />
      <JsonLd data={personAndWebsite()} />
    </Page>
  );
}
