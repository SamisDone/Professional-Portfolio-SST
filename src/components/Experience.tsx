import { experience, profile } from "../data/content";
import { Button, Label, ProofMark } from "./ui";
import DecodeText from "./DecodeText";

/**
 * Employment as a ledger: dates and place in the left margin, the work on the
 * right, and a 4px rule between employers. Kept apart from the research
 * ledger, because the two answer different questions.
 */
export default function Experience() {
  return (
    <>
      <section className="shell tier-a">
        <DecodeText tabIndex={-1} className="t-h1 band">
          Experience.
        </DecodeText>
        <p className="t-lead mt-4 max-w-[46ch]">Industrial attachment, contract and freelance work.</p>
        <div className="mt-6">
          <Button href={profile.resumeUrl} variant="primary">
            Download the CV
          </Button>
        </div>
      </section>

      {/* The 4px rules are drawn by A1; F2 reveals each role's text. */}
      <ol data-ledger="none" className="shell tier-b m-0 list-none">
        {experience.map((role) => (
          <li key={role.org} className="tint-row grid gap-4 border-t-4 border-ink pb-12 pt-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
              <Label date className="text-ink">
                {role.period}
              </Label>
              {role.location && <Label className="mt-1">{role.location}</Label>}
            </div>
            <div className="lg:col-span-9">
              <h2 className="t-h2">{role.org}</h2>
              <p className="t-small mt-2 font-semibold">{role.role}</p>
              {role.href && (
                <p className="t-small mt-3">
                  <ProofMark href={role.href}>{role.hrefLabel ?? "Source"}</ProofMark>
                </p>
              )}
              {role.points.length > 0 && (
                <ul className="mt-6 flex list-none flex-col gap-3 p-0">
                  {role.points.map((point) => (
                    <li key={point} className="t-body square-bullet max-w-measure">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
