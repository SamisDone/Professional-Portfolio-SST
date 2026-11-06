/*
 * Fails the build on any style the redesign bans.
 *
 * The skin changed eight times before this. The rule set in the PRD is what
 * stops a ninth, and this is the part of it that a machine can check. It runs
 * first in `npm run build`, so a banned style cannot reach a deploy, and in
 * CI on every push.
 *
 *   node scripts/check-bans.mjs
 *
 * Scans src/, index.html and the text files in public/. Third-party licence
 * text in src/fonts is skipped: it is not ours to restyle.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, relative, extname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TOKEN_FILE = "src/index.css";
const TEXT = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".html", ".svg", ".json", ".txt", ".xml", ".webmanifest", ".md"]);

/** The colour tokens, read out of the token file so this cannot drift from it. */
const TOKEN_NAMES = [
  "paper", "paper-2", "ink", "ink-2", "proof",
  "orange", "orange-tint", "blue", "blue-tint", "green", "green-tint", "pink", "pink-tint",
];
const tokenSrc = readFileSync(join(root, TOKEN_FILE), "utf8");
const TOKENS = new Set(
  [...tokenSrc.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\b/g)]
    .filter((m) => TOKEN_NAMES.includes(m[1]))
    .map((m) => m[2].toLowerCase()),
);
if (TOKENS.size !== TOKEN_NAMES.length) {
  console.error(`check-bans: expected ${TOKEN_NAMES.length} colour tokens in ${TOKEN_FILE}, read ${TOKENS.size}`);
  process.exit(1);
}

/*
 * Colour is only ever a fill. A section colour or proof yellow set as a text
 * colour fails: as a Tailwind text class, a CSS or inline-style color
 * property, or the fill of SVG text. Fills, borders and backgrounds pass.
 */
const C = "(?:section|proof|orange|blue|green|pink)(?:-tint)?";
const TEXT_COLOUR = [
  new RegExp(`(?:^|[\\s"'\`:])text-${C}(?![\\w-])`),
  new RegExp(`(?<![\\w-])(?:color|-webkit-text-fill-color|caret-color)\\s*:\\s*["']?var\\(--${C}\\)`),
  new RegExp(`<text[^>]*fill=["{][^"}]*--${C}`),
];

const BANNED_FACES = [
  "Instrument Serif", "Instrument Sans", "Inter", "Geist", "Space Grotesk", "Clash Display",
  "Satoshi", "Syne", "IBM Plex", "Plus Jakarta Sans", "Bricolage Grotesque", "DM Sans",
  "DM Mono", "JetBrains Mono", "Lobster Two",
];
const faceRe = new RegExp(`(?:^|["'\\s,\\[])(${BANNED_FACES.map((f) => f.replace(/ /g, "\\s+")).join("|")})(?=["'\\s,\\]]|$)`, "i");

const HYPE = /\b(crafting|seamless(?:ly)?|cutting-edge|leverag(?:e|es|ed|ing)|unlock(?:s|ed|ing)?|elevat(?:e|es|ed|ing)|empower(?:s|ed|ing)?|journey|delve|passionate|innovative|robust|game-changing)\b/i;

