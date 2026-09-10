import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Props = {
  children: ReactNode;
  /** Stagger position within a group. */
  index?: number;
  className?: string;
  as?: "div" | "li" | "section";
};

/**
 * The one entry animation on the site. It exists to give a reading order to
 * sections that are otherwise a flat wall of text, and it collapses to nothing
 * when the visitor has asked for reduced motion.
 */
export default function Reveal({ children, index = 0, className, as = "div" }: Props) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
      transition={{
        duration: reduced ? 0 : 0.55,
        delay: reduced ? 0 : index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Tag>
  );
}
