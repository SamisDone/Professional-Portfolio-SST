import { featured, notable, otherWork, research, type Project } from "../data/content";
import shots from "../data/shots.json";
import previews from "../data/shot-previews.json";
import { SITE_URL } from "./site";

/** The three spreads on the home page, and the first three rows of /work. */
export const FLAGSHIPS = featured.slice(0, 3);

/** The /work index: the flagships first, then the rest in their set order. */
export const WORK_INDEX: Project[] = [...featured, ...notable];

/** Every project, in the order /repositories lists them and the case study
    pages step through them. */
export const ALL_PROJECTS: Project[] = [...featured, ...notable, ...otherWork];

export const caseStudyPath = (p: Pick<Project, "slug">) => `/work/${p.slug}`;

export function findProject(slug: string | undefined) {
  return ALL_PROJECTS.find((p) => p.slug === slug);
}

/** "Lead developer, team build", for a row or a spread. Said wherever the
    work is shown, so a team project never passes as solo work. A role that
    already says "team" is not told twice. */
export function teamLine(p: Project) {
  if (!p.team || !p.role) return undefined;
  return /team/i.test(p.role) ? p.role : `${p.role}, team build`;
}

export function isFlagship(p: Project) {
  return FLAGSHIPS.some((f) => f.slug === p.slug);
}

/** Previous and next in ALL_PROJECTS, for the bar at the foot of a case study. */
export function projectNeighbours(slug: string) {
  const i = ALL_PROJECTS.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? ALL_PROJECTS[i - 1] : undefined,
    next: i >= 0 && i < ALL_PROJECTS.length - 1 ? ALL_PROJECTS[i + 1] : undefined,
  };
}

/**
 * The /work filters. Each is worked out from the project's own kind and
 * stack in content.ts, so a new project files itself. A project can sit
 * under more than one. The key is what goes in ?kind=.
 */
const any = (p: Project, names: string[]) => p.stack.some((s) => names.includes(s));
export const WORK_FILTERS: { key: string; label: string; test: (p: Project) => boolean }[] = [
  { key: "chrome", label: "Chrome extensions", test: (p) => p.kind === "Chrome extension" },
  {
    key: "web",
    label: "Web apps",
    test: (p) => any(p, ["Next.js", "React", "TanStack Start", "PHP 8", "Bun", "Node.js"]),
  },
  {
    key: "ai-ml",
    label: "AI and ML",
    test: (p) => any(p, ["Gemini API", "Claude API", "PyTorch", "YOLO11-OBB", "TFLite", "RAG"]),
  },
  { key: "hackathon", label: "Hackathon builds", test: (p) => p.kind === "Hackathon build" },
];
export const filtersOf = (p: Project) => WORK_FILTERS.filter((f) => f.test(p)).map((f) => f.key);

/** Stack names that count as a skill on About, beyond the skill's own name. */
const SKILL_ALSO: Record<string, string[]> = {
  SQL: ["SQL Server", "PostgreSQL"],
  REST: ["REST API"],
};

/**
 * The receipts for a skill on About: every project whose stack lists it,
 * live ones first in site order, and every published paper whose title
 * names it. A skill with none of either has no business on the list.
 */
export function skillReceipts(skill: string) {
  const names = [skill, ...(SKILL_ALSO[skill] ?? [])].map((s) => s.toLowerCase());
  const using = ALL_PROJECTS.filter((p) => p.stack.some((s) => names.includes(s.toLowerCase())));
  const projects = [...using.filter((p) => p.live), ...using.filter((p) => !p.live)];
  const papers = research.filter((m) => m.href && m.title.toLowerCase().includes(skill.toLowerCase()));
  return { projects, papers };
}

/** "chromewebstore.google.com", for a caption or a proof cell. */
export function domainOf(url: string | undefined) {
  if (!url) return undefined;
  try {
    return new URL(url, SITE_URL).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

/** `listing` is a store's own image, `readme` an image from the project's
    README; anything else is a capture of the running site. */
type ShotRecord = { captured: string; url?: string; kind?: "listing" | "readme" };
const SOURCE = { listing: "Listing image", readme: "README image" } as const;
const SHOTS = shots as Record<string, ShotRecord>;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** A shot's 20px preview, as a data: URI, for its frame to show while loading. */
export function shotPreview(shot: string): string | undefined {
  const stem = shot.replace(/^.*\//, "").replace(/\.\w+$/, "");
  return (previews as Record<string, string>)[stem];
}

/** The looping video for a shot, when <name>-loop.mp4 exists in public/shots. */
export function shotLoop(shot: string): string | undefined {
  const file = `${shot.replace(/^.*\//, "").replace(/\.\w+$/, "")}-loop.mp4`;
  return __SHOT_LOOPS__.includes(file) ? `/shots/${file}` : undefined;
}

/**
 * Starts fetching a project's full-size screenshot, the one its case study
 * exhibit will draw. Called when a /work row is hovered or focused, so by the
 * time it is clicked the image is cached and the row's thumbnail can grow
 * into the real picture rather than an empty frame.
 */
const preloaded = new Set<string>();
export function preloadShot(p: Project) {
  if (!p.shot || preloaded.has(p.slug) || typeof window === "undefined") return;
  preloaded.add(p.slug);
  const img = new Image();
  img.src = p.shot.replace(/\.(jpg|jpeg|png)$/i, ".webp");
}

/** "2026-09-11" to "11 Sep 2026". Parsed by hand so the server and the
    browser cannot disagree about the time zone. */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/**
 * The caption bar under a screenshot: what it is, where it came from, when.
 * The date comes from src/data/shots.json, which scripts/capture-shots.mjs
 * writes on every capture, so a stale image says how stale it is.
 */
export function captionFor(p: Project) {
  if (!p.shot) return undefined;
  const stem = p.shot.replace(/^.*\//, "").replace(/\.\w+$/, "");
  const record = SHOTS[stem];
  const parts = [p.title];
  const domain = domainOf(record?.url ?? p.live);
  if (domain) parts.push(domain);
  if (record) {
    parts.push(
      `${record.kind ? SOURCE[record.kind] : "Captured"} ${formatDate(record.captured)}`,
    );
  }
  return parts.join(" / ");
}
