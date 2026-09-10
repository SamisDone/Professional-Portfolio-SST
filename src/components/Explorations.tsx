import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { moreProjects, type Project } from "../data/content";
import ProjectVisual from "./ProjectVisual";
import ProjectModal from "./ProjectModal";
import { useReducedMotion } from "../hooks/useReducedMotion";

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
  fluid = false,
}: {
  project: Project;
  rotate: number;
  onSelect: (p: Project) => void;
  /** Fill the grid cell instead of using the marquee's fixed card width. */
  fluid?: boolean;
}) {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`pointer-events-auto ${fluid ? "w-full" : ""}`}
    >
      <button
        onClick={() => onSelect(project)}
        aria-label={`Read the ${project.title} case study`}
        className={`group relative block aspect-square rounded-2xl overflow-hidden bg-surface border border-stroke text-left shadow-xl shadow-black/40 transition-transform duration-300 hover:scale-105 hover:rotate-0 ${
          fluid ? "w-full" : "w-[140px] sm:w-[190px] md:w-[220px]"
        }`}
      >
        <ProjectVisual
          fill
          art={project.art}
          className="opacity-85 group-hover:opacity-100 transition-opacity duration-300"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, hsl(0 0% 4% / 0.94) 0%, hsl(0 0% 4% / 0.5) 52%, hsl(0 0% 4% / 0.08) 80%)",
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
            <p className="hidden sm:block text-[11px] text-text-primary/60 line-clamp-2">
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

const heading = (
  <>
    <div className="flex items-center gap-3 mb-4">
      <span className="w-8 h-px bg-stroke" />
      <span className="text-xs text-muted uppercase tracking-[0.3em]">
        More Projects
      </span>
    </div>
    <h2 className="text-4xl md:text-6xl font-display leading-[1.05] text-text-primary mb-4 drop-shadow-[0_2px_24px_rgba(0,0,0,0.9)]">
      Beyond the <span className="italic">bento grid</span>
    </h2>
    <p className="text-sm md:text-base text-text-primary/65 max-w-md mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
      Extensions, simulators, and hackathon builds. Every card opens its own
      short case study.
    </p>
  </>
);

function GithubLink() {
  return (
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
  );
}

export default function Explorations() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
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
  }, [reduced]);

  // Reduced motion: no pin, no infinite scroll, no rotation. Same content as a
  // plain responsive grid, which is the version that actually reads faster.
  if (reduced) {
    return (
      <section id="more-projects" className="bg-bg py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="mb-10">{heading}</div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {moreProjects.map((p) => (
              <ProjectCard
                key={p.title}
                project={p}
                rotate={0}
                onSelect={setSelected}
                fluid
              />
            ))}
          </div>
          <div className="mt-10">
            <GithubLink />
          </div>
        </div>
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      </section>
    );
  }

  return (
    <section
      id="more-projects"
      ref={sectionRef}
      className="relative min-h-[200vh] md:min-h-[240vh] bg-bg"
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

        {/* Soft edges so cards dissolve at the top and bottom of the viewport
            instead of being sliced off by the pin boundary. */}
        <div className="absolute inset-x-0 top-0 h-28 z-20 pointer-events-none bg-gradient-to-b from-bg to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 z-20 pointer-events-none bg-gradient-to-t from-bg to-transparent" />

        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          {heading}
          <GithubLink />
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
