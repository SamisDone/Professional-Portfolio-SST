import Page from "../components/Page";
import Research from "../components/Research";
import JsonLd from "../components/JsonLd";
import { scholarlyArticles } from "../lib/structured";

export default function ResearchPage() {
  return (
    <Page title="Research">
      <Research />
      <JsonLd data={scholarlyArticles()} />
    </Page>
  );
}