/** Each rule: a test on one line, and why it is banned. */
const RULES = [
  { re: /backdrop-filter|\bbackdrop-(?:blur|brightness|saturate)/, why: "no glass" },
  {
    // A gradient whose two stops are the same token is a flat fill, the only
    // way to give a colour a size to animate (the highlighter in motion.css).
    // Anything else is a gradient.
    test: (line) =>
      /(?:linear|radial|conic)-gradient|\bbg-gradient-|\bfrom-\w+-\d/.test(
        line.replace(/linear-gradient\(\s*(var\(--[\w-]+\))\s*,\s*\1\s*\)/g, ""),
      ),
    why: "no gradients",
  },
  { re: /border-radius:\s*[1-9]|\brounded-(?:sm|md|lg|xl|2xl|3xl|full)\b/, why: "square corners only" },
  { re: /\bblur\(|\bblur-(?:sm|md|lg|xl|2xl|3xl)\b/, why: "no blur" },
  {
    test: (line) => /font-family|fontFamily|@font-face|\bfont:/.test(line) && faceRe.test(line),
    why: "banned typeface",
  },
  { re: /—/, why: "no em dashes" },
  { re: /–/, why: "no en dashes; write '2023 to 2027'" },
  { test: (line) => TEXT_COLOUR.some((re) => re.test(line)), why: "section colour or proof as a text colour" },
  { re: /(?:color|bg-|fill|stroke)[^;\n]*\b(?:purple|violet)\b/i, why: "no purple or violet" },
];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

const files = [
  ...walk(join(root, "src")),
  join(root, "index.html"),
  ...walk(join(root, "public")),
].filter((p) => TEXT.has(extname(p).toLowerCase()) && !/[\\/]src[\\/]fonts[\\/]/.test(p));

const failures = [];

/*
 * Proof yellow means "this claim links to its evidence" and nothing else
 * (colour rule 1). So it may appear in exactly two places: its definition in
 * the token file, and inside a CSS rule whose selector names `.proof-mark`,
 * the one component that marks such a claim. Anywhere else, as a CSS
 * variable, a Tailwind class or its hex, it fails.
 */
const PROOF_HEX = [...tokenSrc.matchAll(/--proof:\s*(#[0-9a-fA-F]{6})/g)][0]?.[1].toLowerCase();
const PROOF_USE = /var\(--proof\)|(?<![\w-])(?:bg|border|fill|stroke|ring|outline|decoration|shadow|accent|from|via|to|divide)-proof(?![\w-])/;

for (const file of files) {
  const rel = relative(root, file).replaceAll("\\", "/");
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const isTokenFile = rel === TOKEN_FILE;
  const isCss = extname(file).toLowerCase() === ".css";
  const inSrc = rel.startsWith("src/");
  const isCopy = rel === "src/data/content.ts" || rel === "src/lib/meta.ts";
  // Open CSS selectors around the current line, outermost first.
  const selectors = [];

  lines.forEach((line, i) => {
    const at = `${rel}:${i + 1}`;

    if (isCss) {
      const code = line.replace(/\/\*.*?\*\//g, "");
      const inProofMark = selectors.some((s) => s.includes(".proof-mark")) || /\.proof-mark[^{]*\{/.test(code);
      const isDefinition = isTokenFile && /^\s*--proof:/.test(code);
      if (PROOF_USE.test(code) && !inProofMark && !isDefinition) failures.push(`${at}  proof yellow outside .proof-mark`);
      for (const m of code.matchAll(/([^{}]*)\{|\}/g)) {
        if (m[0] === "}") selectors.pop();
        else selectors.push(m[1].trim());
      }
    } else if (PROOF_USE.test(line) && !/^\s*(\/\/|\*|\/\*)/.test(line)) {
      failures.push(`${at}  proof yellow outside .proof-mark`);
    }
    if (PROOF_HEX && !isTokenFile && line.toLowerCase().includes(PROOF_HEX)) {
      failures.push(`${at}  proof yellow's hex outside the token file`);
    }
    for (const rule of RULES) {
      if (rule.re ? rule.re.test(line) : rule.test(line)) failures.push(`${at}  ${rule.why}`);
    }

    // Colour only from tokens. In src/ no hex may appear outside the token
    // file; in index.html and public/ a hex is allowed only if it is one of
    // the six, because those files cannot read a CSS variable.
    if (!isTokenFile) {
      for (const m of line.matchAll(/#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?\b/g)) {
        if (inSrc) failures.push(`${at}  hex colour ${m[0]} outside ${TOKEN_FILE}`);
        else if (!TOKENS.has(m[0].toLowerCase()))
          failures.push(`${at}  ${m[0]} is not one of the six tokens`);
      }
    }

    // Copy rules, on the two files that hold the copy. Comments are skipped:
    // the rule is about what a visitor reads.
    if (isCopy && !/^\s*(\/\/|\*|\/\*)/.test(line) && HYPE.test(line)) {
      failures.push(`${at}  banned phrasing "${line.match(HYPE)[0]}"`);
    }
  });
}

if (failures.length) {
  console.error(`check-bans: ${failures.length} banned style(s)\n`);
  for (const f of failures) console.error(`  ${f}`);
  console.error("\nSee the rule set in the redesign PRD. Fix the style rather than the check.");
  process.exit(1);
}
console.log(`check-bans: ${files.length} files clean`);
