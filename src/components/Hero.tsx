import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import HlsBackgroundVideo from "./HlsBackgroundVideo";
import { profile } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % profile.roles.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 },
      ).fromTo(
        ".blur-in",
        { opacity: 0, filter: "blur(10px)", y: 20 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1,
          stagger: 0.1,
          delay: 0.3,
        },
        "<",
      );
    }, containerRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center"
    >
      <HlsBackgroundVideo />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <span className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8">
          {profile.eyebrow}
        </span>

        <h1 className="name-reveal text-5xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6">
          {profile.name}
        </h1>

        <p className="blur-in text-base md:text-lg text-text-primary/80 mb-3 flex items-baseline justify-center gap-[0.28em]">
          <span>A</span>
          <span className="inline-grid justify-items-center">
            {/* Every role occupies the same grid cell, so the box is as wide as
                the longest word and the sentence never reflows mid-rotation. */}
            {profile.roles.map((role, i) => (
              <span
                key={role}
                aria-hidden={i !== roleIndex}
                className={`col-start-1 row-start-1 font-display italic text-text-primary text-xl md:text-2xl leading-none transition-opacity duration-500 ${
                  i === roleIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                {role}
              </span>
            ))}
          </span>
          <span>based in Bangladesh.</span>
        </p>

        <p className="blur-in text-sm md:text-base text-muted max-w-md mb-12">
          {profile.description}
        </p>

        <div className="blur-in inline-flex gap-4">
          <button
            onClick={() =>
              document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
            }
            className="group relative rounded-full transition-transform duration-300 hover:scale-105"
          >
            <span
              className="absolute -inset-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundImage: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)" }}
            />
            <span className="relative z-10 flex items-center rounded-full text-sm px-7 py-3.5 bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary transition-colors duration-300">
              See my work
            </span>
          </button>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative rounded-full transition-transform duration-300 hover:scale-105"
          >
            <span
              className="absolute -inset-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundImage: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)" }}
            />
            <span className="relative z-10 flex items-center rounded-full text-sm px-7 py-3.5 border-2 border-stroke group-hover:border-bg bg-bg text-text-primary transition-colors duration-300">
              Get in touch
            </span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-xs text-muted uppercase tracking-[0.2em]">Scroll</span>
        <div className="relative w-px h-10 bg-stroke overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-text-primary/70 animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
