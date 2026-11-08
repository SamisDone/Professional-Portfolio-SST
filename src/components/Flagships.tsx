import { useEffect, useRef, useState } from "react";
import type { Project } from "../data/content";
import { scan } from "../lib/motion";
import { FLAGSHIPS, WORK_INDEX, caseStudyPath, preloadShot, shotPreview, teamLine } from "../lib/projects";
import { ProjectFrame, ShotPicture } from "./Exhibit";
import { Label, ProofMark, TextLink } from "./ui";

const n = (i: number) => String(i + 1).padStart(2, "0");

/** A phone's own small picture for a row, 16:10, at 40% of the row. */
function Thumb({ project, eager }: { project: Project; eager: boolean }) {
  if (!project.shot) return null;
  const preview = shotPreview(project.shot);
  return (
    <ShotPicture
      src={project.shot}
      sizes="(min-width: 1024px) 1px, 40vw"
      alt=""
      width={700}
      height={438}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      style={{ backgroundImage: preview && `url(${preview})` }}
      className="aspect-[16/10] w-full border-2 border-ink bg-paper-2 bg-cover bg-top object-cover object-top lg:hidden"
    />
  );
}

/** One flagship as a row: number, kind and year, title, one line, three ways in. */
function FlagRow({
  project,
  index,
  selected,
  onPick,
}: {
  project: Project;
  index: number;
  selected: boolean;
  onPick: () => void;
}) {
  return (
    <li
      data-flag-row
      aria-current={selected ? "true" : undefined}
      onPointerEnter={onPick}
      onFocus={onPick}
      className="tint-row grid grid-cols-[40%_minmax(0,1fr)] gap-x-4 border-t border-ink py-5 first:border-t-0 first:pt-0 lg:block lg:py-5 lg:pl-5 lg:first:pt-5"
    >
      <Thumb project={project} eager={index === 0} />
      <div>
        <Label stamp className="text-ink">
          {n(index)} / {project.kind}, {project.year}
        </Label>
        {teamLine(project) && <Label className="mt-1">{teamLine(project)}</Label>}
        <h3 className="t-h3 mt-2">
          <TextLink to={caseStudyPath(project)} arrow={false} className="font-bold">
            {project.title}
          </TextLink>
        </h3>
        <p className="t-small mt-2 max-w-measure">{project.summary}</p>
        {project.figureNote && <Label className="mt-2">{project.figureNote}</Label>}
        <div className="tap-row mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <TextLink to={caseStudyPath(project)} className="t-small font-semibold">
            Read the case study
          </TextLink>
          {project.live && (
            <ProofMark href={project.live} label={`${project.title}, ${project.liveLabel ?? "live"}`} className="t-small">
              {project.liveLabel ?? "Live"}
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

/**
 * The three flagships as an index and a viewer. From lg, one exhibit frame
 * (seven columns) beside the three as numbered rows (five): hovering or
 * keyboard-focusing a row crossfades that project's screenshot and caption
 * into the frame.
 * The first row is selected in the prerendered page, and the frame changes
 * only when a row is pointed at or focused, never on its own. Below lg there
 * is no shared frame: each row carries its own small picture.
 *
 * Its 4px opening rule sits close to the proof row, so on a desktop the top
 * of the frame, and on a phone the rule and the first row's label, reach the
 * first screen.
 */
export default function Flagships() {
  const [active, setActive] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // A swapped-in exhibit is new to the motion layer: hand it over. Under
  // reduced motion the layer is off and the swap is instant.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (frame.current) scan(frame.current);
  }, [active]);

  const pick = (i: number) => {
    if (i !== active) setActive(i);
  };
  // The other two pictures load once the list is pointed at or focused, so a
  // swap rarely waits on the network.
  const warm = () => FLAGSHIPS.forEach(preloadShot);

  return (
    <section aria-labelledby="flagships" className="shell pt-4 sm:pt-8">
      <div data-flagships className="border-t-4 border-ink pt-4 sm:pt-6 lg:grid lg:grid-cols-12 lg:gap-8">
        {/* For the outline only: the numbered labels say what these are, and
            a visible heading here pushed Flagship 01 off the first screen. */}
        <h2 id="flagships" className="sr-only">
          Flagships
        </h2>
        <div ref={frame} data-flag-frame className="hidden lg:col-span-7 lg:block">
          <ProjectFrame
            projects={FLAGSHIPS}
            active={FLAGSHIPS[active].slug}
            sizes="(min-width: 1280px) 690px, 56vw"
            priority={FLAGSHIPS[0].slug}
          />
        </div>
        <ol
          className="m-0 list-none p-0 lg:col-span-5 lg:border-l-2 lg:border-ink"
          onPointerEnter={warm}
          onFocus={warm}
        >
          {FLAGSHIPS.map((p, i) => (
            <FlagRow key={p.slug} project={p} index={i} selected={i === active} onPick={() => pick(i)} />
          ))}
        </ol>
      </div>

      <div className="tier-b">
        <p className="t-lead">
          <TextLink to="/work">{WORK_INDEX.length} projects on the work page</TextLink>
        </p>
      </div>
    </section>
  );
}
