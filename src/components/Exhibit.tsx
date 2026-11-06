import { useLayoutEffect, useRef, useState } from "react";
import type { Project } from "../data/content";
import { captionFor } from "../lib/projects";

/** useLayoutEffect warns when rendered to a string; this is the same hook
    with the warning removed, since there is nothing to measure on a server. */
const useIsoLayoutEffect = typeof window === "undefined" ? () => {} : useLayoutEffect;

/**
 * scripts/optimise-shots.mjs writes a 1400px and a 700px WebP beside every
 * capture. `src` stays the original, for a browser with no WebP.
 */
function webpSources(src: string) {
  const stem = src.replace(/\.(jpg|jpeg|png)$/i, "");
  if (stem === src) return undefined;
  return `${stem}-700.webp 700w, ${stem}.webp 1400w`;
}

/**
 * A screenshot shown as an exhibit: 16:10, a 2px ink frame, and a caption bar
 * saying what it is, where it was captured and when.
 *
 * Until the file decodes, the frame holds a paper-2 block of the same size
 * with the caption already in place, so nothing moves when it arrives. No
 * shimmer and no wipe; the image fades in over 150ms. The server render, and
 * so the page with JavaScript off, shows the image tag as it is.
 */
export function Exhibit({
  project,
  sizes,
  priority = false,
  className = "",
}: {
  project: Project;
  /** The `sizes` hint, so a phone takes the 700px file. */
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [loading, setLoading] = useState(typeof window !== "undefined");
  const img = useRef<HTMLImageElement | null>(null);
  const src = project.shot!;
  const sources = webpSources(src);

  // A cached image can finish before React attaches onLoad.
  useIsoLayoutEffect(() => {
    if (img.current?.complete) setLoading(false);
  }, []);

  return (
    <figure className={`m-0 ${className}`}>
      {/* data-exhibit marks the frame the /work thumbnail grows into. */}
      <div data-exhibit={project.slug} className="relative border-2 border-ink bg-paper-2" style={{ aspectRatio: "16 / 10" }}>
        <img
          ref={img}
          src={src}
          srcSet={sources}
          sizes={sources ? sizes : undefined}
          alt={project.shotAlt ?? ""}
          width={1400}
          height={875}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          data-loading={loading}
          className="exhibit-img block h-full w-full object-cover object-top"
        />
      </div>
      <figcaption className="t-label border-2 border-t-0 border-ink px-3 py-2 text-ink-2">
        {captionFor(project)}
      </figcaption>
    </figure>
  );
}

/**
 * For work with no interface to photograph. The project's own measured
 * figures, in the same 16:10 box, split by ink rules. Never a mocked-up
 * screen standing in for a real one.
 */
export function FiguresPanel({ project, className = "" }: { project: Project; className?: string }) {
  const figures = (project.figures ?? []).slice(0, 4);
  return (
    <figure className={`m-0 ${className}`}>
      <dl
        className="m-0 grid grid-cols-2 border-2 border-ink"
        style={{ aspectRatio: "16 / 10" }}
      >
        {figures.map((f, i) => (
          <div
            key={f.label}
            // Reversed so the figure reads first while the markup keeps the
            // order a definition list requires: the term, then its value.
            className={`flex flex-col-reverse justify-center gap-2 p-4 sm:p-6 ${i % 2 === 1 ? "border-l-2 border-ink" : ""} ${
              i > 1 ? "border-t-2 border-ink" : ""
            }`}
          >
            <dt className="t-label text-ink-2">{f.label}</dt>
            <dd className="t-figure m-0">{f.value}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="t-label border-2 border-t-0 border-ink px-3 py-2 text-ink-2">
        {project.title} / Published results
      </figcaption>
    </figure>
  );
}

/** The screenshot, or the figures, or nothing at all. Never an empty box. */
export function ProjectVisual(props: {
  project: Project;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (props.project.shot) return <Exhibit {...props} />;
  if (props.project.figures?.length) return <FiguresPanel project={props.project} className={props.className} />;
  return null;
}
