// Central content store, sourced from Samonwita's CV — including the exact
// hyperlink targets extracted from the PDF's link annotations (not just the
// visible link text), so every project/social link below is real.

export const SITE_URL = "https://samonwita.vercel.app";

export const profile = {
  name: "Samonwita Sarker",
  initials: "SS",
  location: "Bangladesh",
  email: "sarker.samonwita@gmail.com",
  github: "https://github.com/SamisDone",
  githubHandle: "SamisDone",
  linkedin: "https://www.linkedin.com/in/samonwita-sarker-a87737262/",
  codeforces: "https://codeforces.com/profile/jinxed_sam",
  codeforcesHandle: "jinxed_sam",
  resumeUrl: "/Samonwita_Sarker_CV.pdf",
  roles: ["Developer", "Researcher", "Builder", "Debater"],
  eyebrow: "CSE '27 · CUET",
  description:
    "Full-stack developer building with React, Node.js, and PostgreSQL — with a research streak in explainable AI, NLP, and multimodal deep learning.",
};

// ---------------------------------------------------------------------------
// About — the section a recruiter reads after the hero, before the work.
// ---------------------------------------------------------------------------

export const about = {
  headline: "I build things that ship, and I write about why they work.",
  paragraphs: [
    "I'm a Computer Science and Engineering undergraduate at CUET, graduating in 2027. Two Chrome extensions I wrote are published and installable today, and a client site I built is in production for a design firm in Montreal.",
    "The other half of my time goes to research. I work on explainable AI and NLP — a SHAP-based fraud prediction model published at IEEE ICECTE 2026, and a 7th-place finish in the DravidianLangTech prompt-recovery shared task at ACL 2026.",
    "I like problems where the engineering and the reasoning both have to hold up: a model whose predictions you can defend, an extension that keeps a promise about your privacy, a schema that stays correct as it grows.",
  ],
  // Grouped so a reviewer can scan for a specific stack in about two seconds.
  skills: [
    {
      group: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "C++", "SQL"],
    },
    {
      group: "Frontend",
      items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "GSAP"],
    },
    {
      group: "Backend & Data",
      items: ["Node.js", "PostgreSQL", "Firebase", "REST APIs"],
    },
    {
      group: "ML & Research",
      items: ["PyTorch", "scikit-learn", "SHAP", "Transformers", "Pandas"],
    },
  ],
};

export type ProjectArt =
  | "medihub"
  | "riphours"
  | "pierra"
  | "stockmaster"
  | "tabsaver"
  | "resumeforge"
  | "financetracker"
  | "roundrobin"
  | "sortnplay"
  | "microops";

export type Project = {
  title: string;
  category: string;
  description: string;
  tech: string[];
  repo: string;
  live?: string;
  art: ProjectArt;
  /** Why the thing exists. One or two sentences, no jargon. */
  problem: string;
  /** The build. Named decisions a reviewer can ask a follow-up question about. */
  approach: string;
  /** What actually shipped, and where it can be seen. */
  outcome: string;
  /** Short label for the live link, so a Chrome Store listing isn't called "Live". */
  liveLabel?: string;
};

