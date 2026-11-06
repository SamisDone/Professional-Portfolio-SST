import { Link } from "react-router-dom";
import { proof } from "../data/content";
import { domainOf } from "../lib/projects";
import Arrow from "./Arrow";

/**
 * Four claims, each with its receipt, directly under the hero and opened by a
 * 4px rule. The whole cell is the link, and it says where it goes before you
 * press it: the destination domain sits at the foot of every cell.
 *
 * Two by two on a phone, so all four figures are on the first screen there
 * too, and four across from `lg`.
 */
export default function Proof() {
  return (
    <section aria-label="Proof" className="shell mt-8">
      <ul className="grid grid-cols-2 border-t-4 border-ink lg:grid-cols-4">
        {proof.map((item, i) => {
          const where = item.internal ? item.href : domainOf(item.href);
          const body = (
            <>
              <span className="t-figure">{item.value}</span>
              <span className="t-small mt-3 block">{item.label}</span>
              <span className="t-label mt-auto block pt-4 text-ink-2 [overflow-wrap:anywhere]">
                {where} <Arrow dir={item.internal ? "right" : "out"} />
              </span>
            </>
          );
          const cls =
            "press press-quiet flex h-full flex-col p-4 text-ink no-underline [--fill-hover:var(--section-tint)]";

          return (
            <li
              key={item.label}
              className={[
                "border-ink",
                i % 2 === 1 ? "border-l-2" : "",
                i > 1 ? "border-t-2 lg:border-t-0" : "",
                i === 2 ? "lg:border-l-2" : "",
              ].join(" ")}
            >
              {item.internal && item.href ? (
                <Link to={item.href} className={cls}>
                  {body}
                </Link>
              ) : (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
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
