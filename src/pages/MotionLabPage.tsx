import { useRef, useState, type ReactNode } from "react";
import Page from "../components/Page";
import Trajectory from "../components/Trajectory";
import { Flow } from "../components/CaseStudy";
import { Exhibit } from "../components/Exhibit";
import { Row } from "../components/Work";
import { Button, Label, ProofMark, TextLink } from "../components/ui";
import { featured, research } from "../data/content";
import { ROUTES } from "../lib/routes";
import { replay } from "../lib/motion";

/**
 * /motion-lab: every motion of the motion layer as a labelled specimen, to be
 * approved one by one before any of it reaches the site. Not in ROUTES, not
 * in the sitemap, noindex, and skipped by the SEO checks.
 *
 * Each specimen switches on only its own motion, through its scope class
 * (m-a1 and so on, in src/motion.css), with the real components inside.
 */
function Specimen({
  code,
  title,
  note,
  scope,
  replayable = true,
  children,
}: {
  code: string;
  title: string;
  note: string;
  scope: string;
  replayable?: boolean;
  children: ReactNode;
}) {
  const body = useRef<HTMLDivElement | null>(null);
  return (
    <section aria-labelledby={`s-${code}`} className="tier-b">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-t-2 border-ink pt-4">
        <h2 id={`s-${code}`} className="t-h3">
          <span className="t-label mr-3 text-ink">{code}</span>
          {title}
        </h2>
        {replayable && (
          <button type="button" className="btn btn-secondary press" onClick={() => body.current && replay(body.current)}>
            Replay
          </button>
        )}
      </div>
      <p className="t-small mt-2 max-w-measure">{note}</p>
      <div ref={body} className={`${scope} mt-6`} data-tabs-replay={code === "A4" ? "" : undefined}>
        {children}
      </div>
    </section>
  );
}

/** The header's tab row, rebuilt here so it can be replayed in place. */
function Tabs({ dropping = false }: { dropping?: boolean }) {
  return (
    <div data-tabs={dropping || undefined} className="flex items-end gap-1 border-b-2 border-ink">
      {ROUTES.map((r, i) => (
        <span key={r.path} data-section={r.section} aria-current={i === 3 ? "page" : undefined} className="tab press">
          <span aria-hidden className="tab-face" />
          {i === 3 && <span aria-hidden className="tab-fill" style={{ viewTransitionName: "none" }} />}
          <span aria-hidden className="tab-strip" />
          <span className="flex flex-col gap-0.5">
            <span className="t-label text-ink">{String(i + 1).padStart(2, "0")}</span>
            <span className="t-small whitespace-nowrap font-semibold">{r.label}</span>
          </span>
        </span>
      ))}
    </div>
  );
}

