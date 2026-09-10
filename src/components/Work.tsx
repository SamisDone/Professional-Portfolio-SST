import { ArrowUpRightIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { featured, type Project } from "../data/content";
import Reveal from "./Reveal";
import Figure from "./Figure";

function Shot({
  project,
  priority,
  ratio,
}: {
  project: Project;
  priority?: boolean;
  ratio?: string;
}) {
  if (!project.shot) return null;
  return (
    <Figure
      src={project.shot}
      alt={project.shotAlt ?? ""}
      ratio={ratio}
      priority={priority}
    />
  );
}

function Meta({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] text-muted">
      <span className="text-ink">{project.kind}</span>
      <span aria-hidden className="h-3 w-px bg-rule" />
      <span>{project.year}</span>
      <span aria-hidden className="h-3 w-px bg-rule" />
      <span>{project.stack.join(", ")}</span>
    </div>
  );
}

function Links({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-mono text-[13px] text-paper transition-opacity hover:opacity-85 active:scale-[0.98]"
        >
          {project.liveLabel ?? "Open"}
          <ArrowUpRightIcon size={14} weight="bold" />
        </a>
      )}
      <a
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-rule px-5 py-2.5 font-mono text-[13px] text-ink transition-colors hover:border-ink active:scale-[0.98]"
      >
        <GithubLogoIcon size={15} />
        Source
      </a>
    </div>
  );
}

/** Problem, approach, outcome. The reasoning is on the page, not behind a click. */
function Reasoning({ project, columns }: { project: Project; columns?: boolean }) {
  const rows = [
    ["Problem", project.problem],
    ["What I built", project.approach],
    ["Outcome", project.outcome],
  ];
  return (
    <dl
      className={
        columns
          ? "grid gap-x-8 gap-y-6 border-t border-rule pt-6 sm:grid-cols-3"
          : "flex flex-col gap-5 border-t border-rule pt-6"
      }
    >
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            {k}
          </dt>
          <dd className="max-w-measure text-[15px] leading-relaxed text-muted">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Work() {
  const [lead, ...rest] = featured;

  return (
    <section id="work" className="scroll-mt-16 border-b border-rule">
      <div className="mx-auto max-w-shell px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <h2 className="max-w-[20ch] text-[clamp(1.9rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-tightest text-ink">
            Four things I built, and why they work the way they do.
          </h2>
        </Reveal>

        {/* Lead case: the screenshot runs full width, then the reasoning sits
            underneath in three columns. Deliberately not the same shape as the
            rows below it. */}
        <Reveal>
          <article className="mt-14 sm:mt-20">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="font-mono text-[12px] text-muted">01</span>
                <h3 className="mt-1 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                  {lead.title}
                </h3>
              </div>
              <Links project={lead} />
            </div>
            <Shot project={lead} priority ratio="aspect-[16/9]" />
            <p className="mt-6 max-w-measure text-lg leading-relaxed text-ink">
              {lead.summary}
            </p>
            <div className="mt-5">
              <Meta project={lead} />
            </div>
            <div className="mt-8">
              <Reasoning project={lead} columns />
            </div>
          </article>
        </Reveal>

        {/* Remaining cases: alternating split rows. */}
        <div className="mt-20 flex flex-col gap-20 sm:mt-28 sm:gap-28">
          {rest.map((project, i) => (
            <Reveal key={project.slug}>
              <article className="grid gap-8 md:grid-cols-12 md:gap-10">
                <div
                  className={`md:col-span-6 lg:col-span-7 ${
                    i % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  <Shot project={project} />
                </div>
                <div className="flex flex-col md:col-span-6 lg:col-span-5">
                  <span className="font-mono text-[12px] text-muted">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-3xl font-medium tracking-tight text-ink">
                    {project.title}
                  </h3>
                  <p className="mt-4 max-w-measure text-[17px] leading-relaxed text-ink">
                    {project.summary}
                  </p>
                  <div className="mt-4">
                    <Meta project={project} />
                  </div>
                  <div className="mt-7">
                    <Reasoning project={project} />
                  </div>
                  <div className="mt-7">
                    <Links project={project} />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
