import type { CSSProperties } from "react";
import { cgpaHistory, trajectoryAxisNote, trajectoryCaption, trajectoryNote } from "../data/content";

/*
 * The viewBox is narrower than the 900 the old chart used. The chart sits in a
 * 5-column cell about 470px wide, and at 900 units its 16-unit labels came out
 * near 8px on screen. At 640 the Label-size text lands near 12px there.
 */
const W = 640;
const H = 300;
const PAD_L = 48;
const PAD_R = 20;
const PAD_T = 44;
const PAD_B = 44;
const DOMAIN: [number, number] = [3.0, 4.0];
const GRID = [3.0, 3.2, 3.4, 3.6, 3.8, 4.0];
const FONT = 16;

const x = (i: number) => PAD_L + ((W - PAD_L - PAD_R) * i) / (cgpaHistory.length - 1);
const y = (v: number) => H - PAD_B - ((v - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * (H - PAD_T - PAD_B);

const line = cgpaHistory.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.value)}`).join(" ");
const LAST = cgpaHistory.length - 1;

/** The text alternative: every term and its figure, in order. */
const DESCRIPTION =
  "Term GPA at CUET, each term on its own rather than cumulative, on an axis zoomed to 3.0 to 4.0. " +
  cgpaHistory.map((p) => `${p.full}: ${p.value.toFixed(2)}`).join(". ") +
  ".";

/**
 * The grade record, drawn because the shape is the point: a dip through
 * Level 2 and a climb out of it. Ink only: a 2px line, 8px square points, and
 * every point labelled, so the zoomed axis cannot overstate a change.
 *
 * The axis is zoomed to 3.0 to 4.0, and the chart says so in a note that is
 * part of it, with JavaScript or without.
 *
 * Rendered complete. The motion layer (C1 in src/motion.css) draws the line
 * once, then pops in each point and its label in order; `--p` is each point's
 * place along the line.
 */
export default function Trajectory() {

  return (
    <figure className="m-0">
      <figcaption>
        <h2 className="t-h3">The grades, including the dip</h2>
        <p className="t-body mt-2">{trajectoryNote}</p>
      </figcaption>
      <svg
        data-chart
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 h-auto w-full overflow-visible"
        role="img"
        aria-label={DESCRIPTION}
      >
        {GRID.map((v) => (
          <g key={v}>
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--ink)"
              strokeWidth={v === DOMAIN[0] ? 2 : 1}
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={PAD_L - 10}
              y={y(v)}
              textAnchor="end"
              dominantBaseline="middle"
              className="t-label"
              fill="var(--ink-2)"
              style={{ fontSize: FONT }}
            >
              {v.toFixed(1)}
            </text>
          </g>
        ))}

        <text x={W - PAD_R} y={PAD_T - 22} textAnchor="end" className="t-label" fill="var(--ink)" style={{ fontSize: FONT }}>
          {trajectoryAxisNote}
        </text>

        <g className="m-line">
          <path
            d={line}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={2}
            strokeLinejoin="miter"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {cgpaHistory.map((p, i) => {
          const last = i === cgpaHistory.length - 1;
          const anchor = i === 0 ? "start" : last ? "end" : "middle";
          const ax = i === 0 ? x(i) - 4 : last ? x(i) + 4 : x(i);
          // A low point's label goes under it, or the line runs through it.
          const prevV = cgpaHistory[i - 1]?.value ?? Infinity;
          const nextV = cgpaHistory[i + 1]?.value ?? Infinity;
          const below = p.value < prevV && p.value < nextV;
          const place = { "--p": i, "--pn": LAST } as CSSProperties;
          return (
            <g key={p.label}>
              {/* The section colour as a fill, inside a 2px ink border. */}
              <rect
                className="m-point"
                style={place}
                x={x(i) - 5}
                y={y(p.value) - 5}
                width={10}
                height={10}
                fill="var(--section)"
                stroke="var(--ink)"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={ax}
                y={below ? y(p.value) + 28 : y(p.value) - 14}
                textAnchor={anchor}
                className="m-plabel t-label"
                fill="var(--ink)"
                style={{ ...place, fontSize: FONT }}
              >
                {p.value.toFixed(2)}
              </text>
              <text
                x={ax}
                y={H - PAD_B + 26}
                textAnchor={anchor}
                className="t-label"
                fill="var(--ink-2)"
                style={{ fontSize: FONT }}
              >
                <title>{p.full}</title>
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="t-label mt-3 text-ink-2">{trajectoryCaption}</p>
    </figure>
  );
}
