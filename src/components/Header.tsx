import { useEffect, useState } from "react";
import { SunIcon, MoonIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import { profile } from "../data/content";
import { applyTheme, storedTheme, systemTheme, type Theme } from "../lib/theme";

const LINKS = [
  { label: "Work", id: "work" },
  { label: "Research", id: "research" },
  { label: "About", id: "about" },
];

export default function Header() {
  // Resolved once on mount rather than pushed in from an effect.
  const [theme, setTheme] = useState<Theme>(() => storedTheme() ?? systemTheme());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dialog-open", open);
    return () => document.body.classList.remove("dialog-open");
  }, [open]);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-6 px-5 sm:px-8">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-mono text-[13px] uppercase tracking-[0.16em] text-ink"
        >
          Sarker
        </a>

        <nav className="hidden items-center gap-7 sm:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="font-mono text-[13px] text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </button>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[13px] text-muted transition-colors hover:text-ink"
          >
            CV
          </a>
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="grid h-9 w-9 place-items-center text-muted transition-colors hover:text-ink"
          >
            {theme === "dark" ? <SunIcon size={17} /> : <MoonIcon size={17} />}
          </button>
          <button
            onClick={() => go("contact")}
            className="hidden bg-ink px-4 py-2 font-mono text-[13px] text-paper transition-opacity hover:opacity-85 active:scale-[0.98] sm:block"
          >
            Get in touch
          </button>
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

      {open && (
        <nav className="border-t border-rule bg-paper sm:hidden">
          <div className="mx-auto flex max-w-shell flex-col px-5 py-2">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="border-b border-rule py-3.5 text-left font-mono text-sm text-ink"
              >
                {l.label}
              </button>
            ))}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-rule py-3.5 font-mono text-sm text-ink"
            >
              CV
            </a>
            <button
              onClick={() => go("contact")}
              className="mt-4 mb-3 bg-ink px-4 py-3 font-mono text-sm text-paper"
            >
              Get in touch
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
