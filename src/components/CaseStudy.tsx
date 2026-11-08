import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../data/content";
import { caseStudyPath, isFlagship, projectNeighbours } from "../lib/projects";
import { routeIndex, sectionFor } from "../lib/routes";
import { caseStudy } from "../lib/structured";
import JsonLd from "./JsonLd";
import Arrow from "./Arrow";
import { ProjectVisual } from "./Exhibit";
import { Label, ProofMark, TextLink } from "./ui";

/**
 * Numbered steps joined by a 2px ink line, so the list reads as one path.
 *
 * The motion layer builds it in drafting order (E2 in src/motion.css): the
 * connector lines, then the boxes' outlines, then the labels; then the
 * numbers advance one step per tick (E3). For that the box's outline is four
 * flat ink strips over a transparent border (`.m-box`), which looks the same
 * as the 2px border at rest, and the number is its own element.
 */
export function Flow({ steps }: { steps: string[] }) {
  return (
    <ol data-flow className="m-0 flex flex-col p-0">
      {steps.map((step, i) => (
        <li key={step} className="relative flex gap-4 pb-6 last:pb-0" style={{ "--i": i } as CSSProperties}>
          {i < steps.length - 1 && (
            <span aria-hidden className="m-connector absolute bottom-0 left-[13px] top-8 w-0.5 bg-ink" />
          )}
          <span className="m-box t-label grid h-8 w-8 shrink-0 place-items-center border-2 text-ink">
            <span className="m-num">{i + 1}</span>
          </span>
          <span className="m-text t-body pt-1">{step}</span>
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
  rows.push({
    term: "Result",
    body: (
      <>
        {prose(project.outcome)}
        {project.figureNote && <Label className="mt-2">{project.figureNote}</Label>}
      </>
    ),
  });
  rows.push({ term: "Stack", body: prose(project.stack.join(", ")) });
  const idOf = (term: string) => term.toLowerCase().replace(/[^a-z]+/g, "-");

  // The index marks the section being read: the last one whose top has
  // passed a line a third of the way down the screen. Without JavaScript the
  // index still works, as plain anchor links, with nothing marked.
  const body = useRef<HTMLDListElement>(null);
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const sections = [...(body.current?.querySelectorAll<HTMLElement>("[id]") ?? [])];
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight / 3;
      let id: string | null = sections[0]?.id ?? null;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) id = s.id;
      setCurrent(id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [project.slug]);

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
          <h1 tabIndex={-1} data-morph-title={project.slug} className="t-h1 band mt-3">
            {project.title}
          </h1>
          <p className="t-lead mt-4 max-w-measure">{project.summary}</p>
          {project.figureNote && <Label className="mt-2">{project.figureNote}</Label>}

          <dl className="mt-6 grid gap-4 border-t-2 border-ink pt-4 sm:grid-cols-3">
            {facts.map(([term, value]) => (
              <div key={term} data-stamp>
                <dt className="t-label text-ink-2">{term}</dt>
                <dd className="t-body m-0 mt-1 font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          {/* The proof rule: the live product is a proof mark, the source is a
              plain link. The live link is the page's next action, so it is
              set at body size, ahead of Code. */}
          <div data-stamp className="tap-row mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {project.live && (
              <ProofMark href={project.live} label={`${project.title}, ${project.liveLabel ?? "live"}`} className="t-body font-semibold">
                {project.liveLabel ?? "Open it"}
              </ProofMark>
            )}
            <TextLink href={project.repo} label={`${project.title} source code`} className={project.live ? "t-small" : "t-body font-semibold"}>
              Code
            </TextLink>
          </div>
        </div>
      </header>

      <div className="shell tier-b empty:hidden">
        <ProjectVisual project={project} sizes="(min-width: 1280px) 1184px, 100vw" priority />
      </div>

      {/* From lg the left column is an index of the sections, sticky as the
          page scrolls, with the one being read marked by a 4px bar in the
          section colour. */}
      <div className="shell tier-b lg:grid lg:grid-cols-12 lg:gap-8">
        <nav aria-label="On this page" className="case-index hidden lg:col-span-3 lg:block">
          <ol className="sticky top-24 m-0 list-none border-t-2 border-ink p-0 pt-4">
            {rows.map(({ term }) => (
              <li key={term}>
                <a
                  href={`#${idOf(term)}`}
                  aria-current={current === idOf(term) ? "location" : undefined}
                  className="t-label block py-2 pl-4 text-ink no-underline"
                >
                  {term}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <dl ref={body} className="m-0 lg:col-span-9">
          {rows.map(({ term, body }) => (
            <div key={term} id={idOf(term)} className="tint-row scroll-mt-24 border-t-2 border-ink py-6">
              <dt className="t-label text-ink-2">{term}</dt>
              <dd className="m-0 mt-3">{body}</dd>
            </div>
          ))}
        </dl>
      </div>

      <nav aria-label="More case studies" className="shell tier-b">
        <div className="flex flex-wrap items-stretch justify-between gap-4 border-t-2 border-ink pt-8">
          {prev ? (
            <Link to={caseStudyPath(prev)} className="btn btn-secondary press pager-btn">
              <span aria-hidden className="pager-preview" style={{ "--dest": `var(--${sectionFor(caseStudyPath(prev))})` } as CSSProperties} />
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
            <Link to={caseStudyPath(next)} className="btn btn-secondary press pager-btn pager-next">
              <span aria-hidden className="pager-preview" style={{ "--dest": `var(--${sectionFor(caseStudyPath(next))})` } as CSSProperties} />
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