/** The phone menu, rebuilt here with the same markup and classes. */
function MenuSpecimen() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" className="btn btn-secondary press" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? "Close" : "Menu"}
      </button>
      {open && (
        <nav aria-label="Menu specimen" className="menu-panel mt-4 max-w-sm">
          <ul className="m-0 flex list-none flex-col p-0">
            {ROUTES.map((r, i) => (
              <li key={r.path} data-section={r.section} className="border-x-2 border-b-2 border-ink first:border-t-2">
                <span className={`relative flex min-h-12 items-baseline gap-4 py-3 pl-8 pr-3 text-ink ${i === 0 ? "bg-section" : ""}`}>
                  {i !== 0 && <span aria-hidden className="absolute inset-y-0 left-0 w-2 border-r-2 border-ink bg-section" />}
                  <span className="t-label w-6 text-ink">{String(i + 1).padStart(2, "0")}</span>
                  <span className="t-body font-semibold">{r.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

/** A form field and its error, with the same markup as the contact form. */
function FieldSpecimen() {
  const [error, setError] = useState(false);
  return (
    <div className="max-w-md">
      <label htmlFor="lab-field" className="t-label mb-2 block text-ink">
        Email
      </label>
      <input id="lab-field" type="email" placeholder="you@company.com" className="field t-body block h-12 w-full" />
      {error && (
        <p role="alert" className="t-small mt-2 border-2 border-ink bg-paper-2 px-3 py-2">
          <strong className="font-semibold">Check this:</strong> that does not look like a valid email.
        </p>
      )}
      <div className="mt-4">
        <button type="button" className="btn btn-secondary press" onClick={() => setError((v) => !v)}>
          {error ? "Clear the error" : "Show an error"}
        </button>
      </div>
    </div>
  );
}

export default function MotionLabPage() {
  const flagship = featured[0];
  const greenlight = featured.find((p) => p.slug === "greenlight") ?? featured[0];

  return (
    <Page title="Motion lab">
      <section className="shell tier-a">
        <h1 tabIndex={-1} className="t-h1 band">
          Motion lab.
        </h1>
        <p className="t-lead mt-4 max-w-[60ch]">
          Every motion of the motion layer, one specimen each, for approval before any of it reaches the site. Entrances
          play once as each specimen enters the screen; Replay plays one again. Hovers are tried by hand.
        </p>
      </section>

      <div className="shell">
        <Specimen code="A1" scope="m-a1" title="Section rules draw" note="Each 4px section rule draws left to right over 480ms as it enters, 40ms apart.">
          {["Experience.", "Research.", "What I work with"].map((t) => (
            <div key={t} className="border-t-4 border-ink pb-6 pt-4">
              <p className="t-h3">{t}</p>
            </div>
          ))}
        </Specimen>

        <Specimen code="A2" scope="m-a2" title="Header band wipes in" note="The section colour behind the H1 wipes in from the left over 320ms. The text and the band's ink border are there from the first frame.">
          <p className="t-h1 band">Research.</p>
        </Specimen>

        <Specimen code="A3" scope="m-a3" title="Proof marks, highlighted" note="The yellow behind each evidence-linked claim sweeps in like a highlighter over 480ms, in reading order, 40ms apart. Border and arrow are there from the start.">
          <div className="flex flex-col gap-4">
            {research.map((m) => (
              <p key={m.title} className="t-h3 max-w-measure">
                <ProofMark href={m.href ?? "#"}>{m.title}</ProofMark>
              </p>
            ))}
            <p className="t-small">
              <ProofMark href={flagship.live ?? flagship.repo}>{flagship.liveLabel ?? "Live"}</ProofMark>
            </p>
          </div>
        </Specimen>

        <Specimen code="A4" scope="m-a4" title="Nav tabs drop in" note="On the first page of a session only, each tab drops 8px into place, 40ms apart. Later pages show them still.">
          <Tabs dropping />
        </Specimen>

        <Specimen code="A5" scope="m-a5" title="Exhibit uncovered" note="Once the screenshot has decoded, a paper-2 cover slides off to the right over 320ms. No scale or zoom.">
          <div className="max-w-2xl">
            <Exhibit project={flagship} sizes="672px" />
          </div>
        </Specimen>

        <Specimen code="A6" scope="m-a6" title="Labels stamp" note="FLAGSHIP labels and index numbers stamp into place as they enter: one keyframe, from scale 1.06 to 1, over 120ms.">
          <div className="flex flex-col gap-3">
            {["01", "02", "03"].map((n) => (
              <p key={n} className="flex items-baseline gap-4">
                <Label as="span" stamp className="inline-block text-ink">
                  {n}
                </Label>
                <Label as="span" stamp className="inline-block text-ink">
                  Flagship
                </Label>
              </p>
            ))}
          </div>
        </Specimen>

        <Specimen code="B1" scope="m-b1" replayable={false} title="Buttons press" note="Hover lifts 2px with the shadow growing from 4px to 6px, over 200ms; press pushes 4px into the shadow over 120ms.">
          <div className="flex flex-wrap gap-4">
            <Button to="/work" variant="primary">
              See the work
            </Button>
            <Button href="https://github.com/SamisDone">GitHub</Button>
          </div>
        </Specimen>

        <Specimen code="B2" scope="m-b2" replayable={false} title="Text links" note="On hover the underline thickens from 2px to 4px and the arrow nudges 4px the way it points.">
          <div className="t-body flex flex-wrap gap-8">
            <TextLink to="/work">All 13 projects</TextLink>
            <TextLink href="https://github.com/SamisDone">GitHub</TextLink>
            <TextLink to="/work" arrow="left">
              Back to the work
            </TextLink>
          </div>
        </Specimen>

        <Specimen code="B3" scope="m-b3" replayable={false} title="Index row hover" note="On hover the row number takes the section colour with a stamp and the thumbnail shifts 4px right. The row's shadow stays as it is.">
          <ol className="m-0 list-none border-t-2 border-ink p-0">
            <Row project={flagship} n={1} />
          </ol>
        </Specimen>

        <Specimen code="B4" scope="m-b4" replayable={false} title="Nav tab hover" note="A tab lifts 3px on hover, as if pulled out of a file.">
          <Tabs />
        </Specimen>

        <Specimen code="B5" scope="m-b5" replayable={false} title="Phone menu" note="Opening, the items drop in like index cards, 40ms apart, 200ms each. Closing is instant.">
          <MenuSpecimen />
        </Specimen>

        <Specimen code="B6" scope="m-b6" replayable={false} title="Form field" note="On focus the 3px border draws in over 200ms. An error message drops 8px into place with the snap.">
          <FieldSpecimen />
        </Specimen>

        <Specimen code="C1" scope="m-c1" title="Trajectory chart" note="The line draws over 600ms, each point stamps as the line reaches it, then its label appears. Once.">
          <div className="max-w-xl">
            <Trajectory />
          </div>
        </Specimen>


        <Specimen code="C3" scope="" replayable={false} title="After the page transition" note="Entrances wait for the sheet slide, tab handoff or morph to finish, then start. They never play under a sheet that is still moving. Try it on the site itself: page with the arrow keys, or open a case study from /work.">
          <p className="t-small">
            The page transitions themselves are unchanged: sheet slide 240ms, tab handoff 240ms, row to exhibit morph 300ms.
          </p>
        </Specimen>

        <Specimen code="E1" scope="" title="Drawn lines at constant speed" note="Everything drawn moves at constant speed (linear), with the same durations: the section rules (A1, 480ms), the chart's line (C1, 600ms) and the flow's connectors (E2, 320ms). Arrivals (stamps, wipes, drops) keep the snap ease.">
          {["Experience.", "Research.", "What I work with"].map((t) => (
            <div key={t} className="border-t-4 border-ink pb-6 pt-4">
              <p className="t-h3">{t}</p>
            </div>
          ))}
        </Specimen>

        <Specimen code="E2" scope="m-e2 m-e3" title="How it works: drafting order and escapement" note="The first time the flow enters the screen it builds the way a drawing is drafted: the connector centre lines (320ms, linear), then the step boxes' outlines (200ms), then the labels. Then the numbers advance one step per tick (E3): a 120ms stamp and a hard 80ms pause each. Six steps end at 1.88s. Replaces C2.">
          <Flow steps={greenlight.flow ?? []} />
        </Specimen>

        <Specimen code="E4" scope="m-e4 m-c1" title="Honest axis zoom" note="The chart opens on its full axis, 0 to 4.0, holds 200ms, then rescales to 3.2 to 4.0 over 400ms while the note that says so stamps in. Then the line draws and the points stamp in (C1). 1.44s in all, once. The note is part of the chart and stays, JavaScript or not.">
          <div className="max-w-xl">
            <Trajectory />
          </div>
        </Specimen>
      </div>
    </Page>
  );
}
