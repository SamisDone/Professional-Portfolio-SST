import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Project } from "../data/content";
import { scan } from "../lib/motion";
import {
  ALL_PROJECTS,
  WORK_FILTERS,
  WORK_INDEX,
  caseStudyPath,
  filtersOf,
  preloadShot,
  teamLine,
} from "../lib/projects";
import { ProjectFrame } from "./Exhibit";
import { Label, ProofMark, TextLink } from "./ui";

/** useLayoutEffect warns when rendered to a string; there is nothing to
    measure on a server. */
const useIsoLayoutEffect = typeof window === "undefined" ? () => {} : useLayoutEffect;

/* No stack column: the stack is on every case study and on /repositories,
   and the rows are shorter without it. */
const COLS = "md:grid-cols-[40px_minmax(0,1fr)_minmax(0,2fr)_48px_128px]";

export function Row({ project, n, onPick }: { project: Project; n: number; onPick?: () => void }) {
  return (
    <li
      className="border-b border-ink"
      data-kinds={filtersOf(project).join(" ")}
      data-slug={project.slug}
      onPointerEnter={() => {
        preloadShot(project);
        onPick?.();
      }}
      onFocus={() => {
        preloadShot(project);
        onPick?.();
      }}
    >
      <div
        data-row
        className={`press press-quiet grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 gap-y-2 px-2 py-2 [--fill-hover:var(--section-tint)] md:items-start ${COLS}`}
      >
        <span className="t-label pt-1 text-ink">
          <span data-rownum data-stamp className="inline-block">
            {String(n).padStart(2, "0")}
          </span>
        </span>

        <div>
          <h2 className="t-h3">
            {/* The whole row opens the case study. The link is stretched over
                it; Live and Code sit above the stretch with their own targets. */}
            <Link
              to={caseStudyPath(project)}
              className="text-ink no-underline after:absolute after:inset-0 after:z-10 after:content-['']"
            >
              {project.title}
            </Link>
          </h2>
          {teamLine(project) && <Label className="mt-1 md:hidden">{teamLine(project)}</Label>}
          {/* On a phone a row says what kind of thing it is; the summary is
              the case study's first line. */}
          <Label className="mt-1 md:hidden">
            {project.kind}, {project.year}
          </Label>
        </div>

        <div className="col-start-2 hidden md:col-start-auto md:block">
          <p className="t-small">{project.summary}</p>
          {project.figureNote && <Label className="mt-2">{project.figureNote}</Label>}
          {/* The role sits here from md, on one line, rather than wrapping
              under the title in the narrow project column. */}
          {teamLine(project) && <Label className="mt-1">{teamLine(project)}</Label>}
        </div>
        <Label date className="hidden pt-1 md:block">
          {project.year}
        </Label>

        {/* Live and Code side by side: stacked, they were often taller than
            the row's text. */}
        <div className="relative z-20 col-start-2 flex gap-4 md:col-start-auto md:justify-end">
          {project.live && (
            <ProofMark href={project.live} label={`${project.title}, live`} className="t-small">
              Live
            </ProofMark>
          )}
          <TextLink href={project.repo} label={`${project.title} source code`} className="t-small">
            Code
          </TextLink>
        </div>
      </div>
    </li>
  );
}

const kindFrom = (search: string) => {
  const k = new URLSearchParams(search).get("kind");
  return WORK_FILTERS.some((f) => f.key === k) ? k : null;
};

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Every project on /work in one index table, the flagships first and marked,
 * every row opening a real page.
 *
 * Filters: chips by kind, worked out from content.ts. Each is a link with a
 * query string, so a filtered view can be shared. The inline script in
 * index.html copies ?kind= onto <html data-kind> before the first paint and
 * CSS hides the rows that do not match, so a shared link never shows every
 * row first. Choosing a chip cuts the rows that leave at once and slides
 * the rows that stay to their new places (transform only, 200ms). With
 * JavaScript off the page shows every row, with a note saying so.
 *
 * From 1024px a sticky exhibit frame beside the table shows the pointed-at
 * or focused row's screenshot, the first row's by default; a phone gets
 * text rows only.
 */
