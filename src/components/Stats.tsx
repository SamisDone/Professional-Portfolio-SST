import { motion } from "framer-motion";
import { stats } from "../data/content";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Stats() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className="text-center sm:border-l sm:first:border-l-0 sm:border-stroke sm:px-6"
            >
              <div className="text-5xl md:text-6xl font-display italic text-text-primary mb-2">
                {s.value}
              </div>
              <div className="text-xs text-muted uppercase tracking-[0.2em]">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
