import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { moreProjects, type Project } from "../data/content";
import ProjectVisual from "./ProjectVisual";

gsap.registerPlugin(ScrollTrigger);

const LEFT_COL = moreProjects.filter((_, i) => i % 2 === 0);
const RIGHT_COL = moreProjects.filter((_, i) => i % 2 === 1);
// Doubled so the loop can travel exactly one set's height and land back on
// an identical frame — that's what makes the wraparound invisible.
const LOOP_LEFT = [...LEFT_COL, ...LEFT_COL];
const LOOP_RIGHT = [...RIGHT_COL, ...RIGHT_COL];

function ProjectCard({
  project,
  rotate,
  onSelect,
}: {
  project: Project;
  rotate: number;
  onSelect: (p: Project) => void;
}) {
  return (
    <div style={{ transform: `rotate(${rotate}deg)` }} className="pointer-events-auto">
      <button
        onClick={() => onSelect(project)}
        className="group relative block aspect-square w-[140px] sm:w-[190px] md:w-[220px] rounded-2xl overflow-hidden bg-surface border border-stroke text-left shadow-xl shadow-black/40 transition-transform duration-300 hover:scale-105 hover:rotate-0"
      >
        <ProjectVisual
          art={project.art}
          className="absolute inset-0 opacity-70 group-hover:opacity-95 transition-opacity duration-300"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, hsl(0 0% 4% / 0.92) 0%, hsl(0 0% 4% / 0.35) 55%, transparent 78%)",
          }}
        />
        <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-5">
          <span className="text-[9px] sm:text-[10px] text-muted uppercase tracking-[0.15em]">
            {project.category}
          </span>
          <div>
            <h3 className="font-display italic text-lg sm:text-xl text-text-primary mb-1">
              {project.title}
            </h3>
            <p className="hidden sm:block text-[11px] text-muted line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

function AutoScrollColumn({
  items,
  duration,
  gapClass,
  rotateEven,
  rotateOdd,
  onSelect,
}: {
  items: Project[];
  duration: number;
  gapClass: string;
  rotateEven: number;
  rotateOdd: number;
  onSelect: (p: Project) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const tween = gsap.fromTo(
      el,
      { yPercent: -50 },
      { yPercent: 0, duration, ease: "none", repeat: -1 },
    );
    return () => {
      tween.kill();
    };
  }, [duration]);

  return (
    <div ref={trackRef} className={`flex flex-col ${gapClass} pointer-events-auto`}>
      {items.map((p, i) => (
        <ProjectCard
          key={`${p.title}-${i}`}
          project={p}
          rotate={i % 2 === 0 ? rotateEven : rotateOdd}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default function Explorations() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: contentRef.current,
        pinSpacing: false,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="more-projects"
      ref={sectionRef}
      className="relative min-h-[200vh] md:min-h-[300vh] bg-bg"
    >
      <div ref={contentRef} className="relative h-screen w-full overflow-hidden">
        {/* Two columns auto-scroll top-to-bottom on an infinite loop,
            independent of page scroll — anchored near the edges so they
            never contest the pinned heading, which renders above them. */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute -left-[5%] sm:left-[5%] md:left-[8%] inset-y-0 overflow-hidden flex items-center">
            <AutoScrollColumn
              items={LOOP_LEFT}
              duration={26}
              gapClass="gap-10 sm:gap-14 md:gap-20"
              rotateEven={-5}
              rotateOdd={4}
              onSelect={setSelected}
            />
          </div>
          <div className="absolute -right-[5%] sm:right-[5%] md:right-[8%] inset-y-0 overflow-hidden flex items-center">
            <AutoScrollColumn
              items={LOOP_RIGHT}
              duration={32}
              gapClass="gap-10 sm:gap-14 md:gap-20"
              rotateEven={5}
              rotateOdd={-4}
              onSelect={setSelected}
            />
          </div>
        </div>

        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">
              More Projects
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display leading-[1.05] text-text-primary mb-4 drop-shadow-[0_2px_24px_rgba(0,0,0,0.8)]">
            Beyond the <span className="italic">bento grid</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-md mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Extensions, simulators, and hackathon builds — the rest of the
            shelf.
          </p>
          <a
            href="https://github.com/SamisDone"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto group relative inline-flex rounded-full"
          >
            <span
              className="absolute -inset-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundImage: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)" }}
            />
            <span className="relative z-10 inline-flex items-center gap-2 rounded-full border border-stroke bg-bg px-5 py-2.5 text-sm text-text-primary">
              View GitHub <span aria-hidden>↗</span>
            </span>
          </a>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full rounded-3xl bg-surface border border-stroke overflow-hidden"
            >
              <ProjectVisual art={selected.art} className="h-40 w-full" />
              <div className="p-8">
                <span className="text-xs text-muted uppercase tracking-[0.2em]">
                  {selected.category}
                </span>
                <h3 className="font-display italic text-3xl text-text-primary mt-2 mb-3">
                  {selected.title}
                </h3>
                <p className="text-sm text-muted mb-5">{selected.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selected.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] uppercase tracking-wide text-muted border border-stroke rounded-full px-2 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <a
                    href={selected.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center rounded-full border border-stroke px-4 py-2.5 text-sm text-text-primary hover:bg-stroke/40 transition-colors"
                  >
                    Code
                  </a>
                  {selected.live && (
                    <a
                      href={selected.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center rounded-full bg-text-primary text-bg px-4 py-2.5 text-sm hover:opacity-90 transition-opacity"
                    >
                      Live
                    </a>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute top-4 right-4 text-white hover:text-white/70"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
