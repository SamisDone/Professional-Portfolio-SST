import Page from "../components/Page";
import Research from "../components/Research";
import Trajectory from "../components/Trajectory";

export default function ResearchPage() {
  return (
    <Page title="Research" center>
      <Research aside={<Trajectory bare />} />
    </Page>
  );
}
