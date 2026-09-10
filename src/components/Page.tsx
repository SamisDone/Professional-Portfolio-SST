import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * Wraps every route. Pages are sized to the viewport minus the header, so a
 * section is a screen rather than a scroll, and the content swaps while the
 * transition panels still cover it.
 */
export default function Page({
  children,
  title,
  center = false,
}: {
  children: ReactNode;
  title: string;
  /** Vertically centre the content when it is shorter than the screen. */
  center?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.main
      id="main"
      aria-label={title}
      initial={reduced ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -14, transition: { duration: 0.18 } }}
      transition={{
        duration: reduced ? 0 : 0.6,
        // Lands while the transition panels still cover the screen.
        delay: reduced ? 0 : 0.34,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`flex flex-1 flex-col pb-20 sm:pb-24 ${center ? "justify-center" : ""}`}
    >
      {children}
    </motion.main>
  );
}
