/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
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
        violet: "hsl(var(--violet))",
        coral: "hsl(var(--coral))",
      },
      fontFamily: {
        sans: ["'Libre Franklin Variable'", "system-ui", "sans-serif"],
        display: ["'Climate Crisis Variable'", "'Libre Franklin Variable'", "sans-serif"],
        // Existing `font-mono` labels keep their spacing but drop to Libre
        // Franklin, so the page only ever uses the two specified families.
        mono: ["'Libre Franklin Variable'", "system-ui", "sans-serif"],
      },
      // One radius scale, near-sharp. A technical document, not a card deck.
      borderRadius: { none: "0", sm: "2px", DEFAULT: "3px", md: "3px", lg: "4px" },
      maxWidth: { measure: "68ch", shell: "1240px" },
      letterSpacing: { tightest: "-0.045em" },
    },
  },
  plugins: [],
};