export default function Work() {
  const { search } = useLocation();
  const kind = kindFrom(search);
  const list = useRef<HTMLOListElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>(WORK_INDEX.find((p) => p.shot || p.figures)?.slug ?? "");
  const firstFrame = useRef(true);

  const visible = (p: Project) => !kind || filtersOf(p).includes(kind);
  const pick = (p: Project) => {
    if ((p.shot || p.figures) && p.slug !== active) setActive(p.slug);
  };

  // Apply the filter: measure the rows, switch, measure again, and slide the
  // rows that stayed from where they were (FLIP). Rows that leave are cut.
  useIsoLayoutEffect(() => {
    const html = document.documentElement;
    const rows = [...(list.current?.children ?? [])] as HTMLElement[];
    const before = new Map(rows.map((r) => [r, r.getBoundingClientRect().top]));
    if (kind) html.dataset.kind = kind;
    else delete html.dataset.kind;
    if (!reduced()) {
      for (const r of rows) {
        if (!r.offsetParent) continue;
        const from = before.get(r)!;
        const to = r.getBoundingClientRect().top;
        if (from && Math.abs(from - to) > 1 && before.get(r) !== undefined) {
          r.animate([{ transform: `translateY(${from - to}px)` }, { transform: "none" }], {
            duration: 200,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
          });
        }
      }
    }
    // The frame follows: if its project was filtered out, the first one left.
    const current = WORK_INDEX.find((p) => p.slug === active);
    if (current && !visible(current)) {
      const next = WORK_INDEX.find((p) => visible(p) && (p.shot || p.figures));
      if (next) setActive(next.slug);
    }
  }, [kind]);

  // Leaving /work: the filter belongs to this page only.
  useEffect(() => () => void delete document.documentElement.dataset.kind, []);

  // A project new to the frame is handed to the motion layer.
  useEffect(() => {
    if (firstFrame.current) {
      firstFrame.current = false;
      return;
    }
    if (frame.current) scan(frame.current);
  }, [active]);

  const count = (key: string) => WORK_INDEX.filter((p) => filtersOf(p).includes(key)).length;

  return (
    <>
      <section className="shell tier-a">
        <h1 tabIndex={-1} className="t-h1 band">
          Selected projects.
        </h1>
        <p className="t-lead mt-4 max-w-[52ch]">
          Every row opens a case study: the problem, what was built, my part in it, and how it turned out.
        </p>
      </section>

      <section aria-label="Project index" className="shell tier-b">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <nav aria-label="Filter by kind">
          <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
            {[{ key: null, label: "All", n: WORK_INDEX.length }, ...WORK_FILTERS.map((f) => ({ ...f, n: count(f.key) }))].map(
              (f) => (
                <li key={f.label}>
                  <Link
                    to={f.key ? `/work?kind=${f.key}` : "/work"}
                    data-chip={f.key ?? "all"}
                    aria-current={kind === f.key ? "true" : undefined}
                    className="chip press t-small"
                  >
                    {f.label} <span className="t-label">{f.n}</span>
                  </Link>
                </li>
              ),
            )}
          </ul>
          <noscript>
            <p className="t-small mt-3">Filtering needs JavaScript, so every project is shown below.</p>
          </noscript>
        </nav>
        {/* The way on to every project, here rather than under the table. */}
        <TextLink to="/repositories" className="t-small">
          All {ALL_PROJECTS.length} projects, with source
        </TextLink>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <div aria-hidden className={`hidden gap-x-4 border-b-2 border-ink px-2 pb-2 md:grid ${COLS}`}>
              {["No.", "Project", "What it is", "Year", "Proof"].map((h) => (
                <Label as="span" key={h} className={`text-ink ${h === "Proof" ? "text-right" : ""}`}>
                  {h}
                </Label>
              ))}
            </div>
            <ol ref={list} data-ledger="bottom" className="border-t-2 border-ink md:border-t-0">
              {WORK_INDEX.map((p, i) => (
                <Row key={p.slug} project={p} n={i + 1} onPick={() => pick(p)} />
              ))}
            </ol>
          </div>
          <div className="hidden lg:col-span-3 lg:block">
            <div ref={frame} data-work-frame className="sticky top-24">
              {active && <ProjectFrame projects={WORK_INDEX} active={active} sizes="(min-width: 1280px) 300px, 24vw" priority={active} />}
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
