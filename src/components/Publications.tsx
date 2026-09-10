import { motion } from "framer-motion";
import { milestones } from "../data/content";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Publications() {
  return (
    <section id="research" className="bg-bg py-16 md:py-24 scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">
                Research &amp; Recognition
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display leading-[1.05] text-text-primary">
              Recent <span className="italic">milestones</span>
            </h2>
            <p className="text-sm md:text-base text-muted max-w-md mt-4">
              Peer-reviewed work, international competitions, and industry
              experience beyond the codebase.
            </p>
          </div>

          <a
            href="https://ieeexplore.ieee.org/document/11429440"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative hidden md:inline-flex rounded-full shrink-0"
          >
            <span
              className="absolute -inset-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundImage: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)" }}
            />
            <span className="relative z-10 inline-flex items-center gap-2 rounded-full border border-stroke bg-bg px-5 py-2.5 text-sm text-text-primary">
              Read the IEEE paper <span aria-hidden>↗</span>
            </span>
          </a>
        </motion.div>

        <div className="flex flex-col gap-3">
          {milestones.map((m, i) => {
            const Row = m.href ? motion.a : motion.div;
            return (
              <Row
                key={m.title}
                {...(m.href
                  ? { href: m.href, target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
                className={`group flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 p-5 sm:p-6 rounded-3xl bg-surface/30 border border-stroke transition-colors duration-300 ${
                  m.href ? "hover:bg-surface hover:border-stroke/80 cursor-pointer" : ""
                }`}
              >
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted border border-stroke rounded-full px-3 py-1 w-fit shrink-0 sm:mt-0.5">
                  {m.type}
                </span>

                <div className="flex-1 min-w-0">
                  {/* Deliberately not truncated. On a phone this used to cut
                      the ACL ranking off mid-word, hiding the single strongest
                      line on the page. */}
                  <h3 className="text-text-primary font-medium text-sm sm:text-base leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted mt-1">{m.venue}</p>
                  {m.note && (
                    <p className="text-xs sm:text-sm text-text-primary/50 mt-2 leading-relaxed">
                      {m.note}
                    </p>
                  )}
                </div>

                <span className="flex items-center gap-2 text-xs sm:text-sm text-muted shrink-0 sm:mt-0.5">
                  {m.date}
                  {m.href && (
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  )}
                </span>
              </Row>
            );
          })}
        </div>
      </div>
    </section>
  );
}