// Featured, bento-style grid — the 4 most substantial builds.
export const featuredProjects: Project[] = [
  {
    title: "MediHub",
    category: "AI Healthcare Platform",
    description:
      "Hospital management platform with Gemini-powered symptom triage and role-based access control.",
    tech: ["React", "Node.js", "Firebase", "Gemini API"],
    repo: "https://github.com/SamisDone/AI-Powered-Hospital-Management-System",
    live: "https://ai-powered-hospital-management-syst.vercel.app/",
    liveLabel: "Live demo",
    art: "medihub",
    problem:
      "Admins, doctors and patients all need the same hospital records, but each one should see a different slice of them. Front desks also spend a lot of time routing walk-in patients to the right department by hand.",
    approach:
      "Every session resolves through Firebase Auth to one of three roles, and the role decides both the route tree the user gets and the reads they are allowed to make. Symptom intake goes to the Gemini API behind a structured prompt that returns a ranked department suggestion, deliberately framed as routing rather than diagnosis.",
    outcome:
      "Deployed and publicly reachable, with the full role-separated flow working end to end.",
  },
  {
    title: "RIPHours",
    category: "Chrome Extension · Published",
    description:
      "Privacy-first time tracker with auto-idle detection, hard-block site limits, and zero network requests.",
    tech: ["JavaScript", "Chrome APIs", "Storage Sync"],
    repo: "https://github.com/SamisDone/RIPHours",
    live: "https://chromewebstore.google.com/detail/riphours/iagjeekneaalapjnnofnifleaiondbbb",
    liveLabel: "Chrome Web Store",
    art: "riphours",
    problem:
      "Browser time trackers ask you to hand over your full browsing history, usually to a server you have no visibility into. That is a steep price for a bar chart.",
    approach:
      "The extension makes no network requests at all. Timing state lives in chrome.storage.sync so it follows you across devices without a backend, the idle API stops the clock when you step away so the numbers stay honest, and per-site budgets are enforced as a hard block rather than a dismissible nudge.",
    outcome:
      "Published on the Chrome Web Store and installable today. The zero-request design is verifiable in the network panel.",
  },
  {
    title: "PIERRA",
    category: "Freelance Client Website",
    description:
      "Bilingual (EN/FR) site for a Montreal exterior design firm — gallery, testimonial carousel, booking form.",
    tech: ["Next.js", "Tailwind CSS"],
    repo: "https://github.com/SamisDone",
    live: "https://pierrafinal.vercel.app/",
    liveLabel: "Live site",
    art: "pierra",
    problem:
      "A Montreal exterior design firm sells into a market where English and French customers are equally common, so a translated afterthought would have cost them half their audience.",
    approach:
      "Both languages are first-class: copy is lifted into a shared content layer keyed by locale rather than duplicated per page, so the gallery, the testimonial carousel and the booking form all stay in sync when either language changes.",
    outcome:
      "Delivered and running as the firm's production site. My first paid client engagement.",
  },
  {
    title: "StockMaster",
    category: "Enterprise Inventory Tracker",
    description:
      "Real-time stock auditing app with a reusable component architecture and centralized state management.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    repo: "https://github.com/SamisDone/StockMaster",
    art: "stockmaster",
    problem:
      "Stock audits run from spreadsheets drift the moment two people count at once, and the disagreement usually surfaces weeks later when it is expensive to reconcile.",
    approach:
      "Counts are held in one centralized store rather than in per-screen local state, so every view reads the same number. The UI is assembled from a small typed component set, which is what keeps a new audit screen cheap to add instead of a copy-paste of the last one.",
    outcome:
      "Working application with the component library and state layer built out. Source is public.",
  },
];

