import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { featured, otherWork, profile, type Project } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";
import Figure from "./Figure";
import ProjectDialog from "./ProjectDialog";
import { useReducedMotion } from "../hooks/useReducedMotion";

// Pixels per frame at 60fps. Slow enough to read a title as it passes.
const DRIFT = 0.4;

function Card({
  project,
  n,
  onOpen,
}: {
  project: Project;
  n: number;
  onOpen: (p: Project) => void;
}) {
  return (
    <button
      onClick={() => onOpen(project)}
      aria-label={`Open the ${project.title} case study`}
      className="group flex h-full w-full flex-col border border-rule bg-raised/50 p-4 text-left backdrop-blur-sm transition-colors hover:border-accent focus-visible:border-accent"
    >
      {/* A floor here so a title that wraps cannot push its frame out of line
          with the frames either side of it. */}
      <div className="mb-3 flex min-h-[2.4em] items-baseline gap-3">
        <span className="text-[12px] text-accent">{String(n).padStart(2, "0")}</span>
        <h3 className="font-display text-base leading-tight tracking-tight text-ink sm:text-lg">
          {project.title}
        </h3>
      </div>

      <Figure
        src={project.shot!}
        alt={project.shotAlt ?? ""}
        ratio={project.shotRatio}
        priority
      />

      <p className="mt-3 line-clamp-2 text-[14px] leading-snug text-ink">
        {project.summary}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="text-[12px] text-muted">
          {project.kind}, {project.year}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-accent">
          View case
          <ArrowUpRightIcon
            size={12}
            weight="bold"
            className="transition-transform group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </button>
  );
}

/** The tail of the rail: everything that is not one of the highlighted builds. */
function IndexCard() {
  return (
    <article className="index-slide flex h-full flex-col justify-center border border-rule bg-raised/50 p-5 backdrop-blur-sm">
      <h3 className="font-display text-base leading-tight tracking-tight text-ink sm:text-lg">
        Everything else
      </h3>
      <ul className="mt-4 flex flex-col">
        {otherWork.map((project) => (
          <li key={project.slug} className="border-t border-rule py-2.5">
            <a
              href={project.live ?? project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline justify-between gap-3"
            >
              <span className="text-[14px] text-ink group-hover:text-accent">
                {project.title}
              </span>
              <span className="shrink-0 text-[11px] text-muted">{project.kind}</span>
            </a>
          </li>
        ))}
      </ul>
      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex w-fit items-center gap-2 bg-accent-solid px-4 py-2.5 text-[13px] text-on-accent transition-transform hover:-translate-y-[2px]"
      >
        All repositories
        <ArrowUpRightIcon size={13} weight="bold" />
      </a>
    </article>
  );
}

/**
 * A rail that slides on its own.
 *
 * The track holds two copies of the same set. A frame loop nudges scrollLeft
 * along and wraps at the halfway mark, which lands on an identical frame, so
 * the loop has no seam. It drifts rather than steps because motion at the edge
 * of the screen is what says there is more to the side.
 *
 * It stops on hover, on focus, while a case study is open, when the tab is
 * hidden, and under reduced motion. Below the large breakpoint there is no
 * rail at all: the cards stack.
 */
export default function Work() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const halted = paused || reduced || open !== null;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || halted) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    // The position is accumulated as a float here rather than read back off
    // the element: scrollLeft rounds, so adding a sub-pixel drift to it every
    // frame rounds straight back down and the rail never moves at all.
    let position = rail.scrollLeft;
    let frame = 0;

    const step = () => {
      const half = rail.scrollWidth / 2;
      position += DRIFT;
      if (position >= half) position -= half;
      rail.scrollLeft = position;
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [halted]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const nudge = useCallback((direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-case]");
    const step = card ? card.offsetWidth + 32 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  // Two copies so the wrap lands on an identical frame.
  const loop = [...featured, ...featured];

  return (
    <section id="work" className="border-b border-rule">
      <div className="mx-auto max-w-shell section-pad short-trim px-5 pb-0 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div>
              <h2
                tabIndex={-1}
                className="h-section font-display leading-[1.06] tracking-tight text-ink outline-none"
              >
                <MaskText text="Projects that stand out." />
              </h2>
              <p className="mt-2 max-w-[46ch] text-[14px] leading-snug text-muted">
                Open any one for the problem, what I built, and how it turned out.
              </p>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <button
                onClick={() => nudge(-1)}
                aria-label="Previous project"
                className="grid h-10 w-10 place-items-center border border-rule text-ink transition-colors hover:border-accent"
              >
                <ArrowLeftIcon size={15} weight="bold" />
              </button>
              <button
                onClick={() => nudge(1)}
                aria-label="Next project"
                className="grid h-10 w-10 place-items-center border border-rule text-ink transition-colors hover:border-accent"
              >
                <ArrowRightIcon size={15} weight="bold" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      <div
        ref={railRef}
        role="region"
        aria-label="Projects. Slides on its own; hover or focus to stop it."
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        className="work-rail short-trim mt-5 flex flex-col gap-8 px-5 pb-4 sm:px-8 sm:pb-6 lg:flex-row lg:items-stretch lg:gap-8 lg:overflow-x-auto lg:pb-6"
      >
        {loop.map((project, i) => (
          <div
            key={`${project.slug}-${i}`}
            data-case
            // The second copy exists only to make the wrap seamless; it is a
            // duplicate, so it is hidden from assistive technology.
            aria-hidden={i >= featured.length}
            className="lg:shrink-0"
          >
            <Reveal index={Math.min(i, 4)} className="h-full">
              <Card project={project} n={(i % featured.length) + 1} onOpen={setOpen} />
            </Reveal>
          </div>
        ))}
        <div className="index-card lg:shrink-0">
          <Reveal index={5} className="h-full">
            <IndexCard />
          </Reveal>
        </div>
      </div>

      <ProjectDialog project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
