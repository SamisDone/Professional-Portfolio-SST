// Every string a visitor reads lives here. Links were taken from the link
// annotations inside the CV PDF, not from the visible link text, so each one
// resolves to the real destination.

export const profile = {
  name: "Samonwita Sarker",
  initials: "SS",
  location: "Chattogram, Bangladesh",
  email: "sarker.samonwita@gmail.com",
  github: "https://github.com/SamisDone",
  githubHandle: "SamisDone",
  linkedin: "https://www.linkedin.com/in/samonwita-sarker-a87737262/",
  codeforces: "https://codeforces.com/profile/jinxed_sam",
  codeforcesHandle: "jinxed_sam",
  resumeUrl: "/Samonwita_Sarker_CV.pdf",
  standfirst: "CSE '27, CUET",
  // Hero subtext. Kept under 20 words so the hero always fits one viewport.
  positioning:
    "I build full-stack products, and I research how to make a model's predictions explainable.",
};

/**
 * The strip directly under the hero. Four claims, each with the receipt
 * attached. Nothing here is a round marketing number.
 */
export type Proof = {
  value: string;
  label: string;
  href?: string;
};

export const proof: Proof[] = [
  {
    value: "2",
    label: "extensions published on the Chrome Web Store",
    href: "https://chromewebstore.google.com/detail/riphours/iagjeekneaalapjnnofnifleaiondbbb",
  },
  {
    value: "1",
    label: "peer-reviewed paper, IEEE ICECTE 2026",
    href: "https://ieeexplore.ieee.org/document/11429440",
  },
  {
    value: "7th",
    label: "of the field at an ACL 2026 shared task",
    href: "https://openreview.net/forum?id=ZnWQpLP5Mc",
  },
  {
    value: "300+",
    label: "competitive programming problems solved",
    href: "https://codeforces.com/profile/jinxed_sam",
  },
];

export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  /** One line. What it is, in plain language. */
  summary: string;
  stack: string[];
  repo: string;
  live?: string;
  liveLabel?: string;
  /** Real screenshot of the running product. No mockups, no illustrations. */
  shot?: string;
  shotAlt?: string;
  /**
   * Every shot is stored at 16:10 so every frame in the rail is the same
   * shape. The frame matches that exactly: nothing is cropped at render time
   * and there are never bars around an image.
   */
  shotRatio?: string;
  problem: string;
  approach: string;
  outcome: string;
};

/**
 * The five that carry the most weight, and the five with a running product to
 * show. StockMaster stays in the secondary index because it has no live
 * deployment, and a case row here without a real screenshot would be a hole.
 */
