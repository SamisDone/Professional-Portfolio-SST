import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { milestones } from "../data/content";
import Reveal from "./Reveal";

/**
 * A ledger, not a stack of cards. Year in the margin, claim in the body, the
 * link on the row itself. Grouped by year with a single rule per group rather
 * than a hairline under every row.
 */
export default function Research() {
  const years = [...new Set(milestones.map((m) => m.year))];

  return (
    <section id="research" className="scroll-mt-16 border-b border-rule bg-raised">
      <div className="mx-auto max-w-shell px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <h2 className="max-w-[22ch] text-[clamp(1.9rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-tightest text-ink">
            Research, competitions and the work that got reviewed.
          </h2>
        </Reveal>

        <div className="mt-12 sm:mt-16">
          {years.map((year, gi) => (
            <div
              key={year}
              className="border-t border-ink/15 pt-6 first:border-ink/30 [&:not(:last-child)]:pb-10"
            >
              <div className="grid gap-6 md:grid-cols-12">
                <h3 className="font-mono text-sm text-muted md:col-span-2">{year}</h3>

                <ul className="flex flex-col gap-8 md:col-span-10">
                  {milestones
                    .filter((m) => m.year === year)
                    .map((m, i) => {
                      const Tag = m.href ? "a" : "div";
                      return (
                        <Reveal as="li" key={m.title} index={gi + i}>
                          <Tag
                            {...(m.href
                              ? {
                                  href: m.href,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                                }
                              : {})}
                            className={`group block ${m.href ? "cursor-pointer" : ""}`}
                          >
                            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                              {m.kind}
                            </span>
                            <h4 className="mt-2 flex items-start gap-2 text-xl font-medium leading-snug tracking-tight text-ink sm:text-2xl">
                              <span className={m.href ? "group-hover:underline" : ""}>
                                {m.title}
                              </span>
                              {m.href && (
                                <ArrowUpRightIcon
                                  size={16}
                                  className="mt-1.5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:text-ink"
                                />
                              )}
                            </h4>
                            <p className="mt-1.5 font-mono text-[13px] text-muted">
                              {m.venue}
                            </p>
                            <p className="mt-3 max-w-measure text-[15px] leading-relaxed text-muted">
                              {m.note}
                            </p>
                          </Tag>
                        </Reveal>
                      );
                    })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
