import { profile } from "../data/content";
import { Button, Label } from "./ui";
import DecodeText from "./DecodeText";

/**
 * The first screen: who, what, and where to go.
 *
 * The name is set at poster scale on two lines, with the lead and the two
 * buttons in one row under it from `xl`: the column beside the surname was
 * 358px at 1280 and squeezed the lead. The proof row still reaches the first
 * screen at 1280 by 720.
 *
 * Top spacing is the C tier rather than A. A, at 112px, put the proof row
 * under the fold at 1280 by 720, and the proof on the first screen is the
 * first goal this page has.
 */
export default function Hero() {
  return (
    <section aria-labelledby="hero-name" className="shell tier-c">
      <Label className="text-ink">
        {profile.standfirst} / {profile.openTo}
      </Label>
      <DecodeText id="hero-name" tabIndex={-1} className="t-display mt-4">
        {/* One band per line, each as wide as its word. */}
        <span className="band">{profile.name.split(" ")[0]}</span>{" "}
        <span className="band">{profile.name.split(" ").slice(1).join(" ")}</span>
      </DecodeText>

      <div className="mt-6 xl:flex xl:items-end xl:justify-between xl:gap-12">
        <p className="t-lead max-w-[36ch] xl:max-w-[56ch]">{profile.positioning}</p>
        <div className="mt-4 flex flex-wrap gap-4 sm:mt-6 xl:mt-0 xl:shrink-0">
          <Button to="/work" variant="primary">
            See the work
          </Button>
          <Button href={profile.resumeUrl}>CV (PDF)</Button>
        </div>
      </div>
    </section>
  );
}
