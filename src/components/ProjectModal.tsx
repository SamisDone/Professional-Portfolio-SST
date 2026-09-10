import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "../data/content";
import ProjectVisual from "./ProjectVisual";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Props = {
  project: Project | null;
  onClose: () => void;
};

const SELECTORS =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Section({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <h4 className="text-[10px] text-muted uppercase tracking-[0.25em] mb-1.5">
        {label}
      </h4>
      <p className="text-sm leading-relaxed text-text-primary/75">{body}</p>
    </div>
  );
}

/**
 * The case study. This is the part a reviewer actually reads, so it gets the
 * full dialog treatment: focus is trapped while it's open, Escape closes it,
 * and focus returns to the card that opened it.
 */
export default function ProjectModal({ project, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!project) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.classList.add("menu-open");

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(SELECTORS),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Defer so the panel exists before we move focus into it.
    const id = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>(SELECTORS)?.focus();
    }, 40);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(id);
      document.body.classList.remove("menu-open");
      restoreRef.current?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto max-w-lg w-full rounded-3xl bg-surface border border-stroke overflow-hidden max-h-[92vh] overflow-y-auto"
          >
            <ProjectVisual art={project.art} className="h-36 w-full shrink-0" />

            <div className="p-6 sm:p-8">
              <span className="text-xs text-muted uppercase tracking-[0.2em]">
                {project.category}
              </span>
              <h3
                id="project-modal-title"
                className="font-display italic text-3xl text-text-primary mt-2 mb-4"
              >
                {project.title}
              </h3>

              <div className="flex flex-col gap-4 mb-6">
                <Section label="The problem" body={project.problem} />
                <Section label="What I built" body={project.approach} />
                <Section label="Outcome" body={project.outcome} />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] uppercase tracking-wide text-muted border border-stroke rounded-full px-2 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center rounded-full border border-stroke px-4 py-3 text-sm text-text-primary hover:bg-stroke/40 transition-colors"
                >
                  View code
                </a>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center rounded-full bg-text-primary text-bg px-4 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    {project.liveLabel ?? "Live site"}
                  </a>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label={`Close ${project.title} case study`}
              className="absolute top-4 right-4 w-9 h-9 rounded-full grid place-items-center bg-bg/70 backdrop-blur text-text-primary hover:bg-bg transition-colors"
            >
              <span aria-hidden>✕</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
