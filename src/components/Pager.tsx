import { useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { neighbours, routeIndex } from "../lib/routes";
import Arrow from "./Arrow";

const TYPING = new Set(["INPUT", "TEXTAREA", "SELECT"]);
const num = (path: string) => String(routeIndex(path) + 1).padStart(2, "0");

/** The key that does the same as the link, shown only where there is a
    keyboard to press it. */
function KeyHint({ dir }: { dir: "left" | "right" }) {
  return (
    <kbd className="t-label hidden border-2 border-ink px-1 py-0.5 text-ink [@media(hover:hover)]:inline-flex">
      <Arrow dir={dir} />
    </kbd>
  );
}

/**
 * Left and right arrow keys walk the pages in `ROUTES` order, and the same two
 * moves sit at the end of every page so the shortcut is discoverable.
 *
 * It sits in the page flow now. Fixed to the viewport it needed the footer's
 * height measured into a CSS variable to stay off the links, and still floated
 * over body text on a page that scrolled. At the end of the page it can only
 * be met when the reader has finished, which is when "what next" is asked.
 *
 * The key handler stands down wherever the arrows already mean something:
 * a form field, anything marked `data-arrow-surface`, or a modifier held for
 * a browser shortcut. Case study pages are not in `ROUTES`, so there is
 * nothing to page to from one and the keys do nothing there.
 */
export default function Pager() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { prev, next } = neighbours(pathname);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const el = event.target as HTMLElement | null;
      if (el) {
        if (TYPING.has(el.tagName) || el.isContentEditable) return;
        if (el.closest("[data-arrow-surface]")) return;
      }
      // From the address bar, not the rendered page: during a page change the
      // URL has already moved and the page has not, and a second press in
      // that window must go on from the new address, not repeat the last one.
      const here = neighbours(window.location.pathname);
      const target = event.key === "ArrowRight" ? here.next : here.prev;
      if (!target) return;
      event.preventDefault();
      navigate(target.path);
    },
    [navigate],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  if (!prev && !next) return null;

  return (
    <nav aria-label="Previous and next page" className="shell tier-b">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink pt-8">
        {prev ? (
          // The accessible name is the visible text with its purpose in front,
          // so a voice user saying what they see still hits it.
          <Link to={prev.path} className="btn btn-secondary press pager-btn">
            <Arrow dir="left" />
            <span>
              <span className="sr-only">Previous page: </span>
              <span className="t-label mr-2 text-ink">{num(prev.path)}</span>
              {prev.label}
            </span>
            <KeyHint dir="left" />
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={next.path} className="btn btn-secondary press pager-btn pager-next">
            <KeyHint dir="right" />
            <span>
              <span className="sr-only">Next page: </span>
              <span className="t-label mr-2 text-ink">{num(next.path)}</span>
              {next.label}
            </span>
            <Arrow dir="right" />
          </Link>
        )}
      </div>
    </nav>
  );
}
