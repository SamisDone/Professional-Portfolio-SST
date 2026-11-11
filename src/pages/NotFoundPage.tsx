import { useSyncExternalStore } from "react";
import { useLocation } from "react-router-dom";
import Page from "../components/Page";
import { Button, Label, TextLink } from "../components/ui";
import DecodeText from "../components/DecodeText";
import { ROUTES } from "../lib/routes";

/** Long enough to recognise the address, short enough to stay a line or two. */
const PATH_MAX = 80;
/** The address never changes under a mounted page; a new one remounts it. */
const subscribeNever = () => () => {};

/**
 * The 404, filed like everything else on the site: the address that was
 * asked for, the finding, and the pages that are on file, so a wrong link
 * ends on the index and not on a single button in an empty screen.
 */
export default function NotFoundPage() {
  const { pathname } = useLocation();
  // 404.html is prerendered once and served for every unknown address, so the
  // address is only known in the browser: empty in the prerendered page and
  // while it hydrates, then the real one. Its line is there from the start,
  // so nothing moves when it arrives.
  const asked = useSyncExternalStore(
    subscribeNever,
    () => (pathname.length > PATH_MAX ? `${pathname.slice(0, PATH_MAX)}...` : pathname),
    () => "",
  );

  return (
    <Page title="Page not found">
      <div className="shell tier-a grid gap-y-12 lg:grid-cols-12 lg:gap-x-8">
        <section className="lg:col-span-7">
          <p aria-hidden data-text="404" className="t-display glitch">
            404
          </p>
          {/* One band per line, as wide as its words, like the name on Home. A
              single band with a max-width kept that width when the text wrapped,
              leaving a run of empty orange after "That page". */}
          <DecodeText tabIndex={-1} className="t-h1 mt-6">
            <span className="band">That page</span> <span className="band">does not exist.</span>
          </DecodeText>
          <dl className="m-0 mt-8 grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2">
            <Label as="dt">Asked for</Label>
            <dd className="t-label m-0 min-h-4 break-all normal-case text-ink">{asked}</dd>
            <Label as="dt">On file</Label>
            <dd className="t-label m-0 text-ink">No record</dd>
          </dl>
          <div className="mt-8">
            <Button to="/work" variant="primary">
              See the work
            </Button>
          </div>
        </section>

        <nav aria-labelledby="on-file" className="lg:col-span-5 lg:pt-2">
          <h2 id="on-file" className="t-h3">
            What is on file
          </h2>
          <ol className="m-0 mt-4 list-none p-0">
            {ROUTES.map((route, i) => (
              <li
                key={route.path}
                className="tint-row flex items-baseline justify-between gap-4 border-t border-ink py-3 first:border-t-2 last:border-b"
              >
                <Label as="span">
                  {String(i + 1).padStart(2, "0")}
                </Label>
                <TextLink to={route.path} className="t-small font-semibold">
                  {route.label}
                </TextLink>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </Page>
  );
}
