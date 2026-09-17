import { about, education, profile } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";
import Entry from "./Entry";
import Trajectory from "./Trajectory";

/**
 * Two bands. The first is who I am and what I work with; the second is where
 * I study and how the grades have moved.
 *
 * Education was only ever in the CV, which is a PDF a visitor has to decide to
 * download, and it is the first thing a recruiter checks, so it stays here.
 * The CGPA is one line in it, the same line the CV prints, and the term-by-term
 * trend chart sits under it so the figure and the climb read together. The
 * club roles, competitions and
 * certificates that used to follow are on the activities page, because with
 * them this page ran well past one screen.
 */
export default function About() {
  return (
    <section id="about" className="scroll-mt-16 border-b border-rule">
      <div className="mx-auto max-w-shell section-pad px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <h1 className="max-w-[18ch] h-section font-display text-ink">
                <MaskText text="Build, then ask why." italicFrom={2} />
              </h1>
            </Reveal>

            <div className="about-intro mt-9 flex flex-col gap-5">
              {about.paragraphs.map((p, i) => (
                <Reveal key={p.slice(0, 20)} index={i}>
                  <p className="max-w-measure text-[17px] leading-relaxed text-muted">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal index={3}>
              <div className="about-cta mt-7 flex flex-wrap gap-3">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent-solid px-6 py-3.5 text-sm font-medium text-on-accent transition-transform hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]"
                >
                  Download the CV
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-rule px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink active:scale-[0.98]"
                >
                  LinkedIn
                </a>
              </div>
            </Reveal>
          </div>

          {/* Education beside the introduction rather than under it: it is the
              first thing a recruiter checks, so it gets the top of the page. */}
          <Reveal index={1} className="lg:col-span-5">
            <h2 className="text-lg font-medium leading-tight text-ink">Education</h2>
            <ol className="mt-4 flex flex-col">
              {education.map((e) => (
                <Entry
                  key={e.school}
                  title={e.award}
                  meta={e.school}
                  period={e.period}
                  note={e.note}
                />
              ))}
            </ol>
            <div className="about-chart mt-7">
              <Trajectory bare />
            </div>
          </Reveal>
        </div>

        {/* Spec row. Mono, hairline-separated groups, no card. Four across on a
            wide screen, where it used to be a tall column of its own. */}
        <Reveal index={2}>
          <dl className="about-stack mt-9 grid gap-x-8 border-t border-ink/25 sm:grid-cols-2 lg:grid-cols-4">
            {about.stack.map((group) => (
              <div key={group.group} className="border-b border-rule py-4 lg:border-b-0">
                <dt className="font-mono text-[12px] uppercase tracking-[0.16em] text-muted">
                  {group.group}
                </dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-ink">
                  {group.items.join("  ·  ")}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
