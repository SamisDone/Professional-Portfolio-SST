import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { proof } from "../data/content";
import Reveal from "./Reveal";

/**
 * A thin band of four claims with the receipt attached to each. It sits
 * directly under the hero because this is what a reviewer needs in the first
 * ten seconds, and every figure links to the thing that proves it.
 */
export default function Proof() {
  return (
    <section className="border-b border-rule bg-raised">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {proof.map((p, i) => {
            const Tag = p.href ? "a" : "div";
            return (
              <Reveal
                key={p.label}
                index={i}
                className={`border-rule ${i > 0 ? "border-t sm:border-t-0" : ""} ${
                  i % 2 === 1 ? "sm:border-l" : ""
                } ${i > 1 ? "sm:border-t lg:border-t-0" : ""} ${
                  i === 2 ? "lg:border-l" : ""
                }`}
              >
                <Tag
                  {...(p.href
                    ? { href: p.href, target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`group flex h-full flex-col justify-between gap-3 py-7 sm:px-6 sm:first:pl-0 ${
                    p.href ? "transition-colors hover:bg-paper" : ""
                  }`}
                >
                  <span className="font-mono text-[2rem] leading-none text-accent">
                    {p.value}
                  </span>
                  <span className="flex items-start gap-1.5 text-sm leading-snug text-muted">
                    {p.label}
                    {p.href && (
                      <ArrowUpRightIcon
                        size={13}
                        className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    )}
                  </span>
                </Tag>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
