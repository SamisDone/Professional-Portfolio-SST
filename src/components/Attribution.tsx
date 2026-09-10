import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

// Illustrative only. These are not values from any published model; the shape
// is the point, which is why nothing here is labelled with a figure.
const BARS = [
  { w: 0.82, dir: 1 },
  { w: 0.46, dir: -1 },
  { w: 0.64, dir: 1 },
  { w: 0.28, dir: -1 },
  { w: 0.93, dir: 1 },
  { w: 0.37, dir: -1 },
  { w: 0.55, dir: 1 },
];

const ROW = 13;
const GAP = 7;
const AXIS = 96;
const W = 200;

/**
 * A feature-attribution motif: bars pushing away from a centre axis, the way a
 * SHAP plot splits what pushed a prediction up from what pulled it down. It is
 * the one decorative graphic on the page, and it is here because attribution is
 * the actual subject of the research this site is about.
 */
export default function Attribution() {
  const reduced = useReducedMotion();
  const height = BARS.length * (ROW + GAP);

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="h-auto w-full max-w-[240px]"
        role="img"
        aria-label="An abstract feature-attribution diagram: bars extending either side of a centre axis."
      >
        <line
          x1={AXIS}
          x2={AXIS}
          y1={0}
          y2={height}
          stroke="hsl(var(--rule))"
          strokeWidth="1"
        />
        {BARS.map((bar, i) => {
          const len = bar.w * (bar.dir === 1 ? W - AXIS - 8 : AXIS - 8);
          return (
            <motion.rect
              key={i}
              y={i * (ROW + GAP)}
              height={ROW}
              rx="1"
              fill={
                bar.dir === 1 ? "hsl(var(--accent))" : "hsl(var(--muted) / 0.42)"
              }
              initial={reduced ? false : { width: 0, x: AXIS }}
              whileInView={{
                width: len,
                x: bar.dir === 1 ? AXIS + 1 : AXIS - 1 - len,
              }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: reduced ? 0 : 0.7,
                delay: reduced ? 0 : 0.5 + i * 0.075,
                ease: [0.16, 1, 0.3, 1],
              }}
              // Static fallback for reduced motion, where the animation is off.
              {...(reduced
                ? { width: len, x: bar.dir === 1 ? AXIS + 1 : AXIS - 1 - len }
                : {})}
            />
          );
        })}
      </svg>
      <figcaption className="mt-3 font-mono text-[11px] leading-relaxed text-muted">
        Feature attribution: what pushed a prediction up, what pulled it down.
      </figcaption>
    </figure>
  );
}
