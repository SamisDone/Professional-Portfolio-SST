import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { profile } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import MaskText from "./MaskText";
import ShotDeck from "./ShotDeck";

/**
 * The first screen. Four things and one picture: who, what, where to go, and
 * the work itself.
 *
 * The name is the display, set across two lines at poster scale with the
 * surname in the italic accent, because a portfolio's first job is to be
 * remembered by name. Beside it, the shot deck puts real running products in
 * front of a visitor before they have read a word.
 *
 * The secondary action goes to the research rather than to the résumé: the CV
 * is already a button in the header, and two routes to the same PDF on one
 * screen spent a slot the research deserved.
 */
export default function Hero() {
  const reduced = useReducedMotion();
  const rise = (i: number, base = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0 : 0.7,
      delay: reduced ? 0 : base + i * 0.08,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    <section id="top" className="flex flex-1 flex-col justify-center overflow-x-clip border-b border-rule">
      <div className="hero-grid mx-auto grid w-full max-w-shell items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <motion.p
            {...rise(0)}
            className="mb-5 font-mono text-[12px] uppercase tracking-[0.16em] text-accent"
          >
            {profile.standfirst}
            <span className="text-muted"> / Open to internships</span>
          </motion.p>

          <h1 tabIndex={-1} className="hero-name font-display text-ink outline-none">
            <MaskText text={profile.name} immediate delay={0.08} italicFrom={1} />
          </h1>

          <motion.p
            {...rise(0, 0.5)}
            className="hero-sub mt-6 max-w-[40ch] text-[17px] leading-relaxed text-muted sm:text-[19px]"
          >
            {profile.positioning}
          </motion.p>

          <motion.div {...rise(1, 0.5)} className="hero-cta mt-8 flex flex-wrap gap-3">
            <Link
              to="/work"
              className="group inline-flex items-center gap-2.5 bg-accent-solid px-6 py-3.5 text-sm font-medium text-on-accent transition-transform hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]"
            >
              See the work
              <ArrowRightIcon
                size={15}
                weight="bold"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/research"
              className="group inline-flex items-center gap-2.5 border border-rule px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink active:scale-[0.98]"
            >
              Read the research
              <ArrowRightIcon
                size={15}
                weight="bold"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.3 }}
          className="hero-deck-wrap mx-auto w-full max-w-[560px] pt-[9%] lg:col-span-5 lg:mx-0 lg:max-w-none lg:pr-[6%]"
        >
          <ShotDeck />
        </motion.div>
      </div>
    </section>
  );
}
