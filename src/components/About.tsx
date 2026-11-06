import { about, education, profile } from "../data/content";
import Entry from "./Entry";
import Trajectory from "./Trajectory";
import { Button, Label } from "./ui";

/**
 * Who I am beside where I study. Education is the first thing a recruiter
 * checks, so it takes the top of the right column, with the term-by-term
 * chart under the CGPA line so the figure and the climb read together.
 *
 * The markup is in phone order: the heading, the first paragraph, the two
 * buttons, Education, then the rest of the paragraphs, so a phone reaches the
 * CV and the degree before the longer story. From `lg` the grid puts the
 * buttons straight under the heading and the paragraphs below them, with
 * Education spanning the right column. The last row takes any spare height,
 * so a tall right column never opens gaps between the paragraphs.
 */
export default function About() {
  const [first, ...rest] = about.paragraphs;
  return (
    <>
      <div className="shell tier-a grid lg:grid-cols-12 lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-8">
        <h1 tabIndex={-1} className="t-h1 band max-w-[18ch] lg:col-span-7 lg:row-start-1">
          Build, then ask why.
        </h1>
        <p className="t-lead mt-8 max-w-measure lg:col-span-7 lg:row-start-3">{first}</p>
        <div className="mt-8 flex flex-wrap gap-4 lg:col-span-7 lg:row-start-2">
          <Button href={profile.resumeUrl} variant="primary">
            Download the CV
          </Button>
          <Button href={profile.linkedin}>LinkedIn</Button>
        </div>

        <section
          aria-labelledby="education"
          className="mt-12 lg:col-span-5 lg:col-start-8 lg:row-span-4 lg:row-start-1 lg:mt-0"
        >
          <h2 id="education" className="t-h3">
            Education
          </h2>
          <ol className="m-0 mt-4 list-none p-0">
            {education.map((e) => (
              <Entry key={e.school} title={e.award} meta={e.school} period={e.period} note={e.note} />
            ))}
          </ol>
          <div className="mt-12">
            <Trajectory />
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-4 lg:col-span-7 lg:row-start-4 lg:mt-4">
          {rest.map((p) => (
            <p key={p.slice(0, 24)} className="t-body max-w-measure">
              {p}
            </p>
          ))}
        </div>
      </div>

      <section aria-labelledby="stack" className="shell tier-b">
        <div className="border-t-4 border-ink pt-6">
          <h2 id="stack" className="t-h3">
            What I work with
          </h2>
          <dl className="m-0 mt-4 grid sm:grid-cols-2 lg:grid-cols-4">
            {about.stack.map((group, i) => (
              <div
                key={group.group}
                className={`border-t border-ink py-4 sm:pr-6 ${i > 0 ? "lg:border-l-2 lg:pl-6" : ""} ${
                  i % 2 === 1 ? "sm:border-l-2 sm:pl-6" : ""
                }`}
              >
                <Label as="dt">{group.group}</Label>
                <dd className="t-body m-0 mt-2">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
