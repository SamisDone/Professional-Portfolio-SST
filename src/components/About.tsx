import { motion } from "framer-motion";
import { about, profile } from "../data/content";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function About() {
  return (
    <section id="about" className="bg-bg py-16 md:py-24 scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">
                About
              </span>
            </div>
            <h2 className="text-3xl md:text-[2.75rem] font-display leading-[1.1] text-text-primary mb-6">
              I build things that <span className="italic">ship</span>, and I
              write about why they work.
            </h2>

            <div className="flex flex-col gap-4 max-w-xl">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="text-sm md:text-base leading-relaxed text-text-primary/70">
                  {p}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex rounded-full"
              >
                <span
                  className="absolute -inset-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundImage: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)" }}
                />
                <span className="relative z-10 flex items-center gap-2 rounded-full bg-text-primary text-bg px-6 py-3 text-sm font-medium group-hover:bg-bg group-hover:text-text-primary transition-colors duration-300">
                  Download résumé <span aria-hidden>↓</span>
                </span>
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-stroke px-6 py-3 text-sm text-text-primary hover:bg-stroke/40 transition-colors"
              >
                LinkedIn <span aria-hidden>↗</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl border border-stroke bg-surface/40 p-6 md:p-8">
              <h3 className="text-xs text-muted uppercase tracking-[0.3em] mb-6">
                Stack
              </h3>
              <dl className="flex flex-col gap-6">
                {about.skills.map((s) => (
                  <div key={s.group}>
                    <dt className="text-[11px] text-muted uppercase tracking-[0.2em] mb-2.5">
                      {s.group}
                    </dt>
                    <dd className="flex flex-wrap gap-2">
                      {s.items.map((item) => (
                        <span
                          key={item}
                          className="text-xs text-text-primary/85 border border-stroke rounded-full px-3 py-1.5"
                        >
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
