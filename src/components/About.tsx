import { about, profile } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";

export default function About() {
  return (
    <section id="about" className="scroll-mt-16 border-b border-rule">
      <div className="mx-auto grid max-w-shell gap-8 section-pad px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <h1 className="max-w-[18ch] h-section font-display leading-[1.18] text-ink">
              <MaskText text="Build, then ask why." />
            </h1>
          </Reveal>

          <div className="mt-9 flex flex-col gap-5">
            {about.paragraphs.map((p, i) => (
              <Reveal key={p.slice(0, 20)} index={i}>
                <p className="max-w-measure text-[17px] leading-relaxed text-muted">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal index={3}>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent-solid px-6 py-3 font-mono text-[13px] text-on-accent transition-transform hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]"
              >
                Download the CV
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-rule px-6 py-3 font-mono text-[13px] text-ink transition-colors hover:border-ink active:scale-[0.98]"
              >
                LinkedIn
              </a>
            </div>
          </Reveal>
        </div>

        {/* Spec column. Mono, hairline-separated groups, no card. */}
        <Reveal index={1} className="lg:col-span-5">
          <dl className="flex flex-col">
            {about.stack.map((group) => (
              <div key={group.group} className="border-t border-rule py-5 first:pt-0">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  {group.group}
                </dt>
                <dd className="mt-2.5 font-mono text-[15px] leading-relaxed text-ink">
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