export const featured: Project[] = [
  {
    slug: "medihub",
    title: "MediHub",
    kind: "AI healthcare platform",
    year: "2026",
    summary:
      "Hospital management with Gemini-backed symptom routing and three separate roles.",
    stack: ["React", "Node.js", "Firebase", "Gemini API"],
    repo: "https://github.com/SamisDone/AI-Powered-Hospital-Management-System",
    live: "https://ai-powered-hospital-management-syst.vercel.app/",
    liveLabel: "Open the demo",
    shot: "/shots/medihub.jpg",
    shotAlt: "The MediHub landing page, showing the hospital's AI triage product.",
    problem:
      "Admins, doctors and patients all need the same hospital records, but each should see a different slice of them. Front desks also spend real time routing walk-in patients to the right department by hand.",
    approach:
      "Every session resolves through Firebase Auth to one of three roles, and the role decides both the route tree the user gets and the reads they are allowed to make. Symptom intake goes to the Gemini API behind a structured prompt that returns a ranked department, deliberately framed as routing and not as diagnosis.",
    outcome:
      "Deployed and publicly reachable, with the full role-separated flow working end to end.",
  },
  {
    slug: "riphours",
    title: "RIPHours",
    kind: "Chrome extension",
    year: "2025",
    summary:
      "A time tracker that makes no network requests, so your browsing history stays on your machine.",
    stack: ["JavaScript", "Chrome APIs", "Storage Sync"],
    repo: "https://github.com/SamisDone/RIPHours",
    live: "https://chromewebstore.google.com/detail/riphours/iagjeekneaalapjnnofnifleaiondbbb",
    liveLabel: "Chrome Web Store",
    shot: "/shots/riphours.png",
    shotAlt:
      "Three RIPHours panels: time breakdown by site, daily limits, and settings.",
    problem:
      "Browser time trackers ask you to hand over your full browsing history, usually to a server you cannot inspect. That is a steep price for a bar chart.",
    approach:
      "The extension makes no network requests at all. State lives in chrome.storage.sync so it follows you between devices without a backend, the idle API stops the clock when you step away so the totals stay honest, and per-site budgets are enforced as a hard block rather than a dismissible nudge.",
    outcome:
      "Published and installable today. The zero-request claim is the kind you can check yourself in the network panel.",
  },
  {
    slug: "tabsaver",
    title: "TabSaver",
    kind: "Chrome extension",
    year: "2025",
    summary:
      "Restores a whole working session, tab groups intact, in one click.",
    stack: ["JavaScript", "Chrome APIs"],
    repo: "https://github.com/SamisDone/TabSaver-2.0",
    live: "https://chromewebstore.google.com/detail/tabsaver/emjeegpjecaljggipjdaofmlkoolikdk",
    liveLabel: "Chrome Web Store",
    shot: "/shots/tabsaver.jpg",
    shotAlt: "The TabSaver panel listing a saved session and its tab count.",
    problem:
      "Closing a window full of research tabs loses the shape of the work, not just the URLs. Bookmarking flattens the grouping that made them useful in the first place.",
    approach:
      "A session is captured as a structured snapshot that preserves tab groups rather than a flat list of URLs, so restoring puts the workspace back the way it was. Sessions are named, searchable and exportable, which is what makes it usable past the first week.",
    outcome: "Published on the Chrome Web Store alongside RIPHours.",
  },
  {
    slug: "pierra",
    title: "PIERRA",
    kind: "Client work",
    year: "2025",
    summary:
      "A bilingual site for a Montreal exterior design firm. My first paid engagement.",
    stack: ["Next.js", "Tailwind CSS"],
    repo: "https://github.com/SamisDone",
    live: "https://pierrafinal.vercel.app/",
    liveLabel: "Open the site",
    shot: "/shots/pierra.jpg",
    shotAlt: "The PIERRA homepage for a Montreal exterior design firm.",
    problem:
      "The firm sells into a market where English and French customers are equally common, so a translated afterthought would have quietly cost them half their audience.",
    approach:
      "Both languages are first class. Copy is lifted into a shared layer keyed by locale rather than duplicated per page, so the gallery, the testimonial carousel and the booking form all stay in step when either language changes.",
    outcome: "Delivered and running as the firm's production site.",
  },
  {
    slug: "resumeforge",
    title: "ResumeForge",
    kind: "Free tool",
    year: "2025",
    summary:
      "A resume builder with live preview and in-browser PDF export. No account, no upload.",
    stack: ["React", "Tailwind CSS", "React Router"],
    repo: "https://github.com/SamisDone/ResumeForge",
    live: "https://resumeforge-sam.netlify.app/",
    liveLabel: "Open the tool",
    shot: "/shots/resumeforge.jpg",
    shotAlt: "The ResumeForge landing page for a free browser-based resume builder.",
    problem:
      "Most free resume builders make you sign up before you can see what your resume will look like, then watermark the export.",
    approach:
      "Editing and preview render from the same state, so the page you are looking at is the page you get. Export runs entirely in the browser, which means no account, no upload, and no copy of your resume sitting on someone else's server.",
    outcome: "Deployed and free to use, with no sign-up in the way.",
  },
];

/** The rest of the shelf. A compact index, not a second grid of cards. */
export const otherWork: Project[] = [
  {
    slug: "stockmaster",
    title: "StockMaster",
    kind: "Inventory tracker",
    year: "2025",
    summary: "Real-time stock auditing on one centralized store, so every view agrees.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    repo: "https://github.com/SamisDone/StockMaster",
    problem:
      "Stock audits run from spreadsheets drift the moment two people count at once, and the disagreement surfaces weeks later when it is expensive to reconcile.",
    approach:
      "Counts live in one centralized store rather than in per-screen local state, and the UI is assembled from a small typed component set, which is what keeps a new audit screen cheap to add.",
    outcome: "Working application with the component library and state layer built out.",
  },
  {
    slug: "sortnplay",
    title: "SortnPlay",
    kind: "Algorithm visualizer",
    year: "2024",
    summary: "Merge, Quick and Bubble sort running on the same input, side by side.",
    stack: ["Vanilla JS"],
    repo: "https://github.com/SamisDone/Sorting-Algorithm-Simulator",
    live: "https://sortnplay.netlify.app/",
    liveLabel: "Open the visualizer",
    shot: "/shots/sortnplay.jpg",
    shotAlt: "The SortnPlay sorting visualizer with its controls and bar chart.",
    problem:
      "Sorting complexity is taught as a table of Big-O values, which gives you the answer without ever showing the behaviour behind it.",
    approach:
      "No framework and no animation library, so every comparison and swap is a deliberate DOM write on a timed loop. Running all three over the same input makes the difference in their access patterns the thing you actually watch.",
    outcome: "Deployed and used as a teaching aid.",
  },
  {
    slug: "roundrobin",
    title: "Adaptive Round Robin",
    kind: "OS scheduling simulator",
    year: "2025",
    summary: "A priority-aware scheduler where the quantum adapts instead of staying fixed.",
    stack: ["C++", "React"],
    repo: "https://github.com/SamisDone/Adaptive-Priority-Round-Robin",
    problem:
      "Round robin is easy to state and hard to feel. A fixed quantum punishes short jobs, and a table of numbers does not show you why.",
    approach:
      "Implemented the adaptive variant in C++, then drove a live process queue from the simulation so the starvation and turnaround trade-offs are visible while they happen.",
    outcome: "Runnable simulator pairing the scheduling core with a visual front end.",
  },
  {
    slug: "financetracker",
    title: "Finance Tracker",
    kind: "Financial auditing tool",
    year: "2024",
    summary: "Multi-user transactions on a normalized schema, with charted reporting.",
    stack: ["PostgreSQL", "Chart.js"],
    repo: "https://github.com/SamisDone/Finance-Tracker",
    problem:
      "A shared expense tracker goes wrong quickly if categories and accounts are stored as free text on every transaction row.",
    approach:
      "Users, accounts and categories are their own tables and a transaction references them, which is what makes per-user reporting a query rather than a cleanup job.",
    outcome: "Working tool with charted reporting over the normalized schema.",
  },
  {
    slug: "microops",
    title: "Microops",
    kind: "Hackathon build",
    year: "2025",
    summary: "A full-stack MVP taken end to end inside a 24 hour deadline.",
    stack: ["REST API", "React"],
    repo: "https://github.com/SamisDone/Microops-Hackathon",
    problem:
      "A 24 hour hackathon rewards scope control more than it rewards code. The failure mode is a beautiful half of a product.",
    approach:
      "Cut the feature set to the one path that had to work, then built the API and the client against it in parallel so integration was continuous instead of a panic in the last hour.",
    outcome: "Complete working MVP submitted inside the deadline.",
  },
];

