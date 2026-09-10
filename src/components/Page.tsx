import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * Wraps every route. The content swaps while the curtain covers the screen,
 * so the fade is short and only has to cover the seam.
 */
export default function Page({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.main
      id="main"
      aria-label={title}
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0 : 0.5,
        delay: reduced ? 0 : 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.main>
  );
}
