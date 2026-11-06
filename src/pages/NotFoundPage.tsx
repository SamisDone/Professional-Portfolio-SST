import Page from "../components/Page";
import { Button } from "../components/ui";

export default function NotFoundPage() {
  return (
    <Page title="Page not found">
      <section className="shell tier-a">
        <p aria-hidden className="t-display">
          404
        </p>
        <h1 tabIndex={-1} className="t-h1 band mt-6 max-w-[18ch]">
          That page does not exist.
        </h1>
        <div className="mt-8">
          <Button to="/work" variant="primary">
            See the work
          </Button>
        </div>
      </section>
    </Page>
  );
}
