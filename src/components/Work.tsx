import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { featured, otherWork, profile, type Project } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";
import Figure from "./Figure";
import ProjectDialog from "./ProjectDialog";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * Pixels per second, not per frame. A per-frame step ties the speed to the
 * refresh rate, and anywhere the loop runs below 60fps the rail crawls: it was
 * measuring 2.7 px/sec, which is 147 seconds per card and reads as static.
 */
const DRIFT_PER_SECOND = 42;

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
            <span className="font-display text-lg leading-none text-accent">
              {figure.value}
            </span>
            <span className="text-[11px] leading-none text-muted">{figure.label}</span>
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
        <li key={item} className="relative pl-4 text-[12px] leading-snug text-muted">
          <span aria-hidden className="absolute left-0 top-[0.55em] h-px w-2.5 bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

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
      <div className="mb-2.5 flex min-h-[2.4em] items-baseline gap-3">
        <span className="text-[12px] text-accent">{String(n).padStart(2, "0")}</span>
        <h3 className="font-display text-base leading-tight tracking-tight text-ink sm:text-lg">
          {project.title}
        </h3>
      </div>

      {project.shot ? (
        <Figure
          src={project.shot}
          alt={project.shotAlt ?? ""}
          ratio={project.shotRatio}
          priority
        />
      ) : (
        <Figures project={project} />
      )}

      <p className="mt-3 text-[14px] leading-snug text-ink">{project.summary}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {project.stack.map((item) => (
          <li
            key={item}
            className="border border-rule px-2 py-1 text-[11px] leading-none text-muted"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="text-[12px] text-muted">
          {project.kind}, {project.year}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-accent-2">
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

/**
 * The rest of the shelf, as a count and a link rather than a list.
 *
 * Two decisions, both deliberate. It is not a slide in the rail: it is an
 * index, not a project, and standing in the same row of frames it read as
 * though it were a ninth build. And it names nothing. Of the eleven behind
 * this link, four are browser toys and four are coursework, and setting those
 * names beside the eight builds above argues against the work rather than for
 * it. Anyone who wants that depth is one click from all of it.
 */
function IndexBand() {
  return (
    <div className="index-band mx-auto max-w-shell px-5 pb-4 sm:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-rule pt-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-base leading-none tracking-tight text-ink">
            Everything else
          </h3>
          <p className="text-[13px] leading-none text-muted">
            {otherWork.length} more on GitHub, from a crime-detection model to OS
            scheduling algorithms and browser toys.
          </p>
        </div>

        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-[13px] text-accent-2"
        >
          All repositories
          <ArrowUpRightIcon
            size={13}
            weight="bold"
            className="transition-transform group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </div>
  );
}

/**
 * A rail that slides continuously, with each project appearing once.
 *
 * There is no duplicated second copy of the set. The track is translated left a
 * fraction of a pixel per frame, and as soon as the leading card has fully
 * passed the edge it is sent to the back by rewriting its flex `order`, with
 * the same width taken back off the offset. Nothing remounts and nothing
 * repeats: the card that leaves on the left is the one that returns on the
 * right, after the others have had their turn.
 *
 * `order` rather than rotating a React array, because a style write lands in
 * the same frame as the transform. Rotating state would leave the DOM one
 * render behind the offset and show a card-width jump on every recycle.
 *
 * It stops on hover, on focus, while a case study is open, when the tab is
 * hidden, and under reduced motion. Below the large breakpoint there is no rail
 * at all: the cards stack.
 */
export default function Work() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  // Where the track sits, and where it is heading. The arrows move the target;
  // the loop eases the offset toward it on top of the constant drift.
  const offsetRef = useRef(0);
  const targetRef = useRef(0);
  const [open, setOpen] = useState<Project | null>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const halted = paused || reduced || open !== null;
  // Read inside the frame loop so pausing never tears the loop down. The
  // effect used to depend on `halted`, so every hover ran its cleanup, wiped
  // the transform and reset `head` to zero, losing the recycle position.
  const haltedRef = useRef(halted);
  useEffect(() => {
    haltedRef.current = halted;
  }, [halted]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (reduced) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const cards = Array.from(track.children) as HTMLElement[];
    const count = cards.length;
    if (count === 0) return;

    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    let head = 0;

    const applyOrder = () => {
      cards.forEach((card, i) => {
        card.style.order = String((i - head + count) % count);
      });
    };
    applyOrder();

    let frame = 0;
    let last = performance.now();

    const step = (now: number) => {
      // Clamped, so a backgrounded tab returning does not jump the rail by
      // however many seconds it was away.
      const elapsed = Math.min((now - last) / 1000, 0.05);
      last = now;

      // The drift advances the target and the offset chases it. Advancing the
      // offset instead left the easing pulling back toward a target that never
      // moved, so the two cancelled at about three pixels and the rail sat
      // still. That was the bug that made the projects look frozen.
      if (!haltedRef.current) targetRef.current += DRIFT_PER_SECOND * elapsed;
      offsetRef.current += (targetRef.current - offsetRef.current) * 0.12;

      const leadWidth = cards[head].offsetWidth + gap;
      if (offsetRef.current >= leadWidth) {
        offsetRef.current -= leadWidth;
        targetRef.current -= leadWidth;
        head = (head + 1) % count;
        applyOrder();
      }

      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      track.style.transform = "";
      cards.forEach((card) => {
        card.style.order = "";
      });
    };
  }, [reduced]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const nudge = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-case]");
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    targetRef.current += direction * ((card?.offsetWidth ?? 320) + gap);
  }, []);

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
        role="region"
        aria-label="Projects. Slides on its own; hover or focus to stop it."
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        className={`work-rail short-trim mt-5 px-5 pb-4 sm:px-8 sm:pb-5 ${
          // With the drift off there is nothing to bring the later cards into
          // view, so the rail has to be scrollable by hand instead.
          reduced ? "lg:overflow-x-auto" : "lg:overflow-hidden"
        }`}
      >
        <div
          ref={trackRef}
          className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-8 lg:will-change-transform"
        >
          {featured.map((project, i) => (
            <div key={project.slug} data-case className="lg:shrink-0">
              <Reveal index={Math.min(i, 4)} className="h-full">
                <Card project={project} n={i + 1} onOpen={setOpen} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>

      <Reveal>
        <IndexBand />
      </Reveal>

      <ProjectDialog project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
