import { profile } from "../data/content";
import { Button, Label } from "./ui";

/**
 * The first screen: who, what, and where to go.
 *
 * The name is set at poster scale on two lines. From `xl` up the lead and the
 * two buttons sit in the space the surname leaves beside it, so the proof row
 * and the top of the first flagship's screenshot both reach the first screen
 * at 1280 by 720. The hero used to show that same screenshot here, which
 * repeated the spread a scroll below.
 *
 * The beside-the-surname layout is a two-column grid: the first column is as
 * wide as the surname, the second takes the rest. That width is worked out
 * from the display size (the surname is 5.82em wide in Archivo), not measured
 * from the text: measured, it changed when the web font replaced the
 * fallback, and the lead jumped sideways (a layout shift of 0.02). The heading spans both and
 * passes its two lines down to the outer rows through subgrid, so the lead
 * lines up with the surname's top edge and can only grow downwards, never up
 * into the first name. Below `xl` the column beside the surname would be too
 * narrow for the buttons, so it stacks.
 *
 * Top spacing is the C tier rather than A. A, at 112px, put the proof row
 * under the fold at 1280 by 720, and the proof on the first screen is the
 * first goal this page has.
 */
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-name"
      className="shell tier-c xl:grid xl:grid-cols-[calc(var(--display-size)*5.88)_1fr] xl:grid-rows-[auto_auto_auto]"
    >
      <Label className="text-ink xl:col-span-2 xl:col-start-1 xl:row-start-1">
        {profile.standfirst} / {profile.openTo}
      </Label>
      <h1
        id="hero-name"
        tabIndex={-1}
        className="t-display mt-4 xl:col-span-2 xl:col-start-1 xl:row-span-2 xl:row-start-2 xl:grid xl:grid-cols-subgrid xl:grid-rows-subgrid"
      >
        {/* One band per line, each as wide as its word. */}
        <span className="band xl:col-span-2">{profile.name.split(" ")[0]}</span>{" "}
        <span className="band xl:col-start-1 xl:self-start">{profile.name.split(" ").slice(1).join(" ")}</span>
      </h1>

      <div className="mt-6 xl:col-start-2 xl:row-start-3 xl:mt-0 xl:self-start xl:pl-8 xl:pt-2">
        <p className="t-lead max-w-[36ch]">{profile.positioning}</p>
        <div className="mt-4 flex flex-wrap gap-4 sm:mt-6 xl:mt-3">
          <Button to="/work" variant="primary">
            See the work
          </Button>
          <Button href={profile.resumeUrl}>CV (PDF)</Button>
        </div>
      </div>
    </section>
  );
}
