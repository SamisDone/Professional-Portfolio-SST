import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 overflow-hidden relative">
      {/* Animated gradient orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[120px] pointer-events-none animated-gradient-border"
        style={{ background: "linear-gradient(135deg, #89AACC, #4E85BF)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 text-center max-w-lg"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="w-8 h-px bg-stroke" />
          <span className="text-xs text-muted uppercase tracking-[0.3em]">
            In Progress
          </span>
          <span className="w-8 h-px bg-stroke" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-display italic leading-[1.05] text-text-primary mb-4">
          Coming <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)" }}>soon</span>
        </h1>
        <p className="text-sm md:text-base text-muted mb-10 max-w-sm mx-auto">
          This page is under construction. Check back soon — something good is on its way.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group relative inline-flex rounded-full transition-transform duration-300 hover:scale-105"
          >
            <span
              className="absolute -inset-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundImage: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)" }}
            />
            <span className="relative z-10 flex items-center gap-2 rounded-full border-2 border-stroke group-hover:border-bg bg-bg px-7 py-3.5 text-sm text-text-primary transition-colors duration-300">
              ← Back Home
            </span>
          </Link>
        </div>

        {/* Decorative dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex items-center justify-center gap-2 mt-16"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted/40"
              style={{
                animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
