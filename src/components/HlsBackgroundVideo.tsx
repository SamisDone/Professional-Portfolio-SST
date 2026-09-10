import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const PLAYBACK_ID = "Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g";
const STREAM_URL = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
// A still from the same asset. 78 KB against roughly 6 MB of video segments,
// so the hero has its final image almost immediately and the stream only ever
// upgrades what is already on screen.
const POSTER_URL = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?width=1280&time=2`;

type Props = {
  className?: string;
  /**
   * Skip the video entirely and show only the poster. The contact section uses
   * this: it was mounting a second player for the same asset, which doubled
   * the page's video download for a decorative background nobody watches.
   */
  posterOnly?: boolean;
};

export default function HlsBackgroundVideo({
  className = "",
  posterOnly = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  // Only pay for the stream once the element is actually near the viewport.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || posterOnly || reduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [posterOnly, reduced]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visible) return;

    let cancelled = false;
    let hls: { destroy: () => void } | null = null;

    // Safari plays HLS natively, so the 130 KB library is only fetched for the
    // browsers that genuinely need it.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = STREAM_URL;
      void video.play().catch(() => {});
    } else {
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled || !Hls.isSupported()) return;
        const instance = new Hls({ capLevelToPlayerSize: true });
        instance.loadSource(STREAM_URL);
        instance.attachMedia(video);
        hls = instance;
      });
    }

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [visible]);

  return (
    <video
      ref={videoRef}
      poster={POSTER_URL}
      autoPlay={!reduced && !posterOnly}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className={`absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 ${className}`}
    />
  );
}
