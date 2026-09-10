import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRightIcon, GithubLogoIcon, XIcon } from "@phosphor-icons/react";
import type { Project } from "../data/content";
import Figure from "./Figure";
import { useReducedMotion } from "../hooks/useReducedMotion";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The full case study, opened from a card in the rail.
 *
 * The reasoning lives here rather than inline on the card, which is what lets
 * the rail stay one screen tall without the problem, approach and outcome
 * being cut for space.
 */
export default function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!project) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.classList.add("dialog-open");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      // Arrow keys page between sections everywhere else on the site. While a
      // dialog is open they must not move the page out from under it.
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.stopPropagation();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    const id = window.setTimeout(
      () => panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus(),
      60,
    );

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      window.clearTimeout(id);
      document.body.classList.remove("dialog-open");
      restoreRef.current?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-paper/80 p-4 backdrop-blur-md sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.22 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-title"
            onClick={(event) => event.stopPropagation()}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 12 }}
            transition={{
              type: reduced ? "tween" : "spring",
              stiffness: 260,
              damping: 26,
              duration: reduced ? 0 : undefined,
            }}
            className="relative my-auto grid w-full max-w-4xl gap-0 border border-rule bg-raised shadow-2xl shadow-black/50 md:grid-cols-2"
          >
            <div className="bg-surface-2/25 p-4 sm:p-5">
              <Figure
                src={project.shot!}
                alt={project.shotAlt ?? ""}
                ratio={project.shotRatio}
                priority
              />
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-muted">
                <span className="text-ink">{project.kind}</span>
                <span aria-hidden className="h-3 w-px bg-rule" />
                <span>{project.year}</span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">
                {project.stack.join(", ")}
              </p>
            </div>

            <div className="flex flex-col p-5 sm:p-7 md:border-l md:border-rule">
              <h2
                id="case-title"
                className="font-display text-xl leading-tight tracking-tight text-ink sm:text-2xl"
              >
                {project.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink">
                {project.summary}
              </p>

              <dl className="mt-5 flex flex-col gap-4 border-t border-rule pt-5">
                {[
                  ["Problem", project.problem],
                  ["What I built", project.approach],
                  ["Outcome", project.outcome],
                ].map(([term, body]) => (
                  <div key={term}>
                    <dt className="mb-1 text-[11px] uppercase tracking-[0.16em] text-accent">
                      {term}
                    </dt>
                    <dd className="text-[14px] leading-relaxed text-muted">{body}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent-solid px-5 py-2.5 text-[13px] text-on-accent transition-transform hover:-translate-y-[2px]"
                  >
                    {project.liveLabel ?? "Open"}
                    <ArrowUpRightIcon size={14} weight="bold" />
                  </a>
                )}
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-rule px-5 py-2.5 text-[13px] text-ink transition-colors hover:border-accent"
                >
                  <GithubLogoIcon size={15} />
                  Source
                </a>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label={`Close the ${project.title} case study`}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center border border-rule bg-paper/80 text-ink backdrop-blur transition-colors hover:border-accent"
            >
              <XIcon size={16} weight="bold" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
