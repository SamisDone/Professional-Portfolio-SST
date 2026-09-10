import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * The page's background. Three fixed layers, all pointer-events-none:
 *
 *   1. two large soft fields of colour that drift on long loops, so the ground
 *      is never a flat fill,
 *   2. a hairline grid that ties the layout to a visible structure,
 *   3. grain, which stops the gradients from banding on wide dark areas.
 *
 * It is fixed rather than in the scroll flow, so the browser paints it once and
 * only the transforms of the two fields ever change. Under reduced motion the
 * fields stop where they are and the grid and grain stay.
 */
export default function Backdrop() {
  const reduced = useReducedMotion();

  const drift = (dx: number[], dy: number[], seconds: number) =>
    reduced
      ? {}
      : {
          animate: { x: dx, y: dy },
          transition: {
            duration: seconds,
            repeat: Infinity,
            repeatType: "mirror" as const,
            ease: "easeInOut" as const,
          },
        };

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        {...drift([0, 120, -60, 0], [0, -80, 60, 0], 34)}
        className="absolute -left-[18vw] -top-[22vh] h-[70vh] w-[70vh] rounded-full opacity-[0.42] blur-[110px]"
        style={{ background: "radial-gradient(circle, hsl(var(--accent-solid)) 0%, transparent 68%)" }}
      />
      <motion.div
        {...drift([0, -100, 70, 0], [0, 70, -50, 0], 44)}
        className="absolute -bottom-[26vh] -right-[14vw] h-[78vh] w-[78vh] rounded-full opacity-[0.30] blur-[120px]"
        style={{ background: "radial-gradient(circle, hsl(var(--surface-2)) 0%, transparent 66%)" }}
      />

      <div className="backdrop-grid absolute inset-0" />
      <motion.div
        {...drift([0, 70, -40, 0], [0, 50, -70, 0], 39)}
        className="absolute left-1/3 top-1/4 h-[52vh] w-[52vh] rounded-full opacity-[0.18] blur-[130px]"
        style={{ background: "radial-gradient(circle, hsl(var(--accent-2)) 0%, transparent 70%)" }}
      />
      <div className="backdrop-grain absolute inset-0" />

      {/* Keeps type legible over the brightest part of the fields. */}
      <div className="absolute inset-0 bg-paper/35" />
    </div>
  );
}
