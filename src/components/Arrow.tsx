/**
 * The site's three arrows: → stays on the site, ↗ leaves it, ← goes back.
 *
 * Drawn rather than typed. Neither Archivo nor Martian Mono has the
 * north-east arrow, and a fallback face for one glyph would set it in a
 * different weight from the other two. So all three are one stroke drawn the
 * same way: 2px, square caps, the colour of the text around it.
 */
const PATHS = {
  right: "M2 8h11M8.5 3.5 13 8l-4.5 4.5",
  left: "M14 8H3M7.5 3.5 3 8l4.5 4.5",
  out: "M4 12 12 4M5.5 4H12v6.5",
} as const;

export type ArrowDir = keyof typeof PATHS;

export default function Arrow({ dir = "right", className = "" }: { dir?: ArrowDir; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      width="0.85em"
      height="0.85em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={`inline-block shrink-0 ${className}`}
      style={{ verticalAlign: "-0.05em" }}
    >
      <path d={PATHS[dir]} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
