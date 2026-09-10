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

    // canPlayType is not a safe test on its own: Chrome answers "maybe" for
    // HLS and then cannot play it, which leaves a dead video element behind a
    // poster. Only trust native playback where Media Source Extensions are
    // absent, which is the case that actually identifies iOS Safari.
    const hasMse = typeof window.MediaSource !== "undefined";
    const nativeHls = video.canPlayType("application/vnd.apple.mpegurl") !== "";

    if (!hasMse && nativeHls) {
      video.src = STREAM_URL;
      void video.play().catch(() => {});
    } else {
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled) return;
        if (!Hls.isSupported()) {
          // Last resort: let the element try the manifest itself.
          if (nativeHls) {
            video.src = STREAM_URL;
            void video.play().catch(() => {});
          }
          return;
        }
        const instance = new Hls({ capLevelToPlayerSize: true });
        instance.loadSource(STREAM_URL);
        instance.attachMedia(video);
        // Autoplay can be refused even when muted; asking explicitly once the
        // manifest is parsed is what actually starts the loop.
        instance.on(Hls.Events.MANIFEST_PARSED, () => {
          void video.play().catch(() => {});
        });
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
