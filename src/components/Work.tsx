import { Link } from "react-router-dom";
import type { Project } from "../data/content";
import { ALL_PROJECTS, WORK_INDEX, caseStudyPath, isFlagship, preloadShot, teamLine } from "../lib/projects";
import { Label, TextLink } from "./ui";

/** Stack items shown in the row; the rest are counted, and listed in full on
    the case study. */
const STACK = 3;

const COLS =
  "md:grid-cols-[40px_minmax(0,1.2fr)_minmax(0,2fr)_minmax(0,1.3fr)_56px_112px] lg:grid-cols-[40px_160px_minmax(0,1.2fr)_minmax(0,2fr)_minmax(0,1.3fr)_56px_112px]";

function Thumb({ project, eager }: { project: Project; eager: boolean }) {
  // No capture, no picture: the cell stays empty rather than holding a box.
  if (!project.shot) return <span aria-hidden className="hidden lg:block" />;
  const stem = project.shot.replace(/\.(jpg|jpeg|png)$/i, "");
  return (
    <img
      src={`${stem}-700.webp`}
      srcSet={`${stem}-700.webp 700w, ${stem}.webp 1400w`}
      sizes="160px"
      alt=""
      // The source of the morph into this project's case study exhibit.
      data-exhibit={project.slug}
      width={160}
      height={100}
      // The first rows sit on the first screen; the rest wait until scrolled to.
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className="hidden aspect-[16/10] w-40 border-2 border-ink bg-paper-2 object-cover object-top lg:block"
    />
  );
}

export function Row({ project, n }: { project: Project; n: number }) {
  const extra = project.stack.length - STACK;
  const stack = (
    <>
      {project.stack.slice(0, STACK).join(", ")}
      {extra > 0 && `, +${extra}`}
    </>
  );

  return (
    <li
      className="border-b border-ink"
      onPointerEnter={() => preloadShot(project)}
      onFocus={() => preloadShot(project)}
    >
      <div
        data-row
        className={`press press-quiet grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 gap-y-2 px-2 py-4 [--fill-hover:var(--section-tint)] md:items-start ${COLS}`}
      >
        <span className="t-label pt-1 text-ink">
          <span data-rownum data-stamp className="inline-block">
            {String(n).padStart(2, "0")}
          </span>
        </span>
        <Thumb project={project} eager={n <= 3} />

        <div>
          {isFlagship(project) && (
            <Label stamp className="mb-1 text-ink">
              Flagship
            </Label>
          )}
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
          {teamLine(project) && <Label className="mt-1">{teamLine(project)}</Label>}
          <p className="t-small mt-2 md:hidden">{project.summary}</p>
          <Label className="mt-2 md:hidden">
            {stack} / {project.year}
          </Label>
        </div>

        <p className="t-small col-start-2 hidden md:col-start-auto md:block">{project.summary}</p>
        <Label className="hidden pt-1 md:block">{stack}</Label>
        <Label className="hidden pt-1 md:block">{project.year}</Label>

        <div className="relative z-20 col-start-2 flex gap-4 md:col-start-auto md:flex-col md:items-end md:gap-2">
          {project.live && (
            <TextLink href={project.live} label={`${project.title}, live`} className="t-small">
              Live
            </TextLink>
          )}
          <TextLink href={project.repo} label={`${project.title} source code`} className="t-small">
            Code
          </TextLink>
        </div>
      </div>
    </li>
  );
}

/**
 * Every project on /work in one index table. The 3-up grid of identical cards
 * and the list under it were two designs for one job; this is one. The
 * flagships come first and are marked, and every row opens a real page.
 */
export default function Work() {
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
        <div aria-hidden className={`hidden gap-x-4 border-b-2 border-ink px-2 pb-2 md:grid ${COLS}`}>
          {["No.", null, "Project", "What it is", "Stack", "Year", "Proof"].map((h, i) =>
            h === null ? (
              <span key={i} className="hidden lg:block" />
            ) : (
              <Label as="span" key={h} className={`text-ink ${h === "Proof" ? "text-right" : ""}`}>
                {h}
              </Label>
            ),
          )}
        </div>
        <ol className="border-t-2 border-ink md:border-t-0">
          {WORK_INDEX.map((p, i) => (
            <Row key={p.slug} project={p} n={i + 1} />
          ))}
        </ol>
        <p className="t-small tier-c">
          <TextLink to="/repositories">All {ALL_PROJECTS.length} projects, with source</TextLink>
        </p>
      </section>
    </>
  );
}
