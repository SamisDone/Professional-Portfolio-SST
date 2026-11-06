import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { profile } from "../data/content";
import { ROUTES } from "../lib/routes";
import Arrow from "./Arrow";

const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Read position on a long page, drawn on the header's bottom rule.
 *
 * Width follows scroll with no spring, set as a transform so nothing is laid
 * out per frame. Clamped, because a bar even a fraction wider than the page
 * adds a horizontal scrollbar, which changes the height, which changes the
 * progress: that loop once read as the page shaking.
 */
function ReadProgress() {
  const bar = useRef<HTMLDivElement | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const de = document.documentElement;
      const max = de.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [pathname]);

  return (
    // A 4px strip of the section colour between two 2px ink rules, the lower
    // one laid over the header's own rule: a fill always carries its border.
    <div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-0.5 z-10 h-2 overflow-hidden">
      <div
        ref={bar}
        className="h-full w-full origin-left border-y-2 border-ink bg-section"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

/**
 * The header is a row of file tabs: each page is a numbered sheet, 01 to 07,
 * in the order the arrow keys walk. Every tab carries a 6px strip of its own
 * section colour, like a divider in a ring binder; the active tab is filled
 * with it and covers the header's rule, so it joins the page under it.
 *
 * Seven tabs, the wordmark and the CV need about 900px, so the tabs show from
 * `lg` up and a "Menu" button stands in below that.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const menuButton = useRef<HTMLButtonElement | null>(null);

  // Closing the menu is a reaction to the route changing, so it is adjusted
  // during render rather than from an effect.
  const [seen, setSeen] = useState(pathname);
  if (pathname !== seen) {
    setSeen(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header sticky top-0 z-50 border-b-2 border-ink bg-paper">
      <div className="shell flex h-16 items-stretch justify-between gap-6">
        <Link
          to="/"
          aria-label={`${profile.name}, home`}
          className="tap self-center whitespace-nowrap text-ink no-underline"
          style={{ fontWeight: 700, fontStretch: "112%", fontSize: "1rem", lineHeight: 1 }}
        >
          <span className="xl:hidden">{profile.initials}</span>
          <span className="hidden xl:inline">{profile.name}</span>
        </Link>

        <nav aria-label="Pages" className="hidden items-end gap-1 lg:flex">
          {ROUTES.map((r, i) => (
            // Only Home matches exactly. A case study at /work/slug is a
            // sheet inside Work, so the Work tab stays filled there.
            <NavLink key={r.path} to={r.path} end={r.path === "/"} data-section={r.section} className="tab press">
              {({ isActive }) => (
                <>
                  <span aria-hidden className="tab-face" />
                  {/* One fill, on the active tab only, so the page change can
                      carry it along the row as a single shared element. */}
                  {isActive && <span aria-hidden className="tab-fill" />}
                  <span aria-hidden className="tab-strip" />
                  {/* Named so a page change paints it above the moving fill. */}
                  <span className="flex flex-col gap-0.5" style={{ viewTransitionName: `tab-label-${num(i)}` }}>
                    <span className="t-label text-ink">{num(i)}</span>
                    <span className="t-small whitespace-nowrap font-semibold">{r.label}</span>
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary press hidden sm:inline-flex"
          >
            CV (PDF) <Arrow dir="out" />
          </a>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="btn btn-secondary press lg:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <ReadProgress />

      {open && (
        <nav
          id="site-menu"
          aria-label="Pages"
          className="menu-panel absolute inset-x-0 top-full border-b-2 border-ink bg-paper lg:hidden"
        >
          <ul className="shell flex flex-col py-3">
            {ROUTES.map((r, i) => (
              <li key={r.path} data-section={r.section} className="border-x-2 border-b-2 border-ink first:border-t-2">
                <NavLink
                  to={r.path}
                  end={r.path === "/"}
                  className={({ isActive }) =>
                    `relative flex min-h-12 items-baseline gap-4 py-3 pl-8 pr-3 text-ink no-underline ${
                      isActive ? "bg-section" : "hover:bg-paper-2"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* The same 6px divider strip the tabs carry, down the
                          left edge, with its own ink rule. */}
                      {!isActive && (
                        <span aria-hidden className="absolute inset-y-0 left-0 w-2 border-r-2 border-ink bg-section" />
                      )}
                      <span className="t-label w-6 text-ink">{num(i)}</span>
                      <span className="t-body font-semibold">{r.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
            <li className="pt-4 sm:hidden">
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary press">
                CV (PDF) <Arrow dir="out" />
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
