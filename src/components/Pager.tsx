import { useCallback, useEffect } from "react";
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

  if (!prev && !next) return null;

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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-end justify-between gap-4 px-5 pb-5 sm:px-8 sm:pb-7"
    >
      <div className="pointer-events-auto">
        {prev && (
          <button
            onClick={() => navigate(prev.path)}
            className="group flex items-center gap-3 border border-rule bg-paper/80 py-2.5 pl-2.5 pr-4 backdrop-blur-md transition-colors hover:border-accent"
          >
            <CaretLeftIcon
              size={15}
              weight="bold"
              className="text-accent-2 transition-transform group-hover:-translate-x-0.5"
            />
            <span className="text-left">
              <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                ← key
              </span>
              <span className="block font-mono text-[13px] text-ink">{prev.label}</span>
            </span>
          </button>
        )}
      </div>

      <div className="pointer-events-auto">
        {next && (
          <button
            onClick={() => navigate(next.path)}
            className="group flex items-center gap-3 border border-rule bg-paper/80 py-2.5 pl-4 pr-2.5 backdrop-blur-md transition-colors hover:border-accent"
          >
            <span className="text-right">
              <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                → key
              </span>
              <span className="block font-mono text-[13px] text-ink">{next.label}</span>
            </span>
            <CaretRightIcon
              size={15}
              weight="bold"
              className="text-accent-2 transition-transform group-hover:translate-x-0.5"
            />
          </button>
        )}
      </div>
    </motion.nav>
  );
}
