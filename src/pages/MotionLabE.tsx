import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cgpaHistory, trajectoryCaption, trajectoryNote } from "../data/content";
import "./motion-lab-e.css";

/*
 * Specimens E1 to E4 for /motion-lab: proposals for the motion layer, kept
 * out of the site until approved. Only MotionLabPage imports this file, and
 * a production build has no lab, so nothing here ships.
 *
 * The flow and the chart are rebuilt here, with the same markup and sizes as
 * src/components/CaseStudy.tsx (Flow) and Trajectory.tsx, so the live
 * motion rules (C1, C2) never touch them and the production components stay
 * as they are.
 */

/** Marks `data-e-in` the first time the element enters the viewport, with
    the motion layer on (html.m-js). Remounting the element plays it again. */
function useEnter<T extends Element>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains("m-js")) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        el.setAttribute("data-e-in", "");
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** A specimen whose Replay remounts its body, so its entrance plays again. */
export function ESpecimen({
  code,
  title,
  note,
  scope,
  children,
}: {
  code: string;
  title: string;
  note: string;
  scope: string;
  children: ReactNode;
}) {
  const [run, setRun] = useState(0);
  return (
    <section aria-labelledby={`s-${code}`} className="tier-b">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-t-2 border-ink pt-4">
        <h2 id={`s-${code}`} className="t-h3">
          <span className="t-label mr-3 text-ink">{code}</span>
          {title}
        </h2>
        <button type="button" className="btn btn-secondary press" onClick={() => setRun((r) => r + 1)}>
          Replay
        </button>
      </div>
      <p className="t-small mt-2 max-w-measure">{note}</p>
      <div key={run} className={`${scope} mt-6`}>
        {children}
      </div>
    </section>
  );
}

const place = (i: number) => ({ "--i": i }) as CSSProperties;

/** E2: the case-study flow, built in drafting order. */
export function FlowE2({ steps }: { steps: string[] }) {
  const ref = useEnter<HTMLOListElement>();
  return (
    <ol ref={ref} data-e="e2" className="m-0 flex flex-col p-0">
      {steps.map((step, i) => (
        <li key={step} className="relative flex gap-4 pb-6 last:pb-0" style={place(i)}>
          {i < steps.length - 1 && (
            <span aria-hidden className="e2-connector absolute bottom-0 left-[13px] top-8 w-0.5 bg-ink" />
          )}
          <span className="e2-box t-label grid h-8 w-8 shrink-0 place-items-center border-2 text-ink">
            <span className="e2-num">{i + 1}</span>
          </span>
          <span className="e2-text t-body pt-1">{step}</span>
        </li>
      ))}
    </ol>
  );
}

/** E3: the case-study flow, advancing one step per tick. */
export function FlowE3({ steps }: { steps: string[] }) {
  const ref = useEnter<HTMLOListElement>();
  return (
    <ol ref={ref} data-e="e3" className="m-0 flex flex-col p-0">
      {steps.map((step, i) => (
        <li key={step} className="relative flex gap-4 pb-6 last:pb-0" style={place(i)}>
          {i < steps.length - 1 && (
            <span aria-hidden className="e3-connector absolute bottom-0 left-[13px] top-8 w-0.5 bg-ink" />
          )}
          <span className="e3-num t-label grid h-8 w-8 shrink-0 place-items-center border-2 border-ink text-ink">
            {i + 1}
          </span>
          <span className="e3-text t-body pt-1">{step}</span>
        </li>
      ))}
    </ol>
  );
}

/* E4: the trajectory chart with an honest axis zoom. Same geometry as
   src/components/Trajectory.tsx. */
const W = 640;
const H = 300;
const PAD_L = 48;
const PAD_R = 20;
const PAD_T = 44;
const PAD_B = 44;
const DOMAIN: [number, number] = [3.2, 4.0];
const GRID = [3.2, 3.4, 3.6, 3.8, 4.0];
const FULL = [0, 1, 2, 3];
const FONT = 16;
const PLOT = H - PAD_T - PAD_B;

