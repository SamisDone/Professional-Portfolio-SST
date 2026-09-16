import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { neighbours } from "../lib/routes";
import { useReducedMotion } from "../hooks/useReducedMotion";

const TYPING = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/**
 * Left and right arrow keys walk the sections in reading order, and the same
 * two moves are on screen as buttons so the shortcut is discoverable rather
 * than a secret.
 *
 * The handler stands down whenever the arrows already mean something else: a
 * form field, anything the page marked as its own arrow surface (the work
 * rail), or a modifier held for a browser shortcut.
 */
export default function Pager() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { prev, next } = neighbours(pathname);
  const reduced = useReducedMotion();

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;

      const el = event.target as HTMLElement | null;
      if (el) {
        if (TYPING.has(el.tagName) || el.isContentEditable) return;
        // The work rail scrolls with the arrow keys when it holds focus.
        if (el.closest("[data-arrow-surface]")) return;
      }

      const target = event.key === "ArrowRight" ? next : prev;
      if (!target) return;
      event.preventDefault();
      navigate(target.path);
    },
    [navigate, next, prev],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  /*
   * A fixed element at the bottom of the viewport was only ever safe because
   * every page fitted one screen. The about page does not any more, and on a
   * page that scrolls this thing floats over the body text in the left and
   * right gutters, which at 1280 is about 120px of the shell on each side.
   *
   * So it is shown where it makes sense: always on a page that fits, and on a
   * page that scrolls only once the reader has reached the end, which is the
   * point at which "what comes next" is the question they have. The arrow keys
   * work either way; this is the visible half of the affordance, not the
   * mechanism.
   */
  const [atRest, setAtRest] = useState(true);
  useEffect(() => {
    const update = () => {
      const de = document.documentElement;
      const scrolls = de.scrollHeight > window.innerHeight + 4;
      setAtRest(
        !scrolls || window.scrollY + window.innerHeight >= de.scrollHeight - 8,
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // The page grows as screenshots decode and fonts land, so the measurement
    // taken on mount is not the one that holds.
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, [pathname]);

  if (!prev && !next) return null;

  // The nav keeps its own entry animation, with the 0.9s stagger that belongs
  // to the page arriving. Showing and hiding on scroll is a separate animation
  // on the two buttons, so neither restarts the other.
  const rest = {
    animate: { opacity: atRest ? 1 : 0, y: atRest ? 0 : 10 },
    transition: { duration: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] as const },
    className: atRest ? "pointer-events-auto" : "pointer-events-none",
  };

  return (
    <motion.nav
      aria-label="Section pager"
      // The one animation on the site that was not checking this. It also
      // meant the prerendered HTML carried the pager at opacity 0.
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }
      }
      aria-hidden={!atRest}
      // Sits clear of the footer rather than on top of it. `--footer-h` is
      // published by Footer; the fallback keeps it sane for the one frame
      // before that lands, and on the 404, which has no pager anyway.
      style={{ bottom: "calc(var(--footer-h, 3.5rem) + 0.75rem)" }}
      className="section-pager pointer-events-none fixed inset-x-0 z-40 flex items-end justify-between gap-4 px-5 sm:px-8"
    >
      <motion.div {...rest}>
        {prev && (
          <button
            onClick={() => navigate(prev.path)}
            // The keyboard hint is a sighted affordance. Read aloud it came out
            // as "leftwards arrow key Work", and in the prerendered HTML, where
            // the two spans are adjacent text nodes, as "keyWork". The button
            // says what it does; the hint is decoration on top of that.
            aria-label={`Previous section: ${prev.label}`}
            // Hidden buttons must leave the tab order too. aria-hidden on the
            // nav alone would leave Tab landing on a control nobody can see.
            tabIndex={atRest ? undefined : -1}
            className="group flex items-center gap-3 border border-rule bg-paper/80 py-2.5 pl-2.5 pr-4 backdrop-blur-md transition-colors hover:border-accent"
          >
            <CaretLeftIcon
              size={15}
              weight="bold"
              className="text-accent-2 transition-transform group-hover:-translate-x-0.5"
            />
            <span aria-hidden className="text-left">
              {/* The trailing space is load-bearing. These are two adjacent
                  text nodes, and anything reading the page without a browser,
                  an ATS or a link scraper, joins them with nothing in between
                  and gets "keyWork". */}
              <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                {"← key "}
              </span>
              <span className="block text-[13px] font-medium text-ink">{prev.label}</span>
            </span>
          </button>
        )}
      </motion.div>

      <motion.div {...rest}>
        {next && (
          <button
            onClick={() => navigate(next.path)}
            aria-label={`Next section: ${next.label}`}
            tabIndex={atRest ? undefined : -1}
            className="group flex items-center gap-3 border border-rule bg-paper/80 py-2.5 pl-4 pr-2.5 backdrop-blur-md transition-colors hover:border-accent"
          >
            <span aria-hidden className="text-right">
              {/* The trailing space is load-bearing. These are two adjacent
                  text nodes, and anything reading the page without a browser,
                  an ATS or a link scraper, joins them with nothing in between
                  and gets "keyWork". */}
              <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                {"→ key "}
              </span>
              <span className="block text-[13px] font-medium text-ink">{next.label}</span>
            </span>
            <CaretRightIcon
              size={15}
              weight="bold"
              className="text-accent-2 transition-transform group-hover:translate-x-0.5"
            />
          </button>
        )}
      </motion.div>
    </motion.nav>
  );
}
