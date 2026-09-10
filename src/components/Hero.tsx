import { motion } from "framer-motion";
import { ArrowDownIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { profile } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Hero() {
  const reduced = useReducedMotion();
  const rise = (i: number) => ({
    initial: reduced ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0 : 0.7,
      delay: reduced ? 0 : 0.05 + i * 0.08,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    <section id="top" className="border-b border-rule">
      <div className="mx-auto grid max-w-shell gap-10 px-5 pb-16 pt-20 sm:px-8 md:grid-cols-12 md:gap-8 md:pb-24 md:pt-24">
        <div className="md:col-span-8">
          <motion.p
            {...rise(0)}
            className="mb-7 font-mono text-[13px] uppercase tracking-[0.2em] text-accent"
          >
            {profile.standfirst}
          </motion.p>

          <motion.h1
            {...rise(1)}
            className="max-w-[13ch] text-[clamp(2.75rem,8vw,5.5rem)] font-medium leading-[0.95] tracking-tightest text-ink"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            {...rise(2)}
            className="mt-7 max-w-[46ch] text-lg leading-relaxed text-muted sm:text-xl"
          >
            {profile.positioning}
          </motion.p>

          <motion.div {...rise(3)} className="mt-10 flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
              }
              className="group inline-flex items-center gap-2.5 bg-ink px-6 py-3.5 font-mono text-sm text-paper transition-opacity hover:opacity-85 active:scale-[0.98]"
            >
              See the work
              <ArrowDownIcon size={15} weight="bold" />
            </button>
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

        {/* The evidence column. Mono, right-aligned on desktop, so the hero is
            a split rather than the centred stack every portfolio opens with. */}
        <motion.dl
          {...rise(4)}
          className="flex flex-col gap-5 self-end border-t border-rule pt-6 font-mono text-[13px] md:col-span-4 md:border-l md:border-t-0 md:pl-8 md:pt-2"
        >
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
        </motion.dl>
      </div>
    </section>
  );
}
