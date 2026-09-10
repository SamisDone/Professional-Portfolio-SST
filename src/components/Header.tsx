import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { flushSync } from "react-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { SunIcon, MoonIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import { profile } from "../data/content";
import { applyTheme, storedTheme, defaultTheme, type Theme } from "../lib/theme";
import { useReducedMotion } from "../hooks/useReducedMotion";

const LINKS = [
  { label: "Work", to: "/work" },
  { label: "Experience", to: "/experience" },
  { label: "Research", to: "/research" },
  { label: "About", to: "/about" },
];

export default function Header() {
  // Resolved once on mount rather than pushed in from an effect.
  const [theme, setTheme] = useState<Theme>(() => storedTheme() ?? defaultTheme());
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const { pathname } = useLocation();
  const reduced = useReducedMotion();

  // Read position for a long single page. useScroll rather than a scroll
  // listener, so this never runs work on the main thread per frame.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.body.classList.toggle("dialog-open", open);
    return () => document.body.classList.remove("dialog-open");
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const commit = () => {
      setTheme(next);
      applyTheme(next);
    };

    // The new theme is wiped in as a circle growing out of the button that was
    // pressed, so the change reads as caused by the click rather than as the
    // page blinking. Browsers without view transitions just swap.
    const startViewTransition = document.startViewTransition?.bind(document);
    if (!startViewTransition || reduced) {
      commit();
      return;
    }

    const rect = toggleRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : 0;
    const radius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy),
    );

    const transition = startViewTransition(() => {
      flushSync(commit);
    });

    void transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${radius}px at ${cx}px ${cy}px)`],
        },
        {
          duration: 620,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          to="/"
          className="font-mono text-[13px] uppercase tracking-[0.16em] text-ink"
        >
          Sarker
        </Link>

        <nav className="hidden items-center gap-7 sm:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `nav-link font-mono text-[13px] transition-colors hover:text-ink ${
                  isActive ? "is-active text-ink" : "text-muted"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link font-mono text-[13px] text-muted transition-colors hover:text-ink"
          >
            CV
          </a>
        </nav>

        <div className="flex items-center gap-1">
          <button
            ref={toggleRef}
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="grid h-9 w-9 place-items-center text-muted transition-colors hover:text-ink active:scale-90"
          >
            {theme === "dark" ? <SunIcon size={17} /> : <MoonIcon size={17} />}
          </button>
          <Link
            to="/contact"
            className="hidden bg-accent-solid px-4 py-2 font-mono text-[13px] text-on-accent transition-transform hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] sm:block"
          >
            Get in touch
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center text-ink sm:hidden"
          >
            {open ? <XIcon size={19} /> : <ListIcon size={19} />}
          </button>
        </div>
      </div>

      {/* Read position. Sits on the header's own bottom rule. */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-accent"
      />

      {open && (
        <nav className="border-t border-rule bg-paper sm:hidden">
          <div className="mx-auto flex max-w-shell flex-col px-5 py-2">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `border-b border-rule py-3.5 text-left font-mono text-sm ${
                    isActive ? "text-accent" : "text-ink"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-rule py-3.5 font-mono text-sm text-ink"
            >
              CV
            </a>
            <Link
              to="/contact"
              className="mb-3 mt-4 bg-accent-solid px-4 py-3 text-center font-mono text-sm text-on-accent"
            >
              Get in touch
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
