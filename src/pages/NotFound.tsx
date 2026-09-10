import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 overflow-hidden relative">
      {/* Subtle gradient orbs */}
      <div
        className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-[100px] pointer-events-none"
        style={{ background: "linear-gradient(135deg, #89AACC, #4E85BF)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[80px] pointer-events-none"
        style={{ background: "linear-gradient(225deg, #4E85BF, #89AACC)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 text-center max-w-lg"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[8rem] md:text-[12rem] font-display italic leading-none text-transparent bg-clip-text mb-4"
          style={{ backgroundImage: "linear-gradient(135deg, #89AACC 0%, #4E85BF 100%)" }}
        >
          404
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-display italic text-text-primary mb-3">
          Page not found
        </h1>
        <p className="text-sm md:text-base text-muted mb-10 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="group relative inline-flex rounded-full transition-transform duration-300 hover:scale-105"
        >
          <span
            className="absolute -inset-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundImage: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)" }}
          />
          <span className="relative z-10 flex items-center gap-2 rounded-full bg-text-primary text-bg px-7 py-3.5 text-sm group-hover:bg-bg group-hover:text-text-primary transition-colors duration-300">
            ← Go Home
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
