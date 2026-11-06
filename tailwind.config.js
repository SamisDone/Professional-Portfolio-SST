/**
 * The token set, and nothing else.
 *
 * Colours, radii, borders, shadows and spacing replace Tailwind's defaults
 * rather than extending them, so a class outside the set does not exist to be
 * reached for. Type lives in src/index.css as the eight `t-*` steps, which is
 * why `fontSize` is empty here: there is no `text-sm` to drift back to.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      paper: "var(--paper)",
      "paper-2": "var(--paper-2)",
      ink: "var(--ink)",
      "ink-2": "var(--ink-2)",
      proof: "var(--proof)",
      // The page's own section colour and its tint. No section colour is
      // available by name: a component cannot reach past the page's section.
      section: "var(--section)",
      "section-tint": "var(--section-tint)",
    },
    fontFamily: {
      sans: ["Archivo", "'Archivo Fallback'", "Arial", "sans-serif"],
      mono: ["'Martian Mono'", "ui-monospace", "Menlo", "Consolas", "monospace"],
    },
    fontSize: {},
    fontWeight: {
      normal: "400",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "850",
    },
    borderRadius: { none: "0", DEFAULT: "0" },
    borderWidth: { DEFAULT: "1px", 0: "0", 2: "2px", 3: "3px", 4: "4px" },
    boxShadow: { none: "none" },
    // The 4px scale: 4, 8, 12, 16, 24, 32, 48, 72, 112. 20 is the phone
    // gutter, 64 the header, 160 the index thumbnail.
    spacing: {
      0: "0",
      px: "1px",
      0.5: "2px",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      8: "32px",
      12: "48px",
      16: "64px",
      18: "72px",
      28: "112px",
      40: "160px",
    },
    extend: {
      maxWidth: { measure: "68ch", shell: "1280px" },
      transitionTimingFunction: { DEFAULT: "cubic-bezier(0.2, 0, 0, 1)" },
      transitionDuration: { DEFAULT: "150ms", 80: "80ms", 150: "150ms", 250: "250ms" },
    },
  },
  plugins: [],
};
