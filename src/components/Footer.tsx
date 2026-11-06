import { Link } from "react-router-dom";
import { profile } from "../data/content";

const SOCIALS = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Codeforces", href: profile.codeforces },
];

/** The one inverse block on the site: paper on ink, 16.73:1. */
export default function Footer() {
  return (
    <footer className="site-footer on-ink mt-18 bg-ink text-paper">
      <div className="shell t-label flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {profile.name}, {profile.location}
        </p>
        <nav aria-label="Profiles" className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tap text-paper no-underline underline-offset-4 hover:underline"
            >
              {s.label}
            </a>
          ))}
          <Link to="/contact" className="tap text-paper no-underline underline-offset-4 hover:underline">
            Get in touch
          </Link>
        </nav>
      </div>
    </footer>
  );
}
