import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { currentResearch, research } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";

/**
 * The author list as the venue prints it, with my own name picked out.
 *
 * Summarising it ("co-authored", "with others") hides the one thing a reader
 * of a publication list is looking for. Fourth of six and first of five are
 * different pieces of work and both are worth stating plainly.
 */
function Authors({ names, self }: { names: string[]; self?: number }) {
  return (
    <p className="mt-1.5 max-w-measure text-[13px] leading-snug text-muted">
      {names.map((name, i) => (
        <span key={name}>
          {i > 0 && ", "}
          <span className={i === self ? "font-medium text-ink" : undefined}>{name}</span>
        </span>
      ))}
    </p>
  );
}

/**
 * A ledger, not a stack of cards. Year in the margin, claim in the body, the
 * link on the row itself. Grouped by year with a single rule per group rather
 * than a hairline under every row.
 *
 * The right column used to carry the grade chart, which answered a question
 * nobody asks on a publications page. It carries the thesis instead: a ledger
 * only ever shows finished work, and the thing currently being worked on is
 * the part a research supervisor reads first.
 */
export default function Research() {
  const years = [...new Set(research.map((m) => m.year))];

  return (
    <section id="research" className="scroll-mt-16 border-b border-rule">
      <div className="mx-auto max-w-shell section-pad short-trim px-5 sm:px-8">
        <Reveal>
          <h1 className="max-w-[22ch] h-section font-display text-ink">
            <MaskText text="Research." />
          </h1>
          <p className="mt-2 max-w-[46ch] text-[14px] leading-snug text-muted">
            Published work, and what is on the bench now.
          </p>
        </Reveal>

        <div className="mt-5 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            {years.map((year, gi) => (
              <div
                key={year}
                className="border-t border-ink/15 pt-3 first:border-ink/30 [&:not(:last-child)]:pb-5"
              >
              <div className="grid gap-4 md:grid-cols-12">
                <h2 className="font-mono text-[12px] text-accent md:col-span-2">{year}</h2>

                <ul className="flex flex-col gap-4 md:col-span-10">
                  {research
                    .filter((m) => m.year === year)
                    .map((m, i) => (
                      // The row used to be one anchor wrapping everything,
                      // which left nowhere to put a second link. The title is
                      // the link to the paper now and the code repository sits
                      // on the venue line, costing no extra row.
                      <Reveal as="li" key={m.title} index={gi + i}>
                        <h3 className="flex items-start gap-2 text-[15px] font-medium leading-snug text-ink">
                          {m.href ? (
                            <a
                              href={m.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-start gap-2 hover:underline"
                            >
                              {m.title}
                              <ArrowUpRightIcon
                                size={16}
                                className="mt-1.5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:text-ink"
                              />
                            </a>
                          ) : (
                            m.title
                          )}
                        </h3>
                        <p className="mt-1.5 font-mono text-[12px] text-muted">
                          <span className="text-[11px] uppercase tracking-[0.16em] text-accent">
                            {m.kind}
                          </span>
                          {"  ·  "}
                          {m.venue}
                          {m.code && (
                            <>
                              {"  ·  "}
                              <a
                                href={m.code}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Source code for ${m.title}`}
                                className="text-accent-2 transition-colors hover:text-accent"
                              >
                                Code
                              </a>
                            </>
                          )}
                        </p>
                        {m.authors && <Authors names={m.authors} self={m.selfIndex} />}
                        <p className="mt-1.5 max-w-measure text-[14px] leading-snug text-muted">
                          {m.note}
                        </p>
                      </Reveal>
                    ))}
                </ul>
              </div>
              </div>
            ))}
          </div>

          <Reveal index={2} className="lg:col-span-4">
            <div className="border-t border-ink/30 pt-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                {currentResearch.kind}
              </span>
              <h2 className="mt-2 text-[15px] font-medium leading-snug text-ink">
                {currentResearch.title}
              </h2>
              <p className="mt-1.5 max-w-measure text-[14px] leading-snug text-muted">
                {currentResearch.note}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
