import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../data/content";

const LINKS = [
  { label: "Home", id: "hero" },
  { label: "Work", id: "work" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const scrollToId = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
        <div
          className={`inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2 transition-shadow duration-300 ${
            scrolled ? "shadow-md shadow-black/10" : ""
          }`}
        >
          <button
            onClick={() => scrollToId("hero")}
            aria-label="Scroll to top"
            className="group relative w-9 h-9 rounded-full p-[1.5px] transition-transform duration-300 hover:scale-110 bg-[linear-gradient(90deg,#89AACC_0%,#4E85BF_100%)] hover:bg-[linear-gradient(270deg,#89AACC_0%,#4E85BF_100%)]"
          >
            <span className="flex items-center justify-center w-full h-full rounded-full bg-bg">
              <span className="font-display italic text-[13px] text-text-primary">
                {profile.initials}
              </span>
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden sm:block w-px h-5 bg-stroke mx-1" />

          <div className="relative hidden sm:flex items-center">
            {LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToId(link.id)}
                className="relative text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2"
              >
                {active === link.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-stroke/50"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    active === link.id
                      ? "text-text-primary"
                      : "text-muted hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </span>
              </button>
            ))}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-muted hover:text-text-primary hover:bg-stroke/50"
            >
              Resume
            </a>
          </div>

          <div className="hidden sm:block w-px h-5 bg-stroke mx-1" />

          {/* Desktop Say hi button */}
          <button onClick={() => scrollToId("contact")} className="hidden sm:block group relative rounded-full">
            <span
              className="absolute -inset-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundImage: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)" }}
            />
            <span className="relative z-10 flex items-center gap-1 bg-surface rounded-full backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-text-primary">
              Say hi <span aria-hidden>↗</span>
            </span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden relative w-9 h-9 flex items-center justify-center ml-1"
          >
            <div className="flex flex-col items-center justify-center gap-[5px]">
              <span
                className={`block w-5 h-[1.5px] bg-text-primary rounded-full transition-all duration-300 origin-center ${
                  menuOpen ? "rotate-45 translate-y-[3.25px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-text-primary rounded-full transition-all duration-300 origin-center ${
                  menuOpen ? "-rotate-45 -translate-y-[3.25px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl sm:hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
              className="flex flex-col items-center justify-center h-full gap-8"
            >
              {LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.35, ease: "easeOut" }}
                  onClick={() => scrollToId(link.id)}
                  className="text-3xl font-display italic text-text-primary hover:text-muted transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.a
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.35, ease: "easeOut" }}
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl font-display italic text-text-primary hover:text-muted transition-colors"
              >
                Resume
              </motion.a>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.35, ease: "easeOut" }}
                className="pt-4"
              >
                <button
                  onClick={() => scrollToId("contact")}
                  className="group relative rounded-full"
                >
                  <span
                    className="absolute -inset-[2px] rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundImage: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)" }}
                  />
                  <span className="relative z-10 flex items-center gap-2 bg-bg rounded-full px-8 py-4 text-lg text-text-primary">
                    Say hi <span aria-hidden>↗</span>
                  </span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
