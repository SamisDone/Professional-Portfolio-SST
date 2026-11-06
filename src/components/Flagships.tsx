import type { Project } from "../data/content";
import { FLAGSHIPS, WORK_INDEX, caseStudyPath, teamLine } from "../lib/projects";
import { ProjectVisual } from "./Exhibit";
import { Button, Label, ProofMark, TextLink } from "./ui";

const n = (i: number) => String(i + 1).padStart(2, "0");

/** Kind and year, then the title, the summary and the three ways in. */
function SpreadText({ project, index }: { project: Project; index: number }) {
  return (
    <>
      <Label>
        Flagship {n(index)} / {project.kind}, {project.year}
      </Label>
      {teamLine(project) && <Label className="mt-1 text-ink">{teamLine(project)}</Label>}
      <h2 className="t-h2 mt-3">{project.title}</h2>
      <p className="t-body mt-3 max-w-measure">{project.summary}</p>
      <Actions project={project} />
    </>
  );
}

function Actions({ project }: { project: Project }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
      <Button to={caseStudyPath(project)}>Read the case study</Button>
      {project.live && (
        <ProofMark href={project.live} label={`${project.title}, ${project.liveLabel ?? "live"}`} className="t-small">
          {project.liveLabel ?? "Live"}
        </ProofMark>
      )}
      <TextLink href={project.repo} label={`${project.title} source code`} className="t-small">
        Code
      </TextLink>
    </div>
  );
}

/**
 * Three projects, deliberately not the same shape, so the page does not read
 * as a grid of identical cards. Exhibit-led, then text-led, then the third
 * set wide with its reasoning in three columns under it.
 */
export default function Flagships() {
  const [a, b, c] = FLAGSHIPS;

  return (
    <div>
      {a && (
        <article className="shell tier-a">
          <div className="grid gap-8 border-t-4 border-ink pt-8 lg:grid-cols-12">
            <ProjectVisual
              project={a}
              sizes="(min-width: 1280px) 780px, (min-width: 1024px) 64vw, 100vw"
              className="lg:col-span-8"
            />
            <div className="lg:col-span-4">
              <SpreadText project={a} index={0} />
            </div>
          </div>
        </article>
      )}

      {b && (
        <article className="shell tier-a">
          <div className="grid gap-8 border-t-4 border-ink pt-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SpreadText project={b} index={1} />
            </div>
            <ProjectVisual
              project={b}
              sizes="(min-width: 1280px) 780px, (min-width: 1024px) 64vw, 100vw"
              className="lg:col-span-8"
            />
          </div>
        </article>
      )}

      {c && (
        <article className="shell tier-a">
          <div className="border-t-4 border-ink pt-8">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <Label>
                  Flagship {n(2)} / {c.kind}, {c.year}
                </Label>
                {teamLine(c) && <Label className="mt-1 text-ink">{teamLine(c)}</Label>}
                <h2 className="t-h2 mt-3">{c.title}</h2>
                <p className="t-body mt-3 max-w-measure">{c.summary}</p>
              </div>
              <div className="lg:col-span-4 lg:self-end">
                <Actions project={c} />
              </div>
            </div>
            <ProjectVisual project={c} sizes="(min-width: 1280px) 1184px, 100vw" className="mt-8" />
            <dl className="mt-8 grid gap-8 lg:grid-cols-3">
              {[
                ["Problem", c.problem],
                ["Built", c.approach],
                ["Result", c.outcome],
              ].map(([term, body]) => (
                <div key={term} className="border-t-2 border-ink pt-4">
                  <dt className="t-label text-ink-2">{term}</dt>
                  <dd className="t-body m-0 mt-3">{body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </article>
      )}

      <div className="shell tier-b">
        <p className="t-lead">
          <TextLink to="/work">All {WORK_INDEX.length} projects</TextLink>
        </p>
      </div>
    </div>
  );
}
