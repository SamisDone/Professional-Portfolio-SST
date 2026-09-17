import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { ListIcon, XIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { profile } from "../data/content";
import { ROUTES } from "../lib/routes";

/**
 * Derived from the same list the arrow keys walk, so the nav order and the
 * paging order can never drift apart. Home is the wordmark, so it is dropped.
 *
 * The CV used to sit inline after About, which made it read as the next
 * section even though it is a PDF download and the arrow key went to the
 * contact page instead. It now lives with the theme toggle as a utility.
 */
const LINKS = ROUTES.filter((r) => r.path !== "/");

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

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

  // Adjusted during render, not from an effect: closing the menu is a
  // reaction to the route changing, not a synchronisation with the DOM.
  const [seen, setSeen] = useState(pathname);
  if (pathname !== seen) {
    setSeen(pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-6 px-5 sm:px-8">
        {/* A surname alone is not an identity. The full name is the wordmark
            wherever there is room for it, and the initials stand in on a phone
            rather than a half of the name that could be anyone's. */}
        <Link
          to="/"
          aria-label={`${profile.name}, home`}
          className="tap whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.16em] text-ink"
        >
          <span className="md:hidden">{profile.initials}</span>
          <span className="hidden md:inline">{profile.name}</span>
        </Link>

        <nav className="hidden items-center gap-7 sm:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              className={({ isActive }) =>
                `nav-link text-[13px] font-medium transition-colors hover:text-ink ${
                  isActive ? "is-active text-ink" : "text-muted"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            // Filled, and says what it opens. It was a small outlined box in
            // the corner, and the CV is the thing most visitors came for.
            className="hidden items-center gap-1.5 bg-accent-solid px-3.5 py-2 text-[13px] font-medium text-on-accent transition-transform hover:-translate-y-[1px] sm:inline-flex"
          >
            CV (PDF)
            <ArrowUpRightIcon size={13} weight="bold" />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="-mr-2 grid h-11 w-11 place-items-center text-ink sm:hidden"
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
                key={l.path}
                to={l.path}
                className={({ isActive }) =>
                  `border-b border-rule py-3.5 text-left text-sm font-medium ${
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
              className="mb-3 mt-4 border border-rule px-4 py-3 text-center text-sm font-medium text-ink"
            >
              Download CV
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
