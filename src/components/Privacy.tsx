import { privacy, profile } from "../data/content";
import { formatDate } from "../lib/projects";
import { Label } from "./ui";

/** The privacy page: what the site collects, in plain language. */
export default function Privacy() {
  return (
    <>
      <section className="shell tier-a">
        <h1 tabIndex={-1} className="t-h1 band">
          Privacy.
        </h1>
        <p className="t-lead mt-4 max-w-[52ch]">What this site collects, where it goes, and how to reach me about it.</p>
        <Label className="mt-4">Last updated {formatDate(privacy.updated)}</Label>
      </section>

      <dl className="shell tier-b m-0">
        {/* First, so the way to ask about any of this is on the first screen. */}
        <div className="grid gap-3 border-t-2 border-ink py-6 lg:grid-cols-12 lg:gap-8">
          <dt className="t-label pt-1 text-ink-2 lg:col-span-3">Contact</dt>
          <dd className="m-0 lg:col-span-9">
            <p className="t-body m-0">
              <a href={`mailto:${profile.email}`} className="link tap font-semibold">
                {profile.email}
              </a>
            </p>
          </dd>
        </div>
        {privacy.sections.map((s) => (
          <div key={s.heading} className="tint-row grid gap-3 border-t-2 border-ink py-6 lg:grid-cols-12 lg:gap-8">
            <dt className="t-label pt-1 text-ink-2 lg:col-span-3">{s.heading}</dt>
            <dd className="m-0 flex flex-col gap-3 lg:col-span-9">
              {s.body.map((p) => (
                <p key={p.slice(0, 32)} className="t-body m-0 max-w-measure">
                  {p}
                </p>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      <p className="shell tier-c t-small max-w-measure">{privacy.note}</p>
    </>
  );
}
