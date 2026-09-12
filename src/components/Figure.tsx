import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Props = {
  src: string;
  alt: string;
  /** CSS aspect-ratio matching the file, e.g. "16 / 10". */
  ratio?: string;
  priority?: boolean;
  className?: string;
  /**
   * Widest this image is ever drawn, in CSS pixels. Sets the `sizes` hint.
   * Both places a shot appears, the rail card and the dialog, land near 430.
   * A normal display then takes the 700px file and a retina one takes the
   * 1400px file. Without this the browser assumes the full viewport width and
   * takes the largest every time.
   */
  displayWidth?: number;
};

/**
 * scripts/optimise-shots.mjs writes a 1400px and a 700px WebP beside every
 * capture. This builds the srcset for them and leaves `src` as the original
 * file, which is what a browser with no WebP support falls back to.
 *
 * A shot narrower than 700px has no second variant, so it gets no srcset and
 * is served as the one file that exists.
 */
function webpSources(src: string) {
  const stem = src.replace(/\.(jpg|jpeg|png)$/i, "");
  if (stem === src) return undefined;
  return `${stem}-700.webp 700w, ${stem}.webp 1400w`;
}

/**
 * A screenshot that holds a skeleton in its own box until the file decodes,
 * then wipes up into place.
 *
 * The wipe rather than a fade because these are the evidence on the page, and
 * a reveal that uncovers the image top to bottom reads as presenting it. The
 * skeleton is the same box as the final image, so nothing reflows, and the
 * wipe only runs once both the pixels have arrived and the box is on screen.
 */
export default function Figure({
  src,
  alt,
  ratio = "16 / 10",
  priority = false,
  className = "",
  displayWidth = 430,
}: Props) {
  /*
   * Starts loaded when there is no window, which means the prerender step is
   * rendering this to a string. The skeleton is a client-side state, and
   * writing it into the HTML left every screenshot as a shimmering grey box
   * for anyone who does not run JavaScript: the page reads as a set of empty
   * frames rather than the evidence it is built around. In the browser this
   * is false as before, so the skeleton still covers the image until it
   * decodes.
   */
  const [loaded, setLoaded] = useState(typeof window === "undefined");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const sources = webpSources(src);

  // An image restored from cache can finish before React attaches onLoad.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  // Reveals as soon as the pixels are there, rather than waiting to be
  // scrolled into view. The work rail slides on its own, so an in-view gate
  // left cards sitting as skeletons while their image was already decoded.
  const revealed = loaded;

  return (
    <div
      ref={boxRef}
      style={{ aspectRatio: ratio }}
      className={`relative overflow-hidden border border-rule bg-raised ${className}`}
    >
      {!revealed && (
        <div className="absolute inset-0 skeleton" aria-hidden="true">
          <div className="flex h-full flex-col gap-3 p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="skeleton-bar h-3 w-3 rounded-full" />
              <span className="skeleton-bar h-3 w-3 rounded-full" />
              <span className="skeleton-bar h-3 w-3 rounded-full" />
              <span className="skeleton-bar ml-3 h-3 w-2/5" />
            </div>
            <span className="skeleton-bar mt-4 h-7 w-3/5" />
            <span className="skeleton-bar h-7 w-2/5" />
            <span className="skeleton-bar mt-2 h-3 w-4/5" />
            <span className="skeleton-bar h-3 w-3/5" />
            <span className="skeleton-bar mt-auto h-9 w-1/4" />
          </div>
        </div>
      )}

      <motion.div
        className="h-full w-full"
        initial={reduced ? false : { clipPath: "inset(100% 0 0 0)", scale: 1.04 }}
        animate={
          revealed
            ? { clipPath: "inset(0% 0 0 0)", scale: 1 }
            : { clipPath: "inset(100% 0 0 0)", scale: 1.04 }
        }
        transition={{ duration: reduced ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          ref={imgRef}
          src={src}
          srcSet={sources}
          sizes={sources ? `${displayWidth}px` : undefined}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          width={1400}
          height={875}
          onLoad={() => setLoaded(true)}
          // An error should not strand the reader on a skeleton forever.
          onError={() => setLoaded(true)}
          className="block h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out hover:scale-[1.02]"
        />
      </motion.div>
    </div>
  );
}
