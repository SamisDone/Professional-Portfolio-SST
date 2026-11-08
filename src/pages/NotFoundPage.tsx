import Page from "../components/Page";
import { Button } from "../components/ui";
import DecodeText from "../components/DecodeText";

export default function NotFoundPage() {
  return (
    <Page title="Page not found">
      <section className="shell tier-a">
        <p aria-hidden className="t-display">
          404
        </p>
        {/* One band per line, as wide as its words, like the name on Home. A
            single band with a max-width kept that width when the text wrapped,
            leaving a run of empty orange after "That page". */}
        <DecodeText tabIndex={-1} className="t-h1 mt-6">
          <span className="band">That page</span> <span className="band">does not exist.</span>
        </DecodeText>
        <div className="mt-8">
          <Button to="/work" variant="primary">
            See the work
          </Button>
        </div>
      </section>
    </Page>
  );
}
