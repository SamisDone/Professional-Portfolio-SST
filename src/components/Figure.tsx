import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  /** Tailwind aspect class. The skeleton uses the same box, so nothing shifts. */
  ratio?: string;
  priority?: boolean;
  className?: string;
};

/**
 * A screenshot with a skeleton in its place until the file decodes.
 *
 * The placeholder is the same box as the final image, not a spinner, so the
 * page never reflows and the reader can already see where the picture will be.
 * The bars inside echo a browser chrome and a heading, which is roughly what
 * every one of these screenshots actually contains.
 */
export default function Figure({
  src,
  alt,
  ratio = "aspect-[16/10]",
  priority = false,
  className = "",
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // An image restored from cache can finish before React attaches onLoad.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className={`relative overflow-hidden border border-rule bg-raised ${ratio} ${className}`}
    >
      {!loaded && (
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

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        width={1400}
        height={875}
        onLoad={() => setLoaded(true)}
        // Errors should not strand the reader on a skeleton forever.
        onError={() => setLoaded(true)}
        className={`relative block h-full w-full object-cover object-top transition-[opacity,transform] duration-700 ease-out hover:scale-[1.02] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
