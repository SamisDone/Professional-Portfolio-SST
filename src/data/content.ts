// Central content store, sourced from Samonwita's CV — including the exact
// hyperlink targets extracted from the PDF's link annotations (not just the
// visible link text), so every project/social link below is real.

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
    art: "medihub",
  },
  {
    title: "RIPHours",
    category: "Chrome Extension · Published",
    description:
      "Privacy-first time tracker with auto-idle detection, hard-block site limits, and zero network requests.",
    tech: ["JavaScript", "Chrome APIs", "Storage Sync"],
    repo: "https://github.com/SamisDone/RIPHours",
    live: "https://chromewebstore.google.com/detail/riphours/iagjeekneaalapjnnofnifleaiondbbb",
    art: "riphours",
  },
  {
    title: "PIERRA",
    category: "Freelance Client Website",
    description:
      "Bilingual (EN/FR) site for a Montreal exterior design firm — gallery, testimonial carousel, booking form.",
    tech: ["Next.js", "Tailwind CSS"],
    repo: "https://github.com/SamisDone",
    live: "https://pierrafinal.vercel.app/",
    art: "pierra",
  },
  {
    title: "StockMaster",
    category: "Enterprise Inventory Tracker",
    description:
      "Real-time stock auditing app with a reusable component architecture and centralized state management.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    repo: "https://github.com/SamisDone/StockMaster",
    art: "stockmaster",
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
    art: "tabsaver",
  },
  {
    title: "ResumeForge",
    category: "Resume Builder",
    description: "Live-preview resume builder with client-side PDF export.",
    tech: ["React", "Tailwind CSS", "React Router"],
    repo: "https://github.com/SamisDone/ResumeForge",
    live: "https://resumeforge-sam.netlify.app/",
    art: "resumeforge",
  },
  {
    title: "Finance Tracker",
    category: "Financial Auditing Tool",
    description: "Normalized multi-user transaction schemas with Chart.js reporting.",
    tech: ["PostgreSQL", "Chart.js"],
    repo: "https://github.com/SamisDone/Finance-Tracker",
    art: "financetracker",
  },
  {
    title: "Adaptive Round Robin",
    category: "OS Scheduling Simulator",
    description: "Custom CPU scheduling simulator with a live-animated process queue.",
    tech: ["C++", "React"],
    repo: "https://github.com/SamisDone/Adaptive-Priority-Round-Robin",
    art: "roundrobin",
  },
  {
    title: "SortnPlay",
    category: "Algorithm Visualizer",
    description: "Real-time DOM animations for Merge, Quick, and Bubble sort.",
    tech: ["Vanilla JS"],
    repo: "https://github.com/SamisDone/Sorting-Algorithm-Simulator",
    live: "https://sortnplay.netlify.app/",
    art: "sortnplay",
  },
  {
    title: "Microops",
    category: "24-Hour Hackathon Build",
    description: "Full-stack MVP shipped end-to-end under a hard deadline.",
    tech: ["REST API", "React"],
    repo: "https://github.com/SamisDone/Microops-Hackathon",
    art: "microops",
  },
];

export type Milestone = {
  title: string;
  venue: string;
  type: string;
  date: string;
  href?: string;
};

export const milestones: Milestone[] = [
  {
    title: "7th Rank — DravidianLangTech, Telugu LLM Prompt Recovery",
    venue: "ACL 2026 Shared Task",
    type: "Competition",
    date: "Feb 2026",
    href: "https://openreview.net/forum?id=ZnWQpLP5Mc",
  },
  {
    title: "ML & Explainable AI-Based Police Fraud Prediction (SHAP)",
    venue: "IEEE ICECTE 2026",
    type: "Publication",
    date: "2026",
    href: "https://ieeexplore.ieee.org/document/11429440",
  },
  {
    title: "Generalist, Independent Contractor",
    venue: "Fleet AI, Inc. (Remote)",
    type: "Experience",
    date: "May – Aug 2026",
  },
  {
    title: "Finalist — PoliMemeDecode Datathon",
    venue: "CUET CSE FEST 2025",
    type: "Competition",
    date: "Dec 2025",
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
