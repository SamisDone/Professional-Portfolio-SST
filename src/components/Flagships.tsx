import { Link } from "react-router-dom";
import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { featured } from "../data/content";
import Reveal from "./Reveal";
import Figure from "./Figure";

/** The first three of `featured`, so the home page and the work page agree. */
const ROWS = featured.slice(0, 3);

/**
 * Three projects on the home page, under the proof strip.
 *
 * The home page used to be one screen with no project on it, so a visitor who
 * read the name and the four figures and never clicked "See the work" left
 * without seeing a single build. These rows are for that visitor: screenshot,
 * one line, the role, and the way into the full case study.
 */
export default function Flagships() {
  return (
    <section className="border-t border-rule">
      <div className="mx-auto max-w-shell px-5 py-12 sm:px-8 sm:py-16">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h2 className="h-section font-display text-ink">Selected work</h2>
            <Link
              to="/work"
              className="tap group inline-flex items-center gap-2 text-[14px] text-accent-2"
            >
              All projects
              <ArrowRightIcon
                size={14}
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </Reveal>

        <ol className="mt-8 flex flex-col">
          {ROWS.map((project, i) => (
            <Reveal as="li" key={project.slug} index={i}>
              <article className="grid items-center gap-6 border-t border-rule py-8 md:grid-cols-12 md:gap-10">
                {project.shot && (
                  <Link
                    to={`/work#${project.slug}`}
                    aria-hidden
                    tabIndex={-1}
                    className={`block md:col-span-5 ${i % 2 === 1 ? "md:order-2" : ""}`}
                  >
                    <Figure
                      src={project.shot}
                      alt={project.shotAlt ?? ""}
                      ratio={project.shotRatio}
                      displayWidth={520}
                    />
                  </Link>
                )}

                <div className="md:col-span-7">
                  <p className="font-mono text-[13px] text-muted">
                    {project.kind}, {project.year}
                    {project.role && <span className="text-accent-2"> · {project.role}</span>}
                  </p>
                  <h3 className="mt-2 font-display text-[2.1rem] leading-[1.04] text-ink">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-measure text-[17px] leading-relaxed text-ink">
                    {project.summary}
                  </p>
                  <p className="mt-2 max-w-measure text-[15px] leading-relaxed text-muted">
                    {project.outcome}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                      to={`/work#${project.slug}`}
                      className="group inline-flex items-center gap-2 border border-rule px-4 py-2.5 text-[14px] font-medium text-ink transition-colors hover:border-accent"
                    >
                      Read the case study
                      <ArrowRightIcon
                        size={14}
                        weight="bold"
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tap inline-flex items-center gap-1 text-[14px] text-accent-2 transition-colors hover:text-accent"
                      >
                        {project.liveLabel ?? "Live"}
                        <ArrowUpRightIcon size={13} weight="bold" />
                      </a>
                    )}
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} source on GitHub`}
                      className="tap inline-flex items-center gap-1 text-[14px] text-muted transition-colors hover:text-accent"
                    >
                      Code
                      <ArrowUpRightIcon size={13} weight="bold" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
