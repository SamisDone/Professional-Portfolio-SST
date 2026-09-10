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
};

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
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

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
