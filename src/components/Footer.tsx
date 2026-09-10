import { Link } from "react-router-dom";
import { profile } from "../data/content";

const SOCIALS = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Codeforces", href: profile.codeforces },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-rule">
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
              className="transition-colors hover:text-ink"
            >
              {s.label}
            </a>
          ))}
          <Link to="/contact" className="transition-colors hover:text-ink">
            Get in touch
          </Link>
        </nav>
      </div>
    </footer>
  );
}
