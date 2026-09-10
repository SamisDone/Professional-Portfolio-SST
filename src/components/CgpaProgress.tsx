import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cgpaHistory } from "../data/content";

const WIDTH = 720;
const HEIGHT = 300;
const PAD_X = 36;
const PAD_TOP = 40;
const PAD_BOTTOM = 40;
const DOMAIN: [number, number] = [3.2, 4.0];
const GRID_VALUES = [3.2, 3.4, 3.6, 3.8, 4.0];

function xFor(i: number) {
  const usable = WIDTH - PAD_X * 2;
  return PAD_X + (usable * i) / (cgpaHistory.length - 1);
}

function yFor(value: number) {
  const usable = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const t = (value - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0]);
  return HEIGHT - PAD_BOTTOM - t * usable;
}

const linePath = cgpaHistory
  .map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(p.value)}`)
  .join(" ");

const areaPath = `${linePath} L ${xFor(cgpaHistory.length - 1)} ${HEIGHT - PAD_BOTTOM} L ${xFor(0)} ${HEIGHT - PAD_BOTTOM} Z`;

export default function CgpaProgress() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const inView = useInView(svgRef, { once: true, margin: "-100px" });

  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10 md:mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">
              Academic Trajectory
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display leading-[1.05] text-text-primary">
            CGPA, <span className="italic">semester by semester</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-md mt-4">
            A dip through Level 2, then a climb to 3.85 by Level 3 — CUET,
            2023–present.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          className="bg-surface/40 border border-stroke rounded-3xl p-4 sm:p-8"
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label="Line chart of CGPA across six semesters, rising from 3.45 to 3.85 with a dip in Level 2."
          >
            <defs>
              <linearGradient id="cgpa-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#89AACC" />
                <stop offset="100%" stopColor="#4E85BF" />
              </linearGradient>
              <linearGradient id="cgpa-area" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#89AACC" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#4E85BF" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Gridlines, labeled — the axis is zoomed to 3.2–4.0 so the
                semester-to-semester movement reads clearly; every value is
                also direct-labeled so the zoom never misleads. */}
            {GRID_VALUES.map((v) => (
              <g key={v}>
                <line
                  x1={PAD_X}
                  x2={WIDTH - PAD_X}
                  y1={yFor(v)}
                  y2={yFor(v)}
                  stroke="hsl(0 0% 100% / 0.08)"
                  strokeWidth="1"
                />
                <text
                  x={PAD_X - 10}
                  y={yFor(v)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-muted"
                  fontSize="11"
                >
                  {v.toFixed(1)}
                </text>
              </g>
            ))}

            <motion.path
              d={areaPath}
              fill="url(#cgpa-area)"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            />

            <motion.path
              d={linePath}
              fill="none"
              stroke="url(#cgpa-line)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            />

            {cgpaHistory.map((p, i) => {
              const isLast = i === cgpaHistory.length - 1;
              return (
                <g key={p.label}>
                  <motion.circle
                    cx={xFor(i)}
                    cy={yFor(p.value)}
                    r={isLast ? 6 : 4.5}
                    fill={isLast ? "url(#cgpa-line)" : "hsl(var(--bg))"}
                    stroke="url(#cgpa-line)"
                    strokeWidth="2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
                  />
                  <motion.text
                    x={xFor(i)}
                    y={yFor(p.value) - 16}
                    textAnchor="middle"
                    className="fill-text-primary font-medium"
                    fontSize="13"
                    initial={{ opacity: 0, y: 6 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.15 }}
                  >
                    {p.value.toFixed(2)}
                  </motion.text>
                  <text
                    x={xFor(i)}
                    y={HEIGHT - PAD_BOTTOM + 22}
                    textAnchor="middle"
                    className="fill-muted"
                    fontSize="11"
                  >
                    <title>{p.full}</title>
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
