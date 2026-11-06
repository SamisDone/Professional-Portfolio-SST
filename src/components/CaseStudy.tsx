import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../data/content";
import { caseStudyPath, isFlagship, projectNeighbours } from "../lib/projects";
import { routeIndex } from "../lib/routes";
import { caseStudy } from "../lib/structured";
import JsonLd from "./JsonLd";
import Arrow from "./Arrow";
import { ProjectVisual } from "./Exhibit";
import { Button, Label } from "./ui";

/** Numbered steps joined by a 2px ink line, so the list reads as one path. */
function Flow({ steps }: { steps: string[] }) {
  return (
    <ol className="m-0 flex flex-col p-0">
      {steps.map((step, i) => (
        <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && (
            <span aria-hidden className="absolute bottom-0 left-[13px] top-8 w-0.5 bg-ink" />
          )}
          <span className="t-label grid h-8 w-8 shrink-0 place-items-center border-2 border-ink text-ink">
            {i + 1}
          </span>
          <span className="t-body pt-1">{step}</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * The full case study, as a real page at /work/slug.
 *
 * It used to be a dialog over /work, which meant no URL of its own, no title
 * of its own, and no text in the prerendered HTML: the dialog mounted only
 * when opened. Each one is now prerendered with its own title and
 * description, and a link to it can be pasted into an application.
 */
export default function CaseStudy({ project }: { project: Project }) {
  const { prev, next } = projectNeighbours(project.slug);

  const facts: [string, string][] = [
    ["Role", project.role ?? (project.team ? "Team build" : "Solo developer")],
    ["Type", `${project.kind}, ${project.year}`],
    ["Status", project.live ? "Live" : "Source only"],
  ];

  const prose = (text: string, strong = false) => (
    <p className={`t-body m-0 max-w-measure ${strong ? "font-semibold" : ""}`}>{text}</p>
  );
  const rows: { term: string; body: ReactNode }[] = [
    { term: "Problem", body: prose(project.problem) },
    // On team work "What I built" claims the whole system, which is the
    // first thing an interviewer checks.
    { term: project.team ? "What we built" : "What I built", body: prose(project.approach) },
  ];
  if (project.team && project.myPart) rows.push({ term: "My part", body: prose(project.myPart, true) });
  if (project.flow?.length) rows.push({ term: "How it works", body: <Flow steps={project.flow} /> });
  rows.push({ term: "Result", body: prose(project.outcome) });
  rows.push({ term: "Stack", body: prose(project.stack.join(", ")) });

  return (
    <article>
      {/* Where this sheet sits: inside Work, tab 02. The first part is the
          way back; BreadcrumbList in the structured data says the same. */}
      <nav aria-label="Breadcrumb" className="shell tier-c">
        <ol className="t-label m-0 flex list-none flex-wrap items-center gap-2 p-0 text-ink">
          <li>
            <Link to="/work" className="link tap">
              {String(routeIndex("/work") + 1).padStart(2, "0")} Work
            </Link>
          </li>
          <li aria-hidden className="text-ink-2">
            /
          </li>
          <li aria-current="page">{project.title}</li>
        </ol>
      </nav>
      <JsonLd data={caseStudy(project)} />

      <header className="shell mt-6">
        <div className="border-2 border-ink p-6 sm:p-8">
          <Label>
            {project.kind}, {project.year}
            {isFlagship(project) && " / Flagship"}
          </Label>
          <h1 tabIndex={-1} className="t-h1 band mt-3">
            {project.title}
          </h1>
          <p className="t-lead mt-4 max-w-measure">{project.summary}</p>

          <dl className="mt-6 grid gap-4 border-t-2 border-ink pt-4 sm:grid-cols-3">
            {facts.map(([term, value]) => (
              <div key={term}>
                <dt className="t-label text-ink-2">{term}</dt>
                <dd className="t-body m-0 mt-1 font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-4">
            {project.live && (
              <Button href={project.live} variant="primary">
                {project.liveLabel ?? "Open it"}
              </Button>
            )}
            <Button href={project.repo}>Code</Button>
          </div>
        </div>
      </header>

      <div className="shell tier-b empty:hidden">
        <ProjectVisual project={project} sizes="(min-width: 1280px) 1184px, 100vw" priority />
      </div>

      <dl className="shell tier-b m-0">
        {rows.map(({ term, body }) => (
          <div key={term} className="tint-row grid gap-3 border-t-2 border-ink py-6 lg:grid-cols-12 lg:gap-8">
            <dt className="t-label pt-1 text-ink-2 lg:col-span-3">{term}</dt>
            <dd className="m-0 lg:col-span-9">{body}</dd>
          </div>
        ))}
      </dl>

      <nav aria-label="More case studies" className="shell tier-b">
        <div className="flex flex-wrap items-stretch justify-between gap-4 border-t-2 border-ink pt-8">
          {prev ? (
            <Link to={caseStudyPath(prev)} className="btn btn-secondary press">
              <Arrow dir="left" />
              <span>
                <span className="t-label mr-2 text-ink-2">Previous</span>
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={caseStudyPath(next)} className="btn btn-secondary press">
              <span>
                <span className="t-label mr-2 text-ink-2">Next</span>
                {next.title}
              </span>
              <Arrow dir="right" />
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
