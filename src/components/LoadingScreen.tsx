import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { markIntroSeen } from "../lib/intro";

// Tied to what she actually does, rather than the generic
// "Design / Create / Inspire" agency filler this used to show.
const WORDS = ["Build", "Research", "Ship"];
const DURATION = 1400;

type Props = {
  onComplete: () => void;
};

export default function LoadingScreen({ onComplete }: Props) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    markIntroSeen();

    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const progress = Math.min((t - startRef.current) / DURATION, 1);
      setCount(Math.floor(progress * 100));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        window.setTimeout(onComplete, 220);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length);
    }, 420);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between overflow-hidden"
      role="status"
      aria-label="Loading"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="pt-8 pl-6 md:pt-10 md:pl-10"
      >
        <span className="text-xs text-muted uppercase tracking-[0.3em]">
          Samonwita Sarker
        </span>
      </motion.div>

      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={WORDS[wordIndex]}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80"
          >
            {WORDS[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-end px-6 md:px-10">
        <span className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums">
          {String(count).padStart(3, "0")}
        </span>
      </div>

      <div className="relative h-[3px] bg-stroke/50 w-full">
        <div
          className="accent-gradient h-full origin-left"
          style={{
            transform: `scaleX(${count / 100})`,
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
          }}
        />
      </div>
    </div>
  );
}