// Secondary grid — remaining builds, shown in the parallax "More Projects" section.
export const moreProjects: Project[] = [
  {
    title: "TabSaver",
    category: "Chrome Extension · Published",
    description: "One-click session persistence and tab-group restoration.",
    tech: ["JavaScript", "Chrome APIs"],
    repo: "https://github.com/SamisDone/TabSaver-2.0",
    live: "https://chromewebstore.google.com/detail/tabsaver/emjeegpjecaljggipjdaofmlkoolikdk",
    liveLabel: "Chrome Web Store",
    art: "tabsaver",
    problem:
      "Closing a window full of research tabs means losing the shape of the work, not just the URLs. Bookmarking them flattens the grouping that made them useful.",
    approach:
      "Sessions are captured as a structured snapshot that preserves tab groups, not a flat URL list, so restoring puts the workspace back the way it was in a single click.",
    outcome: "Published on the Chrome Web Store.",
  },
  {
    title: "ResumeForge",
    category: "Resume Builder",
    description: "Live-preview resume builder with client-side PDF export.",
    tech: ["React", "Tailwind CSS", "React Router"],
    repo: "https://github.com/SamisDone/ResumeForge",
    live: "https://resumeforge-sam.netlify.app/",
    liveLabel: "Live site",
    art: "resumeforge",
    problem:
      "Most free resume builders make you sign up before you can see what your resume will look like, then watermark the export.",
    approach:
      "Editing and preview render from the same state, so the page you are looking at is the page you get. Export runs entirely in the browser, which means no account, no upload, and no copy of your resume on someone else's server.",
    outcome: "Deployed and free to use with no sign-up.",
  },
  {
    title: "Finance Tracker",
    category: "Financial Auditing Tool",
    description: "Normalized multi-user transaction schemas with Chart.js reporting.",
    tech: ["PostgreSQL", "Chart.js"],
    repo: "https://github.com/SamisDone/Finance-Tracker",
    art: "financetracker",
    problem:
      "A shared expense tracker gets wrong quickly if categories and accounts are stored as free text on each transaction row.",
    approach:
      "The schema is normalized so users, accounts and categories are their own tables and a transaction references them. That is what makes per-user reporting a query rather than a cleanup job.",
    outcome: "Working tool with charted reporting over the normalized schema.",
  },
  {
    title: "Adaptive Round Robin",
    category: "OS Scheduling Simulator",
    description: "Custom CPU scheduling simulator with a live-animated process queue.",
    tech: ["C++", "React"],
    repo: "https://github.com/SamisDone/Adaptive-Priority-Round-Robin",
    art: "roundrobin",
    problem:
      "Round-robin scheduling is easy to state and hard to feel. A fixed quantum punishes short jobs, and a table of numbers does not show you why.",
    approach:
      "Implemented a priority-aware variant where the quantum adapts instead of staying fixed, then drove a live-animated queue from the simulation so the starvation and turnaround trade-offs are visible while they happen.",
    outcome: "Runnable simulator pairing the C++ scheduling core with a visual front end.",
  },
  {
    title: "SortnPlay",
    category: "Algorithm Visualizer",
    description: "Real-time DOM animations for Merge, Quick, and Bubble sort.",
    tech: ["Vanilla JS"],
    repo: "https://github.com/SamisDone/Sorting-Algorithm-Simulator",
    live: "https://sortnplay.netlify.app/",
    liveLabel: "Live site",
    art: "sortnplay",
    problem:
      "Sorting complexity is taught as a table of Big-O values, which tells you the answer without ever showing you the behaviour behind it.",
    approach:
      "Built with no framework and no animation library, so each comparison and swap is a deliberate DOM write on a timed loop. Merge, Quick and Bubble run over the same input, which makes the difference in their access patterns the thing you actually watch.",
    outcome: "Deployed and used as a teaching aid.",
  },
  {
    title: "Microops",
    category: "24-Hour Hackathon Build",
    description: "Full-stack MVP shipped end-to-end under a hard deadline.",
    tech: ["REST API", "React"],
    repo: "https://github.com/SamisDone/Microops-Hackathon",
    art: "microops",
    problem:
      "A 24-hour hackathon rewards scope control more than it rewards code. The failure mode is a beautiful half of a product.",
    approach:
      "Cut the feature set to one path that had to work, then built the API and the client against it in parallel so integration was continuous instead of a panic in the last hour.",
    outcome: "Complete working MVP submitted inside the deadline.",
  },
];

export type Milestone = {
  title: string;
  venue: string;
  type: string;
  date: string;
  href?: string;
  /** One line of context, so the row means something to a non-specialist. */
  note?: string;
};

export const milestones: Milestone[] = [
  {
    title: "7th Rank — DravidianLangTech, Telugu LLM Prompt Recovery",
    venue: "ACL 2026 Shared Task",
    type: "Competition",
    date: "Feb 2026",
    href: "https://openreview.net/forum?id=ZnWQpLP5Mc",
    note: "Recovering the prompt behind a generated Telugu text, ranked against international teams.",
  },
  {
    title: "ML & Explainable AI-Based Police Fraud Prediction (SHAP)",
    venue: "IEEE ICECTE 2026",
    type: "Publication",
    date: "2026",
    href: "https://ieeexplore.ieee.org/document/11429440",
    note: "Peer-reviewed. Uses SHAP so each prediction can be attributed to specific features.",
  },
  {
    title: "Generalist, Independent Contractor",
    venue: "Fleet AI, Inc. (Remote)",
    type: "Experience",
    date: "May – Aug 2026",
    note: "Remote contract work for a US-based AI company.",
  },
  {
    title: "Finalist — PoliMemeDecode Datathon",
    venue: "CUET CSE FEST 2025",
    type: "Competition",
    date: "Dec 2025",
    note: "Multimodal classification of political memes, combining image and text signals.",
  },
];

export const stats = [
  { value: "3.85", label: "CGPA at CUET" },
  { value: "10+", label: "Projects Shipped" },
  { value: "300+", label: "Problems Solved" },
];

export type CgpaPoint = {
  label: string;
  full: string;
  value: number;
};

export const cgpaHistory: CgpaPoint[] = [
  { label: "L1-T1", full: "Level 1 – Term I", value: 3.45 },
  { label: "L1-T2", full: "Level 1 – Term II", value: 3.44 },
  { label: "L2-T1", full: "Level 2 – Term I", value: 3.43 },
  { label: "L2-T2", full: "Level 2 – Term II", value: 3.33 },
  { label: "L3-T1", full: "Level 3 – Term I", value: 3.58 },
  { label: "L3-T2", full: "Level 3 – Term II", value: 3.85 },
];
