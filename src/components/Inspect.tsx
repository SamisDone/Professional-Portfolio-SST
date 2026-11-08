import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

type Shot = { src: string; srcSet?: string; alt: string; caption: string };

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const NAME = "inspect";

/** A view transition marked as Inspect's, so the page-change rules in
    index.css leave it alone and only the picture moves. */
function morph(update: () => void) {
  const html = document.documentElement;
  html.dataset.vt = "inspect";
  const t = document.startViewTransition!(update);
  t.finished.finally(() => {
    if (html.dataset.vt === "inspect") delete html.dataset.vt;
  });
  return t;
}

/**
 * Inspect (F4): a click on an exhibit's screenshot opens it at full size in
 * a modal sheet, the picture growing out of the thumbnail through a view
 * transition, its caption below and a Close button. Escape, the backdrop and
 * Close all shut it, and the picture shrinks back into the thumbnail. A
 * modal <dialog> keeps focus inside it and hands it back to the screenshot's
 * link on close; the page's arrow keys stand down while it is open (Pager).
 *
 * Without JavaScript the screenshot is a plain link to the full-size file,
 * so nothing here is needed to see it. Under reduced motion it opens and
 * closes at once.
 */
export default function Inspect() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLAnchorElement | null>(null);
  const [shot, setShot] = useState<Shot | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[data-inspect]");
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const thumb = link.querySelector("img");
      if (!thumb || !dialog.current) return;
      e.preventDefault();
      opener.current = link;
      const next: Shot = {
        src: link.href,
        srcSet: thumb.srcset || undefined,
        alt: thumb.alt,
        caption: link.closest("figure")?.querySelector("figcaption")?.textContent ?? "",
      };
      const open = () => {
        flushSync(() => setShot(next));
        dialog.current?.showModal();
      };
      if (!document.startViewTransition || reduced()) return open();
      thumb.style.viewTransitionName = NAME;
      morph(() => {
        thumb.style.viewTransitionName = "";
        open();
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = () => {
    const d = dialog.current;
    if (!d?.open) return;
    const thumb = opener.current?.querySelector("img");
    const done = () => opener.current?.focus({ preventScroll: true });
    if (!document.startViewTransition || reduced() || !thumb) {
      d.close();
      return done();
    }
    const t = morph(() => {
      d.close();
      thumb.style.viewTransitionName = NAME;
    });
    t.finished.finally(() => {
      thumb.style.viewTransitionName = "";
      done();
    });
  };

  return (
    <dialog
      ref={dialog}
      aria-label={shot ? `Screenshot: ${shot.caption}` : "Screenshot"}
      className="inspect"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      // A click on the dialog itself, not its sheet, is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      {shot && (
        <figure className="m-0 flex max-h-[inherit] flex-col border-4 border-ink bg-paper">
          <img
            src={shot.src}
            srcSet={shot.srcSet}
            sizes="min(92vw, 1400px)"
            alt={shot.alt}
            style={{ viewTransitionName: NAME }}
            className="block min-h-0 w-full flex-1 object-contain"
          />
          <figcaption className="flex items-center justify-between gap-4 border-t-2 border-ink px-3 py-2">
            <span className="t-label text-ink-2">{shot.caption}</span>
            <button type="button" autoFocus onClick={close} className="btn btn-secondary press shrink-0">
              Close
            </button>
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}
