import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { headingGate, onSkip, settle } from "../lib/motion";

/** useLayoutEffect warns when rendered to a string. */
const useIsoLayoutEffect = typeof window === "undefined" ? () => {} : useLayoutEffect;

const SCAN_MS = 600;

/**
 * Sweeps a scan bar down its content once on entry, so the page looks
 * recognised as the bar passes: sharp above it, soft and faint below.
 *
 * The real content underneath stays in place, soft and faint until the end,
 * and keeps every link working the whole time. The sharp part is an inert,
 * aria-hidden copy on a paper ground that is unclipped downwards, so only
 * clip-path and transform animate. Its attribute goes to "done" when the bar
 * finishes, "now" if skipped. Without the motion layer the content is plain.
 */
export default function OcrScan({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  // Nothing inside plays its own entrance over the scan.
  useIsoLayoutEffect(() => {
    if (root.current) settle(root.current);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!document.documentElement.classList.contains("m-js")) {
      el.dataset.ocr = "now";
      return;
    }
    let stopped = false;
    let parts: Element[] = [];
    let animations: Animation[] = [];
    const clear = () => {
      for (const a of animations) a.cancel();
      for (const part of parts) part.remove();
      offSkip();
    };
    const end = (state: string) => {
      if (stopped) return;
      stopped = true;
      clear();
      el.dataset.ocr = state;
    };
    const offSkip = onSkip(() => end("now"));

    headingGate().then(() => {
      if (stopped) return;
      const sharp = el.cloneNode(true) as HTMLElement;
      sharp.removeAttribute("data-ocr");
      sharp.className = "ocr-sharp";
      sharp.setAttribute("aria-hidden", "true");
      sharp.inert = true;
      sharp.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
      const bar = document.createElement("div");
      bar.className = "ocr-bar";
      bar.setAttribute("aria-hidden", "true");
      el.append(sharp, bar);
      parts = [sharp, bar];
      el.dataset.ocr = "run";

      const timing = { duration: SCAN_MS, easing: "linear", fill: "both" } as const;
      const reveal = sharp.animate([{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }], timing);
      const sweep = bar.animate([{ transform: "translateY(0)" }, { transform: `translateY(${el.offsetHeight - bar.offsetHeight}px)` }], timing);
      animations = [reveal, sweep];
      reveal.finished.then(() => end("done"), () => {});
    });

    return () => {
      stopped = true;
      clear();
    };
  }, []);

  return (
    <div ref={root} data-ocr="" className={`relative ${className}`}>
      {children}
    </div>
  );
}
