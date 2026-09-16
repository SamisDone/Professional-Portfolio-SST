import { ArrowUpRightIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { proof } from "../data/content";
import Reveal from "./Reveal";

/**
 * Four claims with the receipt attached to each, directly under the hero.
 *
 * Previously this was a full-bleed row whose cell borders ran past the page
 * gutters, so the first and last claims sat in dead space and a hover tint on
 * one cell made the row look like a half-selected table. It is now a plain
 * four-column grid inside the shell: hairlines only between the columns, and
 * hover moves the arrow and the value rather than filling the cell.
 *
 * One of the four points at the work page rather than off site. It routes
 * instead of opening a tab, and carries the arrow that means "further in"
 * rather than the one that means "leaving".
 */
export default function Proof() {
  return (
    <section className="border-t border-rule">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {proof.map((item, i) => {
            const Arrow = item.internal ? ArrowRightIcon : ArrowUpRightIcon;
            const cls = `group flex h-full flex-col gap-2 py-6 sm:py-7 ${
              i === 0 ? "lg:pr-6" : "lg:px-6"
            } ${i === proof.length - 1 ? "lg:pr-0" : ""}`;

            const body = (
              <>
                <dt className="flex items-start justify-between gap-3">
                  <span className="font-display text-[1.75rem] leading-none text-accent transition-transform duration-300 group-hover:-translate-y-0.5">
                    {item.value}
                  </span>
                  {item.href && (
                    <Arrow
                      size={14}
                      weight="bold"
                      className={`mt-1 shrink-0 text-muted transition-all duration-300 group-hover:text-accent ${
                        item.internal
                          ? "group-hover:translate-x-0.5"
                          : "group-hover:-translate-y-0.5"
                      }`}
                    />
                  )}
                </dt>
                <dd className="max-w-[28ch] text-[14px] leading-snug text-muted">
                  {item.label}
                </dd>
              </>
            );

            return (
              <Reveal
                key={item.label}
                index={i}
                className={[
                  // Hairlines sit between columns, never on the outer edges.
                  "border-rule",
                  i > 0 ? "border-t sm:border-t-0" : "",
                  i % 2 === 1 ? "sm:border-l" : "",
                  i > 1 ? "sm:border-t" : "",
                  "lg:border-t-0",
                  i > 0 ? "lg:border-l" : "",
                ].join(" ")}
              >
                {item.internal && item.href ? (
                  <Link to={item.href} className={cls}>
                    {body}
                  </Link>
                ) : item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    {body}
                  </a>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </Reveal>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
