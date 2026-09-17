import { useCallback, useState } from "react";
import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";
import { featured, notable, otherWork, type Project } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";
import Figure from "./Figure";
import ProjectDialog from "./ProjectDialog";

/** Chips beyond this go to the case study, where there is room for the list. */
const CARD_STACK = 3;

/**
 * Stands in for the screenshot on work that has no interface to photograph,
 * such as a trained model. These are the measured figures from the project's
 * own results, in the same box a shot would occupy, rather than a mocked-up
 * screen pretending to be a product.
 */
function Figures({ project }: { project: Project }) {
  if (project.figures?.length) {
    return (
      <div
        style={{ aspectRatio: "16 / 10" }}
        className="grid grid-cols-2 gap-px border border-rule bg-rule"
      >
        {project.figures.slice(0, 4).map((figure) => (
          <div
            key={figure.label}
            className="flex flex-col items-center justify-center gap-1 bg-raised"
          >
            <span className="num font-display text-[1.75rem] leading-none text-accent">
              {figure.value}
            </span>
            <span className="font-mono text-[12px] leading-none text-muted">{figure.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ul
      style={{ aspectRatio: "16 / 10" }}
      className="flex flex-col justify-center gap-2.5 border border-rule bg-raised px-4"
    >
      {(project.highlights ?? []).slice(0, 4).map((item) => (
        <li key={item} className="relative pl-4 text-[13px] leading-snug text-muted">
          <span aria-hidden className="absolute left-0 top-[0.55em] h-px w-2.5 bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Live and source, as two small links. Shared by the grid and the list. */
function Links({ project }: { project: Project }) {
  return (
    <span className="relative z-20 flex shrink-0 items-center gap-4">
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title}, live`}
          className="tap inline-flex items-center gap-1 text-[13px] text-accent-2 transition-colors hover:text-accent"
        >
          Live
          <ArrowUpRightIcon size={12} weight="bold" />
        </a>
      )}
      <a
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} source on GitHub`}
        className="tap inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-accent"
      >
        Code
        <ArrowUpRightIcon size={12} weight="bold" />
      </a>
    </span>
  );
}

function Card({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const extra = project.stack.length - CARD_STACK;

  return (
    <div
      data-card
      className="group relative flex h-full w-full flex-col border border-rule bg-raised/50 p-4 text-left backdrop-blur-sm transition-[border-color,transform] duration-200 ease-out hover:-translate-y-1 hover:border-accent focus-within:-translate-y-1 focus-within:border-accent"
    >
      {/* The case study is the whole card: a real button stretched across it,
          so it stays keyboard reachable and is announced as a control. The
          live and source links sit above it on z-20 with their own hit area. */}
      <button
        onClick={() => onOpen(project)}
        aria-label={`Open the ${project.title} case study`}
        className="absolute inset-0 z-10"
      />

      <div className="mb-3 flex items-baseline gap-3">
        <h2 className="font-display text-[1.75rem] leading-[1.04] text-ink">{project.title}</h2>
        <ArrowUpRightIcon
          size={14}
          weight="bold"
          aria-hidden
          className="ml-auto shrink-0 self-start text-muted transition-transform group-hover:-translate-y-0.5 group-hover:text-accent"
        />
      </div>

      {project.shot ? (
        <Figure src={project.shot} alt={project.shotAlt ?? ""} ratio={project.shotRatio} priority />
      ) : (
        <Figures project={project} />
      )}

      <p className="mt-3 text-[15px] leading-snug text-ink">{project.summary}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {project.stack.slice(0, CARD_STACK).map((item) => (
          <li
            key={item}
            className="border border-rule px-2 py-1 font-mono text-[12px] leading-none text-muted"
          >
            {item}
          </li>
        ))}
        {extra > 0 && (
          <li className="px-1 py-1 font-mono text-[12px] leading-none text-muted">+{extra}</li>
        )}
      </ul>

      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <span className="flex flex-col gap-0.5 font-mono text-[13px] text-muted">
          <span>
            {project.kind}, {project.year}
          </span>
          {/* Said on the card, not only in the case study: a team project read
              from the grid alone should not pass as solo work. */}
          {project.team && project.role && <span className="text-accent-2">{project.role}</span>}
        </span>
        <Links project={project} />
      </div>
    </div>
  );
}

/**
 * The next six, as rows rather than a second grid of cards. Each still opens
 * its case study. The small browser games and coursework are not named here at
 * all: they are on /repositories, one click away, where they do not stand
 * beside the work above and argue against it.
 */
function MoreProjects({ onOpen }: { onOpen: (p: Project) => void }) {
  const total = featured.length + notable.length + otherWork.length;

  return (
    <div className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h2 className="text-lg font-medium leading-none text-ink">More projects</h2>
        <Link
          to="/repositories"
          className="tap group inline-flex items-center gap-2 text-[14px] text-accent-2"
        >
          All {total} projects, with source
          <ArrowRightIcon
            size={14}
            weight="bold"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <ul className="mt-4 border-t border-ink/30">
        {notable.map((project, i) => (
          <Reveal as="li" key={project.slug} index={Math.min(i, 4)}>
            <div className="group relative grid gap-x-8 gap-y-1.5 border-b border-rule py-4 md:grid-cols-12 md:items-baseline">
              <button
                onClick={() => onOpen(project)}
                aria-label={`Open the ${project.title} case study`}
                className="absolute inset-0 z-10"
              />
              <h3 className="text-[16px] font-medium leading-snug text-ink transition-colors group-hover:text-accent md:col-span-2">
                {project.title}
              </h3>
              <p className="text-[15px] leading-snug text-muted md:col-span-5">{project.summary}</p>
              <span className="flex flex-col font-mono text-[13px] text-muted md:col-span-3">
                <span>
                  {project.kind}, {project.year}
                </span>
                {project.team && project.role && (
                  <span className="text-accent-2">{project.role}</span>
                )}
              </span>
              <span className="md:col-span-2 md:justify-self-end">
                <Links project={project} />
              </span>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

/**
 * The best six in a fixed grid, and the next six as a list under it.
 *
 * This was a rail that slid on its own. It paused on hover, but a reader who
 * scrolls with the wheel and never hovers had cards slide away mid-sentence,
 * and the fourth card was always cut off at the edge. Someone reading to make
 * a decision does not want the thing they are reading to move.
 *
 * A case study can be linked to directly: /work#medihub opens it, which is how
 * the project rows on the home page get a visitor straight to one.
 */
export default function Work() {
  const [open, setOpen] = useState<Project | null>(null);
  const { hash, pathname } = useLocation();

  // Adjusted during render, not from an effect: opening the case study is a
  // reaction to the hash changing, the same pattern the header uses to close
  // its menu when the route changes.
  const [seenHash, setSeenHash] = useState("");
  if (hash !== seenHash) {
    setSeenHash(hash);
    const project = [...featured, ...notable].find((p) => `#${p.slug}` === hash);
    if (project) setOpen(project);
  }

  // Stable, because the dialog's effect depends on it and would otherwise tear
  // down and restore focus on every render.
  const close = useCallback(() => {
    setOpen(null);
    // Drop the hash, or closing and then reloading would open it again.
    if (window.location.hash) window.history.replaceState(null, "", pathname);
  }, [pathname]);

  return (
    <section id="work" className="border-b border-rule">
      <div className="mx-auto max-w-shell section-pad px-5 sm:px-8">
        <Reveal>
          <h1 tabIndex={-1} className="h-section font-display text-ink outline-none">
            <MaskText text="Selected projects." />
          </h1>
          <p className="mt-2 max-w-[52ch] text-[15px] leading-snug text-muted">
            Open any one for the problem, what was built, my part in it, and how it
            turned out.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <Reveal key={project.slug} index={Math.min(i, 4)} className="h-full">
              <Card project={project} onOpen={setOpen} />
            </Reveal>
          ))}
        </div>

        <MoreProjects onOpen={setOpen} />
      </div>

      <ProjectDialog project={open} onClose={close} />
    </section>
  );
}
