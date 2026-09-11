import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { profile } from "../data/content";

const SOCIALS = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Codeforces", href: profile.codeforces },
];

export default function Footer() {
  const ref = useRef<HTMLElement | null>(null);

  /*
   * Publishes the footer's height as `--footer-h`.
   *
   * The pager is fixed to the bottom of the viewport and was landing on top of
   * these links: at 1280x720 it covered 68px of "Get in touch", which is both
   * unreadable and unclickable. It now sits above the footer instead, and this
   * is how it knows where that is. Measured rather than hard-coded, because
   * the footer stacks to two rows below `sm` and its height changes with it.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty(
        "--footer-h",
        `${Math.round(el.getBoundingClientRect().height)}px`,
      );
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={ref} className="relative z-10 border-t border-rule">
      <div className="mx-auto flex max-w-shell flex-col gap-6 px-5 py-5 font-mono text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          {profile.name}, {profile.location}
        </p>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tap transition-colors hover:text-ink"
            >
              {s.label}
            </a>
          ))}
          <Link to="/contact" className="tap transition-colors hover:text-ink">
            Get in touch
          </Link>
        </nav>
      </div>
    </footer>
  );
}
