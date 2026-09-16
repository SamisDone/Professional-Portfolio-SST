import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  /** Play on mount instead of waiting for the element to scroll into view. */
  immediate?: boolean;
  /**
   * Word index from which the rest of the line is set in the display italic
   * and the accent colour. One accent per view at most: it is a turn in the
   * sentence, not decoration, and a second one on the same screen cancels the
   * first.
   */
  italicFrom?: number;
};

/**
 * Words rise out of a clipped box, one after the next.
 *
 * The clip is the point: text sliding up from behind its own baseline reads as
 * the line being set, which suits a page that presents itself as a document.
 * A plain fade would carry none of that.
 */
export default function MaskText({
  text,
  className = "",
  delay = 0,
  immediate = false,
  italicFrom,
}: Props) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const accent = (i: number) =>
    italicFrom !== undefined && i >= italicFrom ? "italic text-accent" : "";

  if (reduced) {
    if (italicFrom === undefined) return <span className={className}>{text}</span>;
    return (
      <span className={className}>
        {words.slice(0, italicFrom).join(" ")}{" "}
        <em className="italic text-accent">
          {words.slice(italicFrom).join(" ")}
        </em>
      </span>
    );
  }

  const animateProps = immediate
    ? { animate: "shown" }
    : { whileInView: "shown", viewport: { once: true, amount: 0.4 } };

  return (
    <motion.span
      className={className}
      initial="hidden"
      {...animateProps}
      transition={{ staggerChildren: 0.045, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          // The box has to clear descenders, or the mask shaves them off.
          // 0.2em was set for a joined script whose descenders ran deep;
          // Instrument Serif needs less, and the difference is real height on
          // a heading set at 90px.
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className={`inline-block ${accent(i)}`}
            variants={{
              hidden: { y: "108%" },
              shown: { y: 0 },
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
