import { Fragment, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { proof } from "../data/content";
import { domainOf } from "../lib/projects";
import Arrow from "./Arrow";

/** "aclanthology.org" with a <wbr> after each dot: the only places it may break. */
function breakAfterDots(text = "") {
  const parts = text.split(".");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <>
          .<wbr />
        </>
      )}
    </Fragment>
  ));
}

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
    <section aria-label="Proof" className="shell mt-6 sm:mt-8">
      {/* data-print: the row prints like a receipt as it enters (F1). */}
      <ul data-print className="grid grid-cols-2 border-t-4 border-ink lg:grid-cols-4">
        {proof.map((item, i) => {
          const where = item.internal ? item.href : domainOf(item.href);
          const body = (
            <>
              {/* The script counts the visible copy up (G); the figure a screen
                  reader hears never changes. */}
              <span className="t-figure">
                <span aria-hidden data-count>
                  {item.value}
                </span>
                <span className="sr-only">{item.value}</span>
              </span>
              <span className="t-small proof-label mt-3 block">{item.label}</span>
              <span className="t-label domain-line mt-auto block pt-3 text-ink-2 sm:pt-4">
                {/* Under 480px a domain cannot fit its cell, so the line names
                    the destination instead. */}
                <span className="proof-short">{item.short}</span>
                <span className="proof-full">{breakAfterDots(where)}</span>
                {/* A no-break space, so the arrow never wraps onto a line of its own. */}
                {"\u00A0"}
                <Arrow dir={item.internal ? "right" : "out"} />
              </span>
            </>
          );
          const cls =
            "press press-quiet flex h-full flex-col px-4 py-3 sm:p-4 text-ink no-underline [--fill-hover:var(--section-tint)]";

          return (
            <li
              key={item.label}
              style={{ "--c": i } as CSSProperties}
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
