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
      },
      fontFamily: {
        sans: ["'Geist Variable'", "system-ui", "sans-serif"],
        mono: ["'Geist Mono Variable'", "ui-monospace", "monospace"],
      },
      // One radius scale, near-sharp. A technical document, not a card deck.
      borderRadius: { none: "0", sm: "2px", DEFAULT: "3px", md: "3px", lg: "4px" },
      maxWidth: { measure: "68ch", shell: "1240px" },
      letterSpacing: { tightest: "-0.045em" },
    },
  },
  plugins: [],
};
