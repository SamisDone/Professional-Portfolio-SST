import { experience } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";

/**
 * Employment, kept apart from the research ledger. They answer different
 * questions: this one is who paid her to build something, and that one is what
 * got peer reviewed. Collapsing the two into a single list of "milestones"
 * made both harder to read.
 */
export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-16 border-b border-rule bg-raised">
      <div className="mx-auto max-w-shell px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <h2 className="max-w-[20ch] text-[clamp(1.9rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-tightest text-ink">
            <MaskText text="Where I have been paid to build." />
          </h2>
        </Reveal>

        <ol className="mt-12 border-t border-ink/25 sm:mt-16">
          {experience.map((role, i) => (
            <Reveal as="li" key={role.org} index={i}>
              <article className="grid gap-x-8 gap-y-4 border-b border-rule py-8 md:grid-cols-12 md:py-10">
                <div className="md:col-span-3">
                  <p className="font-mono text-[13px] text-muted">{role.period}</p>
                  <p className="mt-1 font-mono text-[12px] text-muted/80">
                    {role.location}
                  </p>
                </div>

                <div className="md:col-span-9">
                  <h3 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">
                    {role.org}
                  </h3>
                  <p className="mt-1.5 font-mono text-[13px] text-accent">
                    {role.role}
                  </p>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {role.points.map((point) => (
                      <li
                        key={point}
                        className="relative max-w-measure pl-5 text-[15px] leading-relaxed text-muted"
                      >
                        <span
                          aria-hidden
                          className="absolute left-0 top-[0.65em] h-px w-3 bg-accent"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
