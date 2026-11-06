import { profile } from "../data/content";
import { FLAGSHIPS } from "../lib/projects";
import { Exhibit } from "./Exhibit";
import { Button, Label } from "./ui";

/**
 * The first screen: who, what, where to go, and one exhibit.
 *
 * The name is set at poster scale on two lines. The exhibit is the first
 * flagship's screenshot, static: the shuffling deck it replaces moved on its
 * own while people read. It shows from `lg` up only, because on a phone the
 * first flagship spread repeats it a scroll below, and there the room is
 * worth more to the proof row.
 *
 * Top spacing is the C tier rather than A. A, at 112px, put the proof row
 * under the fold at 1280 by 720, and the proof on the first screen is the
 * first goal this page has.
 */
export default function Hero() {
  const lead = FLAGSHIPS[0];

  return (
    <section
      aria-labelledby="hero-name"
      className="shell tier-c lg:grid lg:grid-cols-12 lg:grid-rows-[auto_auto_auto] lg:gap-x-8"
    >
      <Label className="text-ink lg:col-span-12 lg:col-start-1 lg:row-start-1">
        {profile.standfirst} / {profile.openTo}
      </Label>
      <h1 id="hero-name" tabIndex={-1} className="t-display mt-4 lg:col-span-12 lg:col-start-1 lg:row-start-2">
        {/* One band per line, each as wide as its word, so the surname's band
            ends short of the exhibit beside it. */}
        <span className="band">{profile.name.split(" ")[0]}</span>{" "}
        <span className="band">{profile.name.split(" ").slice(1).join(" ")}</span>
      </h1>

      <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-start-3 lg:mt-6">
        <p className="t-lead max-w-[36ch]">{profile.positioning}</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button to="/work" variant="primary">
            See the work
          </Button>
          <Button href={profile.resumeUrl}>CV (PDF)</Button>
        </div>
      </div>

      {/* Spans the name's second line and the row under it, set to the
          bottom, so it takes the empty space beside the surname instead of
          pushing the proof row below the fold. */}
      {lead?.shot && (
        <div className="hidden lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-2 lg:block lg:self-end">
          <Exhibit project={lead} sizes="380px" priority />
        </div>
      )}
    </section>
  );
}
