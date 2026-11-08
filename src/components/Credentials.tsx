import { Link } from "react-router-dom";
import { experience, research } from "../data/content";
import { domainOf } from "../lib/projects";
import Arrow from "./Arrow";

type Card = { title: string; venue: string; line: string; href: string; internal?: boolean };

const [ieee, acl] = research;
const cortex = experience[0];

/** Both papers and the Cortex role, from the same entries their pages read. */
const CARDS: Card[] = [
  { title: ieee.title, venue: ieee.venue, line: ieee.note, href: ieee.href! },
  { title: acl.title, venue: acl.venue, line: acl.note, href: acl.href! },
  {
    title: cortex.role,
    venue: cortex.org,
    // The first sentence of the point that says what Cortex is.
    line: cortex.points[1].split(". ")[0] + ".",
    href: "/experience",
    internal: true,
  },
];

/**
 * The end of Home on a desktop: the two papers and the Cortex role, drawn like
 * the proof row, so the page closes on evidence rather than on a lone button.
 * A phone reaches the pager straight after the flagships and skips this.
 */
export default function Credentials() {
  return (
    <section aria-labelledby="credentials" className="shell tier-b hidden lg:block">
      <h2 id="credentials" className="sr-only">
        Research and experience
      </h2>
      <ul className="m-0 grid list-none grid-cols-3 border-t-4 border-ink p-0">
        {CARDS.map((card, i) => {
          const body = (
            <>
              <span className="t-label text-ink-2">{card.venue}</span>
              <h3 className="t-h3 mt-2">{card.title}</h3>
              <span className="t-small mt-2 block">{card.line}</span>
              <span className="t-label mt-auto block pt-3 text-ink-2">
                {card.internal ? card.href : domainOf(card.href)}
                {" "}
                <Arrow dir={card.internal ? "right" : "out"} />
              </span>
            </>
          );
          const cls =
            "press press-quiet flex h-full flex-col p-4 text-ink no-underline [--fill-hover:var(--section-tint)]";
          return (
            <li key={card.title} className={i > 0 ? "border-l-2 border-ink" : ""}>
              {card.internal ? (
                <Link to={card.href} className={cls}>
                  {body}
                </Link>
              ) : (
                <a href={card.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {body}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
