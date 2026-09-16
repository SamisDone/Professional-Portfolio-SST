import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cgpaHistory, trajectoryCaption, trajectoryNote } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";
import { useReducedMotion } from "../hooks/useReducedMotion";

const W = 900;
const H = 300;
const PAD_L = 54;
const PAD_R = 16;
const PAD_T = 50;
const PAD_B = 48;
const DOMAIN: [number, number] = [3.2, 4.0];
const GRID = [3.2, 3.4, 3.6, 3.8, 4.0];

const x = (i: number) => PAD_L + ((W - PAD_L - PAD_R) * i) / (cgpaHistory.length - 1);
const y = (v: number) =>
  H - PAD_B - ((v - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * (H - PAD_T - PAD_B);

const line = cgpaHistory
  .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.value)}`)
  .join(" ");
const area = `${line} L ${x(cgpaHistory.length - 1)} ${H - PAD_B} L ${x(0)} ${H - PAD_B} Z`;

/**
 * The grade record, drawn rather than stated, because the shape is the point:
 * a dip through Level 2 and a climb out of it.
 *
 * `bare` drops the section chrome so the chart can sit inside another page's
 * grid instead of owning a full-width band.
 */
export default function Trajectory({ bare = false }: { bare?: boolean }) {
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const show = inView || reduced;

  const chart = (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full overflow-visible"
      role="img"
      aria-label="Term GPA at CUET, level 1 term 1 through level 3 term 2: 3.45, 3.44, 3.43, 3.33, then 3.58 and 3.85. Each figure is that term on its own, not a cumulative average."
    >
      <defs>
        <linearGradient id="cgpa-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.28" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* The axis is zoomed to 3.2 through 4.0 so term-to-term movement is
          legible. Every point is direct-labelled, so the zoom cannot overstate
          the change. */}
      {GRID.map((v) => (
        <g key={v}>
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={y(v)}
            y2={y(v)}
            stroke="hsl(var(--rule))"
            strokeWidth="1"
          />
          <text
            x={PAD_L - 12}
            y={y(v)}
            textAnchor="end"
            dominantBaseline="middle"
            className="num font-mono fill-[hsl(var(--muted))]"
            fontSize="16"
          >
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      <motion.path
        d={area}
        fill="url(#cgpa-fill)"
        initial={reduced ? false : { opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.7 }}
      />

      <motion.path
        d={line}
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={show ? { pathLength: 1 } : {}}
        transition={{ duration: reduced ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {cgpaHistory.map((p, i) => {
        const last = i === cgpaHistory.length - 1;
        return (
          <g key={p.label}>
            <motion.circle
              cx={x(i)}
              cy={y(p.value)}
              r={last ? 5.5 : 3.5}
              fill={last ? "hsl(var(--accent))" : "hsl(var(--paper))"}
              stroke="hsl(var(--accent))"
              strokeWidth="2"
              initial={reduced ? false : { opacity: 0, scale: 0 }}
              animate={show ? { opacity: 1, scale: 1 } : {}}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 22,
                delay: reduced ? 0 : 0.35 + i * 0.14,
              }}
              style={{ transformOrigin: `${x(i)}px ${y(p.value)}px` }}
            />
            {/* The end labels anchor inward. Centred, the first one ran into
                the axis ticks once the figures were set in mono, which is
                wider than the sans they used to be in. */}
            <motion.text
              x={i === 0 ? x(i) - 6 : last ? x(i) + 6 : x(i)}
              y={y(p.value) - 17}
              textAnchor={i === 0 ? "start" : last ? "end" : "middle"}
              className="num font-mono fill-[hsl(var(--ink))]"
              fontSize="18"
              initial={reduced ? false : { opacity: 0 }}
              animate={show ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: reduced ? 0 : 0.45 + i * 0.14 }}
            >
              {p.value.toFixed(2)}
            </motion.text>
            <text
              x={x(i)}
              y={H - PAD_B + 26}
              textAnchor="middle"
              className="num font-mono fill-[hsl(var(--muted))]"
              fontSize="16"
            >
              <title>{p.full}</title>
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );

  if (bare) {
    return (
      <figure className="m-0">
        <figcaption className="mb-3">
          <h3 className="text-lg font-medium leading-tight text-ink">
            The grades, including the dip
          </h3>
          <p className="mt-1.5 text-[14px] leading-snug text-muted">
            {trajectoryNote}
          </p>
        </figcaption>
        {chart}
        <p className="mt-2 font-mono text-[11px] text-muted">{trajectoryCaption}</p>
      </figure>
    );
  }

  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-shell section-pad short-trim px-5 sm:px-8">
        <div className="grid gap-8 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <h2 className="max-w-[16ch] h-section font-display text-ink">
              <MaskText text="The grades." />
            </h2>
            <p className="mt-2 max-w-[42ch] text-[14px] leading-snug text-muted">
              Including the dip.
            </p>
            <p className="mt-5 max-w-measure text-[17px] leading-relaxed text-muted">
              {trajectoryNote}
            </p>
            <p className="mt-5 font-mono text-[12px] text-muted">{trajectoryCaption}</p>
          </Reveal>
          <Reveal index={1} className="md:col-span-7">
            {chart}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
