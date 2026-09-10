import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRightIcon, PlusIcon, MinusIcon } from "@phosphor-icons/react";
import { otherWork, profile } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";
import Figure from "./Figure";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * A compact index rather than a second grid of cards. Rows expand in place, so
 * the reasoning is still one click away without a dialog or a route change.
 */
export default function OtherWork() {
  const [open, setOpen] = useState<string | null>(null);
  const reduced = useReducedMotion();

  return (
    <section className="border-b border-rule bg-raised">
      <div className="mx-auto max-w-shell section-pad short-trim px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-[20ch] text-[clamp(1.9rem,4.5vw,3rem)] font-display leading-[1.06] tracking-tight text-ink">
              <MaskText text="Everything else." />
            </h2>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-rule px-5 py-2.5 font-mono text-[13px] text-ink transition-colors hover:border-ink"
            >
              All repositories
              <ArrowUpRightIcon size={14} weight="bold" />
            </a>
          </div>
        </Reveal>

        <ul className="mt-8 border-t border-ink/25 sm:mt-10">
          {otherWork.map((p, i) => {
            const isOpen = open === p.slug;
            return (
              <Reveal as="li" key={p.slug} index={i} className="border-b border-rule">
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : p.slug)}
                    aria-expanded={isOpen}
                    aria-controls={`row-${p.slug}`}
                    className="group grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-x-4 py-6 text-left sm:grid-cols-[3rem_minmax(0,14rem)_1fr_auto] sm:gap-x-6"
                  >
                    <span className="font-mono text-[12px] text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-base leading-tight tracking-tight text-ink sm:text-lg">
                      {p.title}
                    </span>
                    <span className="col-span-2 mt-1.5 font-mono text-[12px] text-muted sm:col-span-1 sm:mt-0">
                      {p.kind}
                      <span className="hidden sm:inline">, {p.year}</span>
                    </span>
                    <span
                      aria-hidden
                      className="col-start-3 row-start-1 justify-self-end text-muted transition-colors group-hover:text-accent sm:col-start-4"
                    >
                      {isOpen ? <MinusIcon size={17} /> : <PlusIcon size={17} />}
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`row-${p.slug}`}
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduced ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 pb-9 sm:grid-cols-12 sm:pl-[4.5rem]">
                        <div className="flex flex-col gap-5 sm:col-span-7">
                          {[
                            ["Problem", p.problem],
                            ["What I built", p.approach],
                            ["Outcome", p.outcome],
                          ].map(([k, v]) => (
                            <div key={k}>
                              <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                                {k}
                              </p>
                              <p className="max-w-measure text-[15px] leading-relaxed text-muted">
                                {v}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col gap-5 sm:col-span-5">
                          {p.shot && (
                            <Figure src={p.shot} alt={p.shotAlt ?? ""} ratio={p.shotRatio} />
                          )}
                          <p className="font-mono text-[12px] leading-relaxed text-muted">
                            {p.stack.join(", ")}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {p.live && (
                              <a
                                href={p.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-accent-solid px-4 py-2.5 font-mono text-[13px] text-on-accent transition-transform hover:-translate-y-[2px] active:translate-y-0"
                              >
                                {p.liveLabel ?? "Open"}
                                <ArrowUpRightIcon size={13} weight="bold" />
                              </a>
                            )}
                            <a
                              href={p.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 border border-rule px-4 py-2.5 font-mono text-[13px] text-ink transition-colors hover:border-ink"
                            >
                              Source
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
