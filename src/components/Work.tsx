import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  GithubLogoIcon,
} from "@phosphor-icons/react";
import { featured, type Project } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";
import Figure from "./Figure";

function Meta({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[12px] text-muted">
      <span className="text-ink">{project.kind}</span>
      <span aria-hidden className="h-3 w-px bg-rule" />
      <span>{project.year}</span>
      <span aria-hidden className="h-3 w-px bg-rule" />
      <span>{project.stack.join(", ")}</span>
    </div>
  );
}

function Links({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-accent-solid px-5 py-2.5 font-mono text-[13px] text-on-accent transition-transform hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]"
        >
          {project.liveLabel ?? "Open"}
          <ArrowUpRightIcon size={14} weight="bold" />
        </a>
      )}
      <a
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-rule px-5 py-2.5 font-mono text-[13px] text-ink transition-colors hover:border-ink active:scale-[0.98]"
      >
        <GithubLogoIcon size={15} />
        Source
      </a>
    </div>
  );
}

function Case({ project, n }: { project: Project; n: number }) {
  return (
    <article className="flex h-full flex-col">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-mono text-[12px] text-accent">
          {String(n).padStart(2, "0")}
        </span>
        <h3 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {project.title}
        </h3>
      </div>

      <Figure
        src={project.shot!}
        alt={project.shotAlt ?? ""}
        ratio="aspect-[16/9]"
        priority={n === 1}
      />

      <p className="mt-4 max-w-measure text-[16px] leading-relaxed text-ink">
        {project.summary}
      </p>
      <div className="mt-3.5">
        <Meta project={project} />
      </div>

      <dl className="mt-5 flex flex-col gap-3.5 border-t border-rule pt-4">
        {[
          ["Problem", project.problem],
          ["What I built", project.approach],
          ["Outcome", project.outcome],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
              {k}
            </dt>
            <dd className="max-w-measure text-[14.5px] leading-[1.6] text-muted">
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <Links project={project} />
      </div>
    </article>
  );
}

/**
 * Five case studies.
 *
 * On a wide screen they run sideways in a scroll-snap rail. The five are peers,
 * and a horizontal track says that better than a vertical stack, where whatever
 * sits last reads as least important. It is native overflow rather than a
 * scroll hijack, so the page keeps scrolling normally, a trackpad swipe works,
 * and the arrows exist for anyone without one.
 *
 * Below the large breakpoint the rail collapses to an ordinary column. A
 * sideways rail of long-form text on a phone is a trap.
 */
export default function Work() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-case]");
    const step = card ? card.offsetWidth + 40 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="work" className="border-b border-rule">
      <div className="mx-auto max-w-shell px-5 pt-12 sm:px-8 sm:pt-16">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2
              tabIndex={-1}
              className="max-w-[20ch] text-[clamp(1.9rem,4.5vw,3rem)] font-medium leading-[1.05] tracking-tightest text-ink outline-none"
            >
              <MaskText text="Five builds, and why each one works the way it does." />
            </h2>

            {/* Rail controls, only where the rail exists. */}
            <div className="hidden items-center gap-2 lg:flex">
              <button
                onClick={() => nudge(-1)}
                disabled={atStart}
                aria-label="Previous project"
                className="grid h-11 w-11 place-items-center border border-rule text-ink transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-rule"
              >
                <ArrowLeftIcon size={16} weight="bold" />
              </button>
              <button
                onClick={() => nudge(1)}
                disabled={atEnd}
                aria-label="Next project"
                className="grid h-11 w-11 place-items-center border border-rule text-ink transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-rule"
              >
                <ArrowRightIcon size={16} weight="bold" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      <div
        ref={railRef}
        tabIndex={0}
        role="region"
        aria-label="Featured projects, scrolls sideways on wide screens"
        className="work-rail mt-10 flex flex-col gap-16 px-5 pb-16 sm:mt-16 sm:px-8 sm:pb-20 lg:flex-row lg:snap-x lg:snap-mandatory lg:items-start lg:gap-10 lg:overflow-x-auto lg:pb-20"
      >
        {featured.map((project, i) => (
          <div
            key={project.slug}
            data-case
            className="lg:w-[min(46vw,540px)] lg:shrink-0 lg:snap-start"
          >
            <Reveal index={i}>
              <Case project={project} n={i + 1} />
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