export type Milestone = {
  year: string;
  kind: "Publication" | "Competition";
  title: string;
  venue: string;
  note: string;
  href?: string;
};

/** Academic output only. Employment is a separate section. */
export const research: Milestone[] = [
  {
    year: "2026",
    kind: "Publication",
    title: "ML and Explainable AI-Based Police Fraud Prediction",
    venue: "IEEE ICECTE 2026",
    note: "Peer reviewed. Uses SHAP so every prediction can be attributed back to the features that drove it.",
    href: "https://ieeexplore.ieee.org/document/11429440",
  },
  {
    year: "2026",
    kind: "Competition",
    title: "7th place, Telugu LLM prompt recovery",
    venue: "DravidianLangTech, ACL 2026 shared task",
    note: "Recovering the prompt behind a generated Telugu text, ranked against international teams.",
    href: "https://openreview.net/forum?id=ZnWQpLP5Mc",
  },
  {
    year: "2025",
    kind: "Competition",
    title: "Finalist, PoliMemeDecode Datathon",
    venue: "CUET CSE Fest",
    note: "Multimodal classification of political memes, combining the image and the text signal.",
  },
];

export type Role = {
  org: string;
  role: string;
  period: string;
  location: string;
  points: string[];
  href?: string;
};

export const experience: Role[] = [
  {
    org: "Fleet AI, Inc.",
    role: "Generalist, independent contractor",
    period: "May to August 2026",
    location: "Remote",
    points: [
      "Contract work for a US-based AI company, delivered remotely from Bangladesh.",
    ],
  },
  {
    org: "Freelance",
    role: "Web developer",
    period: "2025",
    location: "Contract",
    points: [
      "Built and shipped the production site for PIERRA, a Montreal exterior design firm, in English and French.",
      "Taken from brief to deployed site as my first paid engagement.",
    ],
  },
];

export const about = {
  paragraphs: [
    "I am a Computer Science and Engineering undergraduate at CUET, graduating in 2027. Two of the Chrome extensions I wrote are published and installable right now, and a site I built is in production for a design firm in Montreal.",
    "The other half of my time goes to research, on explainable AI and NLP. That work has produced a peer-reviewed paper at IEEE ICECTE and a 7th place finish at an ACL shared task.",
    "The thread between the two is that I like problems where the engineering and the reasoning both have to hold up. A model whose predictions you can defend. An extension that keeps a promise about your privacy. A schema that stays correct as it grows.",
  ],
  stack: [
    { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "C++", "SQL"] },
    { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Motion"] },
    { group: "Backend and data", items: ["Node.js", "PostgreSQL", "Firebase", "REST"] },
    { group: "ML and research", items: ["PyTorch", "scikit-learn", "SHAP", "Transformers"] },
  ],
};

export type CgpaPoint = { label: string; full: string; value: number };

export const cgpaHistory: CgpaPoint[] = [
  { label: "L1-T1", full: "Level 1, Term I", value: 3.45 },
  { label: "L1-T2", full: "Level 1, Term II", value: 3.44 },
  { label: "L2-T1", full: "Level 2, Term I", value: 3.43 },
  { label: "L2-T2", full: "Level 2, Term II", value: 3.33 },
  { label: "L3-T1", full: "Level 3, Term I", value: 3.58 },
  { label: "L3-T2", full: "Level 3, Term II", value: 3.85 },
];

export const trajectoryNote =
  "Level 2 was the low point. The climb after it is the part I would rather be judged on.";
