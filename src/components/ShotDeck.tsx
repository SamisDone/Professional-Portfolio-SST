import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { featured } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * The hero's visual: real screenshots of shipped work, stacked like a hand of
 * cards, with the front one shuffled to the back every few seconds.
 *
 * The home page used to carry an abstract attribution diagram here. It was on
 * theme, but it was a drawing of an idea, and the first screen is where a
 * visitor decides whether to keep going. Four real, running products say more
 * in that second than any motif can.
 *
 * Only projects on her own account, where authorship is not in question. The
 * list is picked by slug and read from `featured`, so the titles, kinds and
 * image paths cannot drift from the work page.
 *
 * MediHub leads. Greenlight led before, and its shot is a mostly white 3D
 * canvas that reads as a blank card at this size; it goes to the back.
 */
const SLUGS = ["medihub", "pierra", "riphours", "greenlight"];
const CARDS = SLUGS.map((s) => featured.find((p) => p.slug === s)).filter(
  (p): p is (typeof featured)[number] & { shot: string } => Boolean(p?.shot),
);

const CYCLE_MS = 4200;

/** Where a card sits for its place in the stack, front first. */
const SLOTS = [
  { x: "0%", y: "0%", rotate: -3, scale: 1, opacity: 1 },
  { x: "7%", y: "-6%", rotate: 3, scale: 0.93, opacity: 0.9 },
  { x: "13%", y: "-11%", rotate: 8, scale: 0.86, opacity: 0.7 },
  { x: "18%", y: "-15%", rotate: 13, scale: 0.79, opacity: 0.45 },
];

function sources(src: string) {
  const stem = src.replace(/\.(jpg|jpeg|png)$/i, "");
  return `${stem}-700.webp 700w, ${stem}.webp 1400w`;
}

export default function ShotDeck() {
  const reduced = useReducedMotion();
  const [front, setFront] = useState(0);
  const [paused, setPaused] = useState(false);
  // The staggered deal is for arrival only. Once the stack has shuffled, every
  // move answers the shuffle at once.
  const [shuffled, setShuffled] = useState(false);
  // False until mounted, so the prerendered HTML and a visitor without
  // JavaScript get the stack already dealt rather than cards stuck off-screen.
  const [dealt, setDealt] = useState(typeof window === "undefined");

  useEffect(() => {
    const id = requestAnimationFrame(() => setDealt(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Shuffles on a timer, and stands down for reduced motion, while the pointer
  // or focus is on the deck, and while the tab is hidden.
  useEffect(() => {
    if (reduced || paused) return;
    const tick = () => {
      if (document.hidden) return;
      setShuffled(true);
      setFront((f) => (f + 1) % CARDS.length);
    };
    const id = window.setInterval(tick, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  // Tilt toward the pointer. Motion values, so moving the mouse never
  // re-renders React.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 18,
  });

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
    setPaused(false);
  };

  const current = CARDS[front];

  return (
    <figure className="hero-deck m-0 w-full">
      <Link
        to="/work"
        aria-label={`See the work: ${CARDS.map((c) => c.title).join(", ")} and more`}
        onPointerMove={onMove}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={onLeave}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="group block outline-none [perspective:1400px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
      >
        <motion.div
          style={reduced ? undefined : { rotateX, rotateY }}
          className="relative aspect-[16/10] w-full [transform-style:preserve-3d]"
        >
          {CARDS.map((card, i) => {
            const place = (i - front + CARDS.length) % CARDS.length;
            const slot = SLOTS[place];
            return (
              <motion.div
                key={card.slug}
                aria-hidden
                initial={false}
                animate={
                  dealt
                    ? slot
                    : { ...slot, y: "40%", rotate: slot.rotate - 12, opacity: 0 }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 120,
                        damping: 19,
                        // The first deal lands card by card, back to front.
                        delay: shuffled ? 0 : 0.45 + (CARDS.length - place) * 0.09,
                      }
                }
                style={{ zIndex: CARDS.length - place, transformOrigin: "30% 90%" }}
                className="absolute inset-0 overflow-hidden border border-ink/15 bg-raised shadow-[0_28px_60px_-24px_hsl(284_60%_4%/0.9)]"
              >
                <img
                  src={card.shot}
                  srcSet={sources(card.shot)}
                  sizes="(min-width: 1024px) 560px, 92vw"
                  alt=""
                  width={1400}
                  height={875}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                {/* Cards behind the front one sink into the ground, so the
                    stack reads as depth rather than as four equal images. */}
                <motion.div
                  initial={false}
                  animate={{ opacity: place === 0 ? 0 : 0.35 + place * 0.12 }}
                  transition={{ duration: reduced ? 0 : 0.5 }}
                  className="pointer-events-none absolute inset-0 bg-paper"
                />
              </motion.div>
            );
          })}
        </motion.div>
      </Link>

      <figcaption className="mt-5 flex min-h-[1.5rem] items-baseline justify-between gap-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current.slug}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-baseline gap-3"
          >
            <span className="text-[15px] font-medium text-ink">{current.title}</span>
            <span className="font-mono text-[12px] text-muted">{current.kind}</span>
          </motion.span>
        </AnimatePresence>
        <span aria-hidden className="flex gap-1.5">
          {CARDS.map((c, i) => (
            <span
              key={c.slug}
              className={`h-[3px] w-5 transition-colors duration-500 ${
                i === front ? "bg-accent" : "bg-rule"
              }`}
            />
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
