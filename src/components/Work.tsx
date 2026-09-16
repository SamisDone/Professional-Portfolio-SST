import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { featured, otherWork, type Project } from "../data/content";
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
            <span className="num font-display text-[1.75rem] leading-none text-accent">
              {figure.value}
            </span>
            <span className="font-mono text-[11px] leading-none text-muted">{figure.label}</span>
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
    <div
      data-card
      className="group relative flex h-full w-full flex-col border border-rule bg-raised/50 p-3.5 text-left backdrop-blur-sm transition-[border-color,transform] duration-200 ease-out hover:-translate-y-1 hover:border-accent focus-within:-translate-y-1 focus-within:border-accent">
      {/* The card used to be one button, which is why the running product and
          the source were three clicks away behind the case study. They are two
          links in the footer now, and the case study is still the whole card:
          a real button stretched across it, so it stays keyboard reachable and
          is still announced as a control. The links sit above it on z-20 and
          keep their own hit area. */}
      <button
        onClick={() => onOpen(project)}
        aria-label={`Open the ${project.title} case study`}
        className="absolute inset-0 z-10"
      />

      {/* A floor here so a title that wraps cannot push its frame out of line
          with the frames either side of it. */}
      <div className="mb-2 flex min-h-[2.4em] items-baseline gap-3">
        <span className="font-mono text-[12px] text-accent">{String(n).padStart(2, "0")}</span>
        <h2 className="font-display text-[1.75rem] leading-[1.04] text-ink">
          {project.title}
        </h2>
        {/* The affordance for the case study, which used to be the words "View
            case" in the footer. The footer row is the same height as it was and
            now carries the live and source links instead, so the card gained
            two destinations without gaining a pixel. */}
        <ArrowUpRightIcon
          size={13}
          weight="bold"
          aria-hidden
          className="ml-auto shrink-0 self-start text-muted transition-transform group-hover:-translate-y-0.5 group-hover:text-accent"
        />
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

      <p className="mt-2.5 text-[14px] leading-snug text-ink">{project.summary}</p>

      <ul className="mt-2.5 flex flex-wrap gap-1.5">
        {project.stack.map((item) => (
          <li
            key={item}
            className="border border-rule px-2 py-1 font-mono text-[11px] leading-none text-muted"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-3 pt-3.5">
        <span className="font-mono text-[12px] text-muted">
          {project.kind}, {project.year}
        </span>
        <span className="relative z-20 flex items-center gap-3">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title}, live`}
              className="tap inline-flex items-center gap-1 text-[12px] text-accent-2 transition-colors hover:text-accent"
            >
              Live
              <ArrowUpRightIcon size={11} weight="bold" />
            </a>
          )}
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} source on GitHub`}
            className="tap inline-flex items-center gap-1 text-[12px] text-muted transition-colors hover:text-accent"
          >
            Code
            <ArrowUpRightIcon size={11} weight="bold" />
          </a>
        </span>
      </div>
    </div>
  );
}

/**
 * The rest of the shelf, as a count and a link rather than a list.
 *
 * Two decisions, both deliberate. It is not a slide in the rail: it is an
 * index, not a project, and standing in the same row of frames it read as
 * though it were one more build. And it names nothing: four of the fifteen
 * behind this link are browser toys and four are coursework, and setting those
 * titles beside the ten above argues against the work rather than for it.
 * Anyone who wants that depth is one click from all of it.
 */
function IndexBand() {
  return (
    <div className="index-band mx-auto max-w-shell px-5 pb-3 sm:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-rule pt-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-lg font-medium leading-none text-ink">
            Everything else
          </h2>
          <p className="text-[13px] leading-none text-muted">
            {otherWork.length} more, from a Kanban board and a rental platform
            to a crime-detection model, OS scheduling and browser toys.
          </p>
        </div>

        <Link
          to="/repositories"
          className="tap group inline-flex items-center gap-2 text-[13px] text-accent-2"
        >
          List them all
          <ArrowRightIcon
            size={13}
            weight="bold"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
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
              <h1
                tabIndex={-1}
                className="h-section font-display text-ink outline-none"
              >
                <MaskText text="Projects that stand out." />
              </h1>
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
                // The gap above the rail is 20px either way, but 8px of it is the
        // rail's own padding rather than margin. The rail is clipped twice,
        // by `overflow-hidden` and by the edge-fade mask, and both clip at
        // its box: a card lifting 4px on hover had its top border cut off,
        // and the focus ring with it. Padding moves the clip line up
        // without moving the cards or costing the page any height.
        className={`work-rail short-trim mt-3 px-5 pb-3 pt-2 sm:px-8 sm:pb-4 ${
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
