import { about, education, profile } from "../data/content";
import Entry from "./Entry";
import Trajectory from "./Trajectory";
import { Button, Label } from "./ui";

/**
 * Who I am beside where I study. Education is the first thing a recruiter
 * checks, so it takes the top of the right column, with the term-by-term
 * chart under the CGPA line so the figure and the climb read together.
 */
export default function About() {
  return (
    <>
      <div className="shell tier-a grid gap-12 lg:grid-cols-12 lg:gap-8">
        <section className="lg:col-span-7">
          <h1 tabIndex={-1} className="t-h1 band max-w-[18ch]">
            Build, then ask why.
          </h1>
          <div className="mt-8 flex flex-col gap-4">
            {about.paragraphs.map((p, i) => (
              <p key={p.slice(0, 24)} className={`${i === 0 ? "t-lead" : "t-body"} max-w-measure`}>
                {p}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={profile.resumeUrl} variant="primary">
              Download the CV
            </Button>
            <Button href={profile.linkedin}>LinkedIn</Button>
          </div>
        </section>

        <section aria-labelledby="education" className="lg:col-span-5">
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
