import { certifications, competitions, leadership } from "../data/content";
import Entry from "./Entry";
import { Button } from "./ui";

/**
 * Club roles, competitions and certificates, as two ledgers side by side
 * built from the same entry row as About.
 */
/** Certificates shown on a phone before "Show all". */
const PHONE_CERTS = 5;

export default function Activities() {
  return (
    <>
      <section className="shell tier-a">
        <h1 tabIndex={-1} className="t-h1 band max-w-[18ch]">
          Outside the terminal.
        </h1>
        <div className="mt-6">
          <Button href={certifications.href} variant="primary">
            View all certificates
          </Button>
        </div>
      </section>

      <div className="shell tier-b grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <section aria-labelledby="leadership">
            <h2 id="leadership" className="t-h3">
              Leadership
            </h2>
            <ol data-ledger="top" className="m-0 mt-4 list-none p-0">
              {leadership.map((l) => (
                <Entry key={l.org} title={l.role} meta={l.org} period={l.period} note={l.note} />
              ))}
            </ol>
          </section>

          <section aria-labelledby="certifications" className="mt-12">
            <h2 id="certifications" className="t-h3">
              Certifications
            </h2>
            {/* On a phone the list stops at five; the rest open in place from
                a native disclosure, so every certificate is still in the HTML.
                From sm the whole list shows and the disclosure is not drawn. */}
            <ul data-ledger="bottom" className="m-0 mt-4 grid list-none border-t-2 border-ink p-0 sm:grid-cols-2 sm:gap-x-6">
              {certifications.items.map((c, i) => (
                <li key={c} className={`tint-row t-small border-b border-ink py-3 ${i >= PHONE_CERTS ? "max-sm:hidden" : ""}`}>
                  {c}
                </li>
              ))}
            </ul>
            {certifications.items.length > PHONE_CERTS && (
              <details className="mt-3 sm:hidden">
                <summary className="link tap t-small cursor-pointer font-semibold">
                  Show all {certifications.items.length} certificates
                </summary>
                <ul className="m-0 grid list-none p-0">
                  {certifications.items.slice(PHONE_CERTS).map((c) => (
                    <li key={c} className="t-small border-b border-ink py-3">
                      {c}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        </div>

        <section aria-labelledby="competitions" className="lg:col-span-6">
          <h2 id="competitions" className="t-h3">
            Competitions
          </h2>
          <ol data-ledger="top" className="m-0 mt-4 list-none p-0">
            {competitions.map((c) => (
              <Entry key={c.event} title={c.result} meta={c.event} period={c.period} note={c.note} receipts={c.receipts} />
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
