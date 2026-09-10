import { ArrowUpRightIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { research } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";

/**
 * A ledger, not a stack of cards. Year in the margin, claim in the body, the
 * link on the row itself. Grouped by year with a single rule per group rather
 * than a hairline under every row.
 */
export default function Research({ aside }: { aside?: ReactNode }) {
  const years = [...new Set(research.map((m) => m.year))];

  return (
    <section id="research" className="scroll-mt-16 border-b border-rule">
      <div className="mx-auto max-w-shell section-pad short-trim px-5 sm:px-8">
        <Reveal>
          <h2 className="max-w-[22ch] h-section font-display leading-[1.06] tracking-tight text-ink">
            <MaskText text="Research." />
          </h2>
          <p className="mt-2 max-w-[46ch] text-[14px] leading-snug text-muted">
            Papers and competitions, the work that got reviewed.
          </p>
        </Reveal>

        <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            {years.map((year, gi) => (
              <div
                key={year}
                className="border-t border-ink/15 pt-5 first:border-ink/30 [&:not(:last-child)]:pb-7"
              >
              <div className="grid gap-4 md:grid-cols-12">
                <h3 className="font-display text-sm text-accent md:col-span-2">{year}</h3>

                <ul className="flex flex-col gap-5 md:col-span-10">
                  {research
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
                            <h4 className="mt-2 flex items-start gap-2 font-display text-[15px] leading-tight tracking-tight text-ink sm:text-base">
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
                            <p className="mt-1.5 max-w-measure text-[13.5px] leading-snug text-muted">
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

          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
