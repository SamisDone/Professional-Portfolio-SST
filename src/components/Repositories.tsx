import { Link } from "react-router-dom";
import { profile, type Project } from "../data/content";
import { ALL_PROJECTS, caseStudyPath, WORK_INDEX } from "../lib/projects";
import { Label, ProofMark, TextLink } from "./ui";

const owner = (repo: string) => {
  const m = repo.match(/github\.com\/([^/]+)\/([^/]+)/);
  return m ? { user: m[1], name: m[2] } : null;
};

function Row({ project, n }: { project: Project; n: number }) {
  const o = owner(project.repo);
  const theirs = o && o.user !== profile.githubHandle;
  const ownerLine = theirs ? `${project.role ?? "Contributor"}, ${o.user}'s repository` : null;

  return (
    <tr className="tint-row border-t border-ink align-top">
      <td className="py-4 pr-4">
        <Label as="span" stamp className="inline-block text-ink">
          {String(n).padStart(2, "0")}
        </Label>
      </td>
      <td className="py-4 pr-6">
        <Link to={caseStudyPath(project)} className="link t-small font-bold">
          {project.title}
        </Link>
        <span className="t-small mt-1 block max-w-[52ch]">{project.summary}</span>
        {project.figureNote && <Label className="mt-2">{project.figureNote}</Label>}
        {/* The kind column carries this from lg up. Below that the column is
            hidden, and the line saying the repository is someone else's is
            the one thing that must not hide with it. */}
        {ownerLine && <Label className="mt-2 text-ink lg:hidden">{ownerLine}</Label>}
      </td>
      <td className="hidden py-4 pr-6 md:table-cell">
        <Label as="span">{project.stack.join(", ")}</Label>
      </td>
      <td className="hidden py-4 pr-6 lg:table-cell">
        <Label as="span">
          {project.kind}, {project.year}
        </Label>
        {ownerLine && <Label className="mt-2 text-ink">{ownerLine}</Label>}
      </td>
      <td className="py-4 text-right">
        <span className="inline-flex flex-col items-end gap-2">
          {project.live && (
            <ProofMark href={project.live} label={`${project.title}, live`} className="t-small">
              Live
            </ProofMark>
          )}
          <TextLink href={project.repo} label={`${project.title} source code`} className="t-small">
            Code
          </TextLink>
        </span>
      </td>
    </tr>
  );
}

/**
 * Every project on the site in one table, each row with its source, and the
 * case study one click away on the title. Not in `ROUTES`, so it takes no
 * place in the arrow-key sequence; in `ROUTE_META`, so it is still a real
 * prerendered page.
 */
export default function Repositories() {
  const live = ALL_PROJECTS.filter((p) => p.live).length;

  return (
    <>
      <section className="shell tier-c">
        <TextLink to="/work" arrow="left" className="t-small">
          Back to the work
        </TextLink>
        <h1 tabIndex={-1} className="t-h1 band mt-12">
          Everything, listed.
        </h1>
        <p className="t-lead mt-4 max-w-[58ch]">
          {ALL_PROJECTS.length} projects, {live} with something running you can open. The work page shows{" "}
          {WORK_INDEX.length} of them, {WORK_INDEX.filter((p) => p.live).length} of those live. Source on every row.
          Where a repository is not mine, the row says whose it is and what I did on it.
        </p>
      </section>

      <section className="shell tier-b">
        {/* The one box allowed to scroll sideways, and only on a phone. It is
            an arrow surface, so the arrow keys scroll it instead of paging. */}
        <div
          className="overflow-x-auto"
          data-arrow-surface
          tabIndex={0}
          role="region"
          aria-label="All projects, scrolls sideways"
        >
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <caption className="sr-only">
              Every project, with its source repository and live demo where one exists.
            </caption>
            <thead>
              <tr className="border-b-2 border-ink">
                {[
                  ["No.", ""],
                  ["Project", ""],
                  ["Stack", "hidden md:table-cell"],
                  ["Kind", "hidden lg:table-cell"],
                  ["Links", "text-right"],
                ].map(([h, cls]) => (
                  <th key={h} scope="col" className={`t-label pb-2 pr-4 font-normal text-ink ${cls}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_PROJECTS.map((p, i) => (
                <Row key={p.slug} project={p} n={i + 1} />
              ))}
            </tbody>
          </table>
        </div>

        <p className="t-small tier-c">
          There is more on the account that is not a project: coursework, notes and a few small experiments.{" "}
          <TextLink href={profile.githubRepos}>All repositories on GitHub</TextLink>
        </p>
      </section>
    </>
  );
}
