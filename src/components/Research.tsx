import { currentResearch, research } from "../data/content";
import { Label, ProofMark, TextLink } from "./ui";

/**
 * The author list as the venue prints it, her own name in bold. Position is
 * the information: fourth of six and first of five are different work.
 */
function Authors({ names, self }: { names: string[]; self?: number }) {
  return (
    <p className="t-small mt-3 max-w-measure">
      {names.map((name, i) => (
        <span key={name}>
          {i > 0 && ", "}
          {i === self ? <strong className="font-bold">{name}</strong> : name}
        </span>
      ))}
    </p>
  );
}

/**
 * A ledger grouped by year, with a 4px rule per year. Each title is a proof
 * mark: the paper is the receipt, one click away. The thesis in progress sits
 * beside it in a plain frame, with no shadow, because it is not a link.
 */
export default function Research() {
  const years = [...new Set(research.map((m) => m.year))];

  return (
    <>
      <section className="shell tier-a">
        <h1 tabIndex={-1} className="t-h1 band">
          Research.
        </h1>
        <p className="t-lead mt-4 max-w-[46ch]">Published work, and what is on the bench now.</p>
      </section>

      <div className="shell tier-b grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          {years.map((year) => (
            <section key={year} aria-label={year} className="border-t-4 border-ink pt-6 [&+&]:mt-12">
              <Label as="h2" className="text-ink">
                {year}
              </Label>
              <ul className="m-0 mt-4 list-none p-0">
                {research
                  .filter((m) => m.year === year)
                  .map((m) => (
                    <li key={m.title} className="tint-row border-t border-ink py-6 first:border-t-0">
                      <h3 className="t-h3">
                        {m.href ? <ProofMark href={m.href}>{m.title}</ProofMark> : m.title}
                      </h3>
                      <Label className="mt-3">
                        {m.kind} / {m.venue}
                        {m.code && (
                          <>
                            {" / "}
                            <TextLink href={m.code} label={`Source code for ${m.title}`}>
                              Code
                            </TextLink>
                          </>
                        )}
                      </Label>
                      {m.authors && <Authors names={m.authors} self={m.selfIndex} />}
                      <p className="t-body mt-3 max-w-measure">{m.note}</p>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="lg:col-span-4">
          <div className="border-2 border-ink p-6">
            <Label>{currentResearch.kind}</Label>
            <h2 className="t-h3 mt-3">{currentResearch.title}</h2>
            <p className="t-body mt-3">{currentResearch.note}</p>
          </div>
        </aside>
      </div>
    </>
  );
}
