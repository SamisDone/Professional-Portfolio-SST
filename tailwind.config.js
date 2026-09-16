/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "hsl(var(--paper))",
        raised: "hsl(var(--raised))",
        ink: "hsl(var(--ink))",
        muted: "hsl(var(--muted))",
        rule: "hsl(var(--rule))",
        accent: "hsl(var(--accent))",
        "accent-solid": "hsl(var(--accent-solid))",
        "on-accent": "hsl(var(--on-accent))",
        "surface-2": "hsl(var(--surface-2))",
        "accent-2": "hsl(var(--accent-2))",
      },
      fontFamily: {
        sans: ["'Instrument Sans'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Instrument Serif'", "Georgia", "'Times New Roman'", "serif"],
        // A real monospace now. `font-mono` used to fall through to the body
        // face, so every label was proportional; DM Mono is wider per glyph,
        // which is why the nav and the pager were re-measured after the swap.
        mono: ["'DM Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      // One radius scale, near-sharp. A technical document, not a card deck.
      borderRadius: { none: "0", sm: "2px", DEFAULT: "3px", md: "3px", lg: "4px" },
      maxWidth: { measure: "68ch", shell: "1240px" },
      letterSpacing: { tightest: "-0.045em" },
    },
  },
  plugins: [],
};
