import { Link } from "react-router-dom";
import Page from "../components/Page";

export default function NotFoundPage() {
  return (
    <Page title="Page not found">
      <section className="mx-auto flex min-h-[60vh] max-w-shell flex-col justify-center px-5 py-24 sm:px-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
          404
        </p>
        <h1 className="mt-6 max-w-[18ch] text-[clamp(2.4rem,5.8vw,4.2rem)] font-display leading-[1.04] text-ink">
          That page does not exist.
        </h1>
        <div className="mt-10">
          <Link
            to="/work"
            className="inline-flex bg-accent-solid px-6 py-3.5 text-sm font-medium text-on-accent transition-transform hover:-translate-y-[2px] active:translate-y-0"
          >
            See the work
          </Link>
        </div>
      </section>
    </Page>
  );
}
