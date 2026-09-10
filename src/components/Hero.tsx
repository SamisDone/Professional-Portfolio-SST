import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { profile } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import MaskText from "./MaskText";
import Attribution from "./Attribution";

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
    <section id="top" className="border-b border-rule">
      <div className="mx-auto grid max-w-shell gap-8 px-5 pb-16 pt-16 sm:px-8 sm:pt-20 md:grid-cols-12 md:gap-10 md:pb-20">
        <div className="md:col-span-8">
          <motion.p
            {...rise(0)}
            className="mb-6 font-mono text-[13px] uppercase tracking-[0.2em] text-accent"
          >
            {profile.standfirst}
          </motion.p>

          <h1
            tabIndex={-1}
            className="text-[clamp(2.4rem,6.6vw,4.5rem)] font-medium leading-[1] tracking-tightest text-ink outline-none"
          >
            <MaskText text={profile.name} immediate delay={0.15} />
          </h1>

          <motion.p
            {...rise(0, 0.95)}
            className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-muted sm:text-lg"
          >
            {profile.positioning}
          </motion.p>

          <motion.div {...rise(1, 0.95)} className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/work"
              className="group inline-flex items-center gap-2.5 bg-accent-solid px-6 py-3.5 font-mono text-sm text-on-accent transition-transform hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]"
            >
              See the work
              <ArrowRightIcon
                size={15}
                weight="bold"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 border border-rule px-6 py-3.5 font-mono text-sm text-ink transition-colors hover:border-ink active:scale-[0.98]"
            >
              Résumé
              <ArrowUpRightIcon size={15} weight="bold" />
            </a>
          </motion.div>
        </div>

        <motion.div
          {...rise(2, 0.95)}
          className="flex flex-col gap-7 self-end border-t border-rule pt-8 md:col-span-4 md:border-l md:border-t-0 md:pl-8 md:pt-0"
        >
          <Attribution />
          <dl className="flex flex-col gap-5 font-mono text-[13px]">
            {[
              ["Based in", profile.location],
              ["Focus", "Full-stack, explainable AI"],
              ["Status", "Open to internships and research"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted">{k}</dt>
                <dd className="mt-1 text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
