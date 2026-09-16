import { ArrowLeftIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { featured, otherWork, profile, type Project } from "../data/content";
import Reveal from "./Reveal";
import MaskText from "./MaskText";

/**
 * Every project on the site in one table, each row carrying its own source
 * link.
 *
 * The band under the rail used to send people to the GitHub repositories tab.
 * That was wrong in two directions: it listed repositories that are not
 * projects, and it did not list the projects that live on somebody else's
 * account. This page is the actual index, and it is the only place the whole
 * set is named.
 *
 * It is deliberately not in `ROUTES`, so it takes no place in the arrow-key
 * sequence and no slot in the nav. It is in `ROUTE_META`, so the build still
 * emits it as a real prerendered file with its own title and description.
 */
const owner = (repo: string) => {
  const m = repo.match(/github\.com\/([^/]+)\/([^/]+)/);
  return m ? { user: m[1], name: m[2] } : null;
};

function Row({ project, n }: { project: Project; n: number }) {
  const o = owner(project.repo);
  const mine = o?.user === profile.githubHandle;

  return (
    <tr className="border-t border-rule align-top">
      <td className="py-3 pr-4 font-mono text-[12px] text-accent">
        {String(n).padStart(2, "0")}
      </td>
      <td className="py-3 pr-5">
        <span className="text-[15px] font-medium leading-snug text-ink">
          {project.title}
        </span>
        <span className="mt-1 block max-w-[52ch] text-[13px] leading-snug text-muted">
          {project.summary}
        </span>
        {/* The kind column carries this at lg and up. Below that the column is
            hidden, and the one line that must not disappear with it is the
            one saying the repository belongs to someone else. */}
        {o && !mine && (
          <span className="mt-1 block font-mono text-[12px] text-accent-2 lg:hidden">
            {project.role ?? "Contributor"}, {o.user}
          </span>
        )}
      </td>
      <td className="hidden py-3 pr-5 md:table-cell">
        <span className="font-mono text-[12px] leading-snug text-muted">
          {project.stack.join(", ")}
        </span>
      </td>
      <td className="hidden py-3 pr-5 lg:table-cell">
        <span className="font-mono text-[12px] text-muted">
          {project.kind}, {project.year}
        </span>
        {/* Whose repository it is, where that is not hers. A row that links
            off to another account should say so on the row. */}
        {o && !mine && (
          <span className="mt-1 block font-mono text-[12px] text-accent-2">
            {project.role ?? "Contributor"}, {o.user}
          </span>
        )}
      </td>
      <td className="py-3 text-right">
        <span className="inline-flex items-center gap-3">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title}, live`}
              className="tap inline-flex items-center gap-1 text-[12px] text-accent-2 transition-colors hover:text-accent"
            >
              Live
              <ArrowUpRightIcon size={11} weight="bold" />
            </a>
          )}
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} source on GitHub`}
            className="tap inline-flex items-center gap-1 text-[12px] text-ink transition-colors hover:text-accent"
          >
            Code
            <ArrowUpRightIcon size={11} weight="bold" />
          </a>
        </span>
      </td>
    </tr>
  );
}

export default function Repositories() {
  const all = [...featured, ...otherWork];
  const live = all.filter((p) => p.live).length;

  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-shell section-pad px-5 sm:px-8">
        <Reveal>
          <Link
            to="/work"
            className="tap group mb-5 inline-flex items-center gap-2 font-mono text-[12px] text-muted transition-colors hover:text-ink"
          >
            <ArrowLeftIcon
              size={12}
              weight="bold"
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to the work
          </Link>
          <h1
            tabIndex={-1}
            className="h-section font-display text-ink outline-none"
          >
            <MaskText text="Everything, listed." />
          </h1>
          <p className="mt-2 max-w-[62ch] text-[14px] leading-snug text-muted">
            All {all.length} projects, {live} of them with something running you can
            open. Source on every row. Where a repository is not mine, the row says
            whose it is and what I did on it.
          </p>
        </Reveal>

        <Reveal index={1}>
          {/* The only element on the site allowed to scroll sideways, and only
              on a phone, where four columns cannot be made to fit honestly. */}
          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <caption className="sr-only">
                Every project, with its source repository and live demo where one
                exists.
              </caption>
              <thead>
                <tr className="border-b border-ink/30">
                  <th scope="col" className="pb-2 pr-4 font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-muted">
                    #
                  </th>
                  <th scope="col" className="pb-2 pr-5 font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-muted">
                    Project
                  </th>
                  <th scope="col" className="hidden pb-2 pr-5 font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-muted md:table-cell">
                    Stack
                  </th>
                  <th scope="col" className="hidden pb-2 pr-5 font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-muted lg:table-cell">
                    Kind
                  </th>
                  <th scope="col" className="pb-2 text-right font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-muted">
                    Links
                  </th>
                </tr>
              </thead>
              <tbody>
                {all.map((p, i) => (
                  <Row key={p.slug} project={p} n={i + 1} />
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal index={2}>
          <p className="mt-6 text-[13px] leading-snug text-muted">
            There is more on the account that is not a project: coursework, notes
            and a few browser toys.{" "}
            <a
              href={profile.githubRepos}
              target="_blank"
              rel="noopener noreferrer"
              className="tap inline-flex items-center gap-1 text-accent-2 transition-colors hover:text-accent"
            >
              All repositories on GitHub
              <ArrowUpRightIcon size={11} weight="bold" />
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
