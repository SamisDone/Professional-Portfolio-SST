import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  GithubLogoIcon,
  PlusIcon,
  MinusIcon,
} from "@phosphor-icons/react";
import { featured, otherWork, profile, type Project } from "../data/content";
import { AnimatePresence, motion } from "framer-motion";
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
          className="inline-flex items-center gap-2 bg-accent-solid px-4 py-2 font-mono text-[12.5px] text-on-accent transition-transform hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]"
        >
          {project.liveLabel ?? "Open"}
          <ArrowUpRightIcon size={14} weight="bold" />
        </a>
      )}
      <a
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-rule px-4 py-2 font-mono text-[12.5px] text-ink transition-colors hover:border-ink active:scale-[0.98]"
      >
        <GithubLogoIcon size={15} />
        Source
      </a>
    </div>
  );
}

function Case({ project, n }: { project: Project; n: number }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="flex h-full flex-col">
      <div className="mb-2.5 flex min-h-[2.5em] items-baseline gap-3">
        <span className="font-mono text-[12px] text-accent">
          {String(n).padStart(2, "0")}
        </span>
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

      <p data-card-summary className="mt-3.5 text-[14.5px] leading-snug text-ink">
        {project.summary}
      </p>
      <div data-card-meta className="mt-2.5">
        <Meta project={project} />
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group mt-3.5 flex min-h-[2.4rem] items-center justify-between gap-3 border-t border-rule pt-2.5 text-left"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
          {open ? "Hide the reasoning" : "Why it works this way"}
        </span>
        <span aria-hidden className="text-muted transition-colors group-hover:text-accent">
          {open ? <MinusIcon size={15} /> : <PlusIcon size={15} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.dl
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 pt-4">
              {[
                ["Problem", project.problem],
                ["What I built", project.approach],
                ["Outcome", project.outcome],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {k}
                  </dt>
                  <dd className="text-[14px] leading-[1.55] text-muted">{v}</dd>
                </div>
              ))}
            </div>
          </motion.dl>
        )}
      </AnimatePresence>

      {/* mt-auto pins the actions to the foot of every card. */}
      <div className="mt-auto pt-4">
        <Links project={project} />
      </div>
    </article>
  );
}

/** The last slide: everything that is not one of the five. */
function IndexSlide() {
  return (
    <article className="index-slide flex h-full flex-col justify-center border border-rule bg-raised/60 p-6 backdrop-blur-sm">
      <h3 className="font-display text-base leading-tight tracking-tight text-ink sm:text-lg">
        Everything else
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">
        Five more builds, from a scheduling simulator to a hackathon MVP.
      </p>
      <ul className="mt-6 flex flex-col">
        {otherWork.map((p) => (
          <li key={p.slug} className="border-t border-rule py-3">
            <a
              href={p.live ?? p.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline justify-between gap-4"
            >
              <span className="text-[15px] text-ink group-hover:text-accent">
                {p.title}
              </span>
              <span className="shrink-0 font-mono text-[11px] text-muted">{p.kind}</span>
            </a>
          </li>
        ))}
      </ul>
      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex w-fit items-center gap-2 bg-accent-solid px-4 py-2 font-mono text-[12.5px] text-on-accent transition-transform hover:-translate-y-[2px]"
      >
        All repositories
        <ArrowUpRightIcon size={14} weight="bold" />
      </a>
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
              className="max-w-[20ch] h-section font-display leading-[1.06] tracking-tight text-ink outline-none"
            >
              <MaskText text="Five builds." />
            </h2>
            <p className="mt-2 max-w-[46ch] text-[14px] leading-snug text-muted">
              And why each one works the way it does.
            </p>

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
        data-arrow-surface
        role="region"
        aria-label="Featured projects. Scrolls sideways on wide screens; use the arrow buttons or scroll."
        className="work-rail mt-7 flex flex-col gap-8 px-5 pb-16 sm:mt-16 sm:px-8 sm:pb-20 lg:flex-row lg:snap-x lg:snap-mandatory lg:items-stretch lg:gap-10 lg:overflow-x-auto lg:pb-0"
      >
        {featured.map((project, i) => (
          <div
            key={project.slug}
            data-case
            className="lg:shrink-0 lg:snap-start"
          >
            <Reveal index={i} className="h-full">
              <Case project={project} n={i + 1} />
            </Reveal>
          </div>
        ))}
        <div className="index-card lg:shrink-0 lg:snap-start">
          <Reveal index={featured.length} className="h-full">
            <IndexSlide />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
