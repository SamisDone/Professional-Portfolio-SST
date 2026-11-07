import type { Project } from "../data/content";
import { FLAGSHIPS, WORK_INDEX, caseStudyPath, teamLine } from "../lib/projects";
import { ProjectVisual } from "./Exhibit";
import { Button, Label, ProofMark, TextLink } from "./ui";

const n = (i: number) => String(i + 1).padStart(2, "0");

/** "Flagship 01 / Chrome extension, 2025". */
function KindLabel({ project, index, className = "" }: { project: Project; index: number; className?: string }) {
  return (
    <Label stamp className={className}>
      Flagship {n(index)} / {project.kind}, {project.year}
    </Label>
  );
}

/** Kind and year, then the title, the summary and the three ways in.
    `labelAbove` hides the label below `lg`, where the spread shows it over
    its picture instead. */
function SpreadText({ project, index, labelAbove = false }: { project: Project; index: number; labelAbove?: boolean }) {
  return (
    <>
      <KindLabel project={project} index={index} className={labelAbove ? "hidden lg:block" : ""} />
      {teamLine(project) && <Label className="mt-1 text-ink">{teamLine(project)}</Label>}
      <h2 className="t-h2 mt-3">{project.title}</h2>
      <p className="t-body mt-3 max-w-measure">{project.summary}</p>
      {project.figureNote && <Label className="mt-2">{project.figureNote}</Label>}
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
 * as a grid of identical cards. The first is exhibit-led and wide. The other
 * two share a row at unequal widths, seven columns and five, each with its
 * picture over its text; on a phone they stack.
 *
 * The first spread sits closer to the proof row than a section break would
 * put it, so its opening reaches the first screen: on a desktop the top of
 * its screenshot, and on a phone its 4px rule and its kind and year label,
 * which there sits over the picture rather than under it.
 */
export default function Flagships() {
  const [a, b, c] = FLAGSHIPS;

  return (
    <div>
      {a && (
        <article className="shell pt-4 sm:pt-8">
          <div className="grid gap-8 border-t-4 border-ink pt-4 sm:pt-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <KindLabel project={a} index={0} className="mb-3 lg:hidden" />
              <ProjectVisual
                project={a}
                sizes="(min-width: 1280px) 780px, (min-width: 1024px) 64vw, 100vw"
                priority
              />
            </div>
            <div className="lg:col-span-4">
              <SpreadText project={a} index={0} labelAbove />
            </div>
          </div>
        </article>
      )}

      {(b || c) && (
        <div className="shell tier-a">
          <div className="grid gap-x-8 gap-y-16 lg:grid-cols-12">
            {[b, c].map(
              (p, i) =>
                p && (
                  <article
                    key={p.slug}
                    className={`border-t-4 border-ink pt-8 ${i === 0 ? "lg:col-span-7" : "lg:col-span-5"}`}
                  >
                    <ProjectVisual
                      project={p}
                      sizes={
                        i === 0
                          ? "(min-width: 1280px) 680px, (min-width: 1024px) 56vw, 100vw"
                          : "(min-width: 1280px) 480px, (min-width: 1024px) 40vw, 100vw"
                      }
                    />
                    <div className="mt-6">
                      <SpreadText project={p} index={i + 1} />
                    </div>
                  </article>
                ),
            )}
          </div>
        </div>
      )}

      <div className="shell tier-b">
        <p className="t-lead">
          <TextLink to="/work">All {WORK_INDEX.length} projects</TextLink>
        </p>
      </div>
    </div>
  );
}
