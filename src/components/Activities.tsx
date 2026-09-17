import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { certifications, competitions, leadership } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";
import Entry from "./Entry";

/**
 * What happens outside coursework and paid work: the club roles, the
 * competitions, and the certificates.
 *
 * This used to be the second half of About, and it was what pushed that page
 * about 700px past the screen at 1280x720, the one route that broke the
 * one-screen rule. Education stayed on About, because where someone studies is
 * the first thing a recruiter checks and should not be a click further away.
 */
export default function Activities() {
  return (
    <section id="activities" className="scroll-mt-16 border-b border-rule">
      <div className="mx-auto max-w-shell section-pad px-5 sm:px-8">
        <Reveal>
          <h1 className="max-w-[18ch] h-section font-display text-ink">
            <MaskText text="Outside the terminal." />
          </h1>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <h2 className="text-lg font-medium leading-tight text-ink">Leadership</h2>
            <ol className="mt-4 flex flex-col">
              {leadership.map((l) => (
                <Entry
                  key={l.org}
                  title={l.role}
                  meta={l.org}
                  period={l.period}
                  note={l.note}
                />
              ))}
            </ol>

            <div className="mt-9 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-lg font-medium leading-tight text-ink">Certifications</h2>
              <a
                href={certifications.href}
                target="_blank"
                rel="noopener noreferrer"
                className="tap group inline-flex items-center gap-1 text-[14px] text-accent-2 transition-colors hover:text-accent"
              >
                View all certificates
                <ArrowUpRightIcon
                  size={12}
                  weight="bold"
                  className="transition-transform group-hover:-translate-y-0.5"
                />
              </a>
            </div>
            <ul className="mt-4 grid border-t border-ink/30 sm:grid-cols-2 sm:gap-x-6">
              {certifications.items.map((c) => (
                <li
                  key={c}
                  className="border-b border-rule py-2.5 text-[14px] leading-snug text-muted"
                >
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal index={1} className="lg:col-span-6">
            <h2 className="text-lg font-medium leading-tight text-ink">Competitions</h2>
            <ol className="mt-4 flex flex-col">
              {competitions.map((c) => (
                <Entry
                  key={c.event}
                  title={c.result}
                  meta={c.event}
                  period={c.period}
                  note={c.note}
                />
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