const x = (i: number) => PAD_L + ((W - PAD_L - PAD_R) * i) / (cgpaHistory.length - 1);
/** The zoomed axis, 3.2 to 4.0: the chart as it is today. */
const y = (v: number) => H - PAD_B - ((v - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * PLOT;
/** The full axis, 0 to 4.0, which the chart opens on. */
const yFull = (v: number) => H - PAD_B - (v / DOMAIN[1]) * PLOT;
const line = cgpaHistory.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.value)}`).join(" ");
const LAST = cgpaHistory.length - 1;
const dy = (n: number) => ({ "--dy": `${n}px` }) as CSSProperties;

export function TrajectoryE4() {
  const ref = useEnter<SVGSVGElement>();
  return (
    <figure className="m-0">
      <figcaption>
        <h2 className="t-h3">The grades, including the dip</h2>
        <p className="t-body mt-2">{trajectoryNote}</p>
      </figcaption>
      <svg ref={ref} data-e="e4" viewBox={`0 0 ${W} ${H}`} className="mt-4 h-auto w-full overflow-visible" role="img" aria-label="Term GPA at CUET, specimen">
        {/* The full axis: 0 to 3.0 only exist while the chart is unzoomed.
            They leave downward, the way the zoom pushes them. */}
        {FULL.map((v) => (
          <g key={v} className="e4-full" style={dy(y(v) - yFull(v))}>
            <line x1={PAD_L} x2={W - PAD_R} y1={yFull(v)} y2={yFull(v)} stroke="var(--ink)" strokeWidth={v === 0 ? 2 : 1} vectorEffect="non-scaling-stroke" />
            <text x={PAD_L - 10} y={yFull(v)} textAnchor="end" dominantBaseline="middle" className="t-label" fill="var(--ink-2)" style={{ fontSize: FONT }}>
              {v.toFixed(1)}
            </text>
          </g>
        ))}
        {GRID.map((v) => (
          <g key={v} className="e4-tick" style={dy(yFull(v) - y(v))}>
            <line x1={PAD_L} x2={W - PAD_R} y1={y(v)} y2={y(v)} stroke="var(--ink)" strokeWidth={v === DOMAIN[0] ? 2 : 1} vectorEffect="non-scaling-stroke" />
            {/* Bunched at the top of the full axis these would overlap, so
                all but 4.0 wait for the rescale to spread them out. */}
            <text x={PAD_L - 10} y={y(v)} textAnchor="end" dominantBaseline="middle" className={v === DOMAIN[1] ? "t-label" : "e4-ticklabel t-label"} fill="var(--ink-2)" style={{ fontSize: FONT }}>
              {v.toFixed(1)}
            </text>
          </g>
        ))}
        <text x={W - PAD_R} y={PAD_T - 22} textAnchor="end" className="e4-note t-label" fill="var(--ink)" style={{ fontSize: FONT }}>
          AXIS ZOOMED TO 3.2 TO 4.0
        </text>

        <g className="e4-line">
          <path d={line} fill="none" stroke="var(--ink)" strokeWidth={2} strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />
        </g>

        {cgpaHistory.map((p, i) => {
          const last = i === LAST;
          const anchor = i === 0 ? "start" : last ? "end" : "middle";
          const ax = i === 0 ? x(i) - 4 : last ? x(i) + 4 : x(i);
          const prevV = cgpaHistory[i - 1]?.value ?? Infinity;
          const nextV = cgpaHistory[i + 1]?.value ?? Infinity;
          const below = p.value < prevV && p.value < nextV;
          const at = { "--p": i, "--pn": LAST } as CSSProperties;
          return (
            <g key={p.label}>
              <rect className="e4-point" style={at} x={x(i) - 5} y={y(p.value) - 5} width={10} height={10} fill="var(--section)" stroke="var(--ink)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              <text x={ax} y={below ? y(p.value) + 28 : y(p.value) - 14} textAnchor={anchor} className="e4-plabel t-label" fill="var(--ink)" style={{ ...at, fontSize: FONT }}>
                {p.value.toFixed(2)}
              </text>
              <text x={ax} y={H - PAD_B + 26} textAnchor={anchor} className="t-label" fill="var(--ink-2)" style={{ fontSize: FONT }}>
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
