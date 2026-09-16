// Every string a visitor reads lives here. Links were taken from the link
// annotations inside the CV PDF, not from the visible link text, so each one
// resolves to the real destination.

export const profile = {
  name: "Samonwita Sarker",
  initials: "SS",
  location: "Chattogram, Bangladesh",
  email: "sarker.samonwita@gmail.com",
  github: "https://github.com/SamisDone",
  /**
   * The repositories tab, not the profile. "All repositories" in the work
   * index promises a list, and the profile page opens on pinned repos and a
   * contribution graph instead. The plain profile URL stays above, because
   * that is the right destination for an identity link in the footer, the
   * contact list and the structured data.
   */
  githubRepos: "https://github.com/SamisDone?tab=repositories",
  githubHandle: "SamisDone",
  linkedin: "https://www.linkedin.com/in/samonwita-sarker-a87737262/",
  codeforces: "https://codeforces.com/profile/jinxed_sam",
  codeforcesHandle: "jinxed_sam",
  resumeUrl: "/Samonwita_Sarker_CV.pdf",
  standfirst: "CSE '27, CUET",
  /**
   * "Open to internships and research" told a recruiter nothing they could act
   * on. What kind of role, and whether the candidate can work where they are,
   * is the part that decides whether the tab stays open.
   */
  status: "Software and ML research internships",
  // Hero subtext. Kept under 20 words so the hero always fits one viewport.
  positioning:
    "I build software that ships, and I research how to make a model's predictions explainable.",
};

/**
 * The strip directly under the hero. Four claims, each with the receipt
 * attached. Nothing here is a round marketing number.
 */
export type Proof = {
  value: string;
  label: string;
  href?: string;
  /** Routes through the router rather than opening a new tab. */
  internal?: boolean;
};


export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  /** One line. What it is, in plain language. */
  summary: string;
  stack: string[];
  /**
   * Who I was on it. Set on every project, in the CV's words where the CV
   * states it and from the owner otherwise: a portfolio that implies solo work
   * on a team project is the one mistake here worth avoiding. On a repository
   * that is not hers, this is what the card and the repositories table show
   * beside the owner's name.
   */
  role?: string;
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
  /**
   * For work with no screenshot to take. Real measured figures, or the
   * capabilities the project actually has, shown in place of the frame. Never
   * a mocked-up interface standing in for a real one.
   */
  figures?: { value: string; label: string }[];
  highlights?: string[];
  problem: string;
  approach: string;
  outcome: string;
};

/**
 * The ten that carry the most weight, every one with a real screenshot.
 *
 * The order is deliberate. Paid client work sits second, above anything built
 * for its own sake, the strongest build third, and MediHub stays fourth.
 * KanDesk is not on the rail while its deployment is down; it goes back when
 * there is something running to open.
 */
export const featured: Project[] = [
  {
    slug: "greenlight",
    title: "Greenlight",
    kind: "Hackathon build",
    year: "2026",
    summary:
      "A robot arm you drive in the browser, six different ways, through one motion pipeline.",
    stack: ["Next.js", "Three.js", "TypeScript", "Zustand", "Gemini API"],
    role: "Team build",
    repo: "https://github.com/SamisDone/GreenLight-IUT-Techathon-Hackathon",
    live: "https://greenlight-ptsd.vercel.app/",
    liveLabel: "Open the simulator",
    shot: "/shots/greenlight.jpg",
    shotAlt:
      "The Greenlight control suite: a 3D robot arm with jog control, voice input and joint readouts.",
    problem:
      "Vantage Robotics tests every software change on a real arm, which is slow, risky and expensive. A motion change should be provable before hardware is involved at all.",
    approach:
      "Six input methods, joystick, keyboard, voice keyword, voice agent, autonomous PIN entry and agentic natural language, all resolve to the same MotionCommand and run through one pipeline: an inverse-kinematics planner, a safety gate that validates the move, then an executor that animates it. One pipeline triggered six ways rather than six features bolted together, which is what stops any path from skipping the gate.",
    outcome:
      "Built for the IUT Techathon and deployed, drivable in a browser with no hardware in the loop, alongside a Wokwi hardware simulation.",
  },
  {
    slug: "pierra",
    title: "PIERRA",
    kind: "Client work",
    year: "2025",
    summary:
      "A bilingual site for a Montreal exterior design firm. My first paid engagement.",
    stack: ["Next.js", "Tailwind CSS"],
    role: "Frontend developer, freelance",
    repo: "https://github.com/SamisDone/Pierra",
    live: "https://pierrafinal.vercel.app/",
    liveLabel: "Open the site",
    shot: "/shots/pierra.jpg",
    shotAlt: "The PIERRA homepage for a Montreal exterior design firm.",
    problem:
      "The firm sells into a market where English and French customers are equally common, so a translated afterthought would have quietly cost them half their audience.",
    approach:
      "Both languages are first class. Copy is lifted into a shared layer keyed by locale rather than duplicated per page, so the gallery, the testimonial carousel and the booking form all stay in step when either language changes.",
    outcome:
      "Delivered end to end in both languages, from brief to deployed site. My first paid engagement.",
  },
  {
    /**
     * Another repository that is not on her account, and the one where the
     * label matters most: the commit history names two other people and not
     * her, and the README credits its author. `role` says contributor and
     * nothing stronger until she says what it should be.
     */
    slug: "kilnwatch",
    title: "KilnWatch",
    kind: "Earth observation",
    year: "2026",
    summary:
      "Finds brick kilns across Bangladesh in satellite imagery, then screens each for the rules it looks to be breaking.",
    stack: ["Next.js", "YOLO11-OBB", "TFLite", "MapLibre", "Sentinel-2"],
    role: "Contributor",
    repo: "https://github.com/PratikDev/illegal-brick-kiln-detector",
    live: "https://sciblitz-ptsd-ibkd.vercel.app",
    liveLabel: "Open the scanner",
    shot: "/shots/kilnwatch.jpg",
    shotAlt:
      "KilnWatch over Sentinel-2 imagery of Bangladesh, with detection counts and a national replay feed.",
    problem:
      "Illegal brick kilns are a serious air quality problem in Bangladesh and the enforcement bottleneck is not the law, it is knowing where they are. Finding them by inspection means driving to them.",
    approach:
      "Detection and legality are deliberately kept apart. Computer vision finds the kiln, an ensemble of a rotated-box YOLO11, an RT-DETR validator and a ViT context reviewer, working on 128px Sentinel-2 tiles at roughly 10m resolution. A separate rule engine then screens each detection against the measurable parts of the Brick Kilns Act 2013, on location, technology and land use. What needs a human or a government record to confirm is marked as needing one rather than asserted.",
    outcome:
      "Deployed and openable, with 50 georeferenced signals across five priority districts, real TFLite inference behind a Live AI mode, and an A4 evidence brief generated in the browser.",
  },
  {
    slug: "medihub",
    title: "MediHub",
    kind: "AI healthcare platform",
    year: "2026",
    summary:
      "Hospital management with Gemini-backed symptom routing and three separate roles.",
    stack: ["React", "Node.js", "Firebase", "Gemini API"],
    role: "Full-stack developer",
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
    role: "Solo developer",
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
    /**
     * The repo is Huntrix_friction, after the team; the product is Unread, and
     * the product is what the card names.
     */
    slug: "unread",
    title: "Unread",
    kind: "Hackathon build",
    year: "2026",
    summary:
      "A reader that will not let you move on until you have shown you understood the last part.",
    stack: ["TanStack Start", "React", "TypeScript", "Claude API"],
    role: "Team build",
    repo: "https://github.com/Seyamalam/Huntrix_friction",
    live: "https://huntrix-friction.vercel.app/",
    liveLabel: "Try the friction",
    shot: "/shots/huntrix.jpg",
    shotAlt:
      "The Unread landing page: AI should stop you from pretending you read.",
    problem:
      "The hackathon theme was friction, where the obvious move is to remove it. Summaries have made it trivial to finish an article without reading it, and nothing in the tooling can tell having read something apart from having skimmed a summary of it.",
    approach:
      "An article becomes a locked reading room. One section opens, and the next stays shut until the reader puts the claim in their own words at a checkpoint, with the model pushing back on a vague answer rather than giving the point away. The completion report is built from what the reader proved, not from what the article said. Friction is the product here rather than a feature bolted onto one, which is the whole argument.",
    outcome:
      "Deployed and open to try, with a public reading room and author-side analytics on top of the checkpoints.",
  },
  {
    /**
     * The repository is not on her account: this is someone else's project
     * that she worked on, which is exactly why `role` is set. A card that
     * links to another person's repo and says nothing about authorship is the
     * reading to avoid.
     */
    slug: "narrativeguard",
    title: "Narrative Guard",
    kind: "AI governance tool",
    year: "2026",
    summary:
      "Audits a draft against a team's own brand rules before it goes out, and says where it breaks them.",
    stack: ["Next.js", "TypeScript", "Convex", "RAG", "Gemini API"],
    role: "Contributor",
    repo: "https://github.com/PratikDev/narrative-guard",
    live: "https://narrative-guard.vercel.app/",
    liveLabel: "Open the app",
    shot: "/shots/narrativeguard.jpg",
    shotAlt:
      "The Narrative Guard landing page, showing its audit dashboard with scored reports.",
    problem:
      "Brand guidelines are a document nobody rereads. By the time a post, an email or a press release is off-message it has usually already been approved by someone going from memory.",
    approach:
      "A team writes its brand constitution once and it is indexed into a RAG namespace, so an audit is scored against the rules that were actually retrieved rather than against whatever the model believes about the brand. The model writes the report and the findings; the score itself is computed in the backend, which is what stops two runs over the same draft from disagreeing. Workspaces carry owner, admin and member roles, and a finished report exports as a PDF.",
    outcome:
      "Deployed and usable, covering social posts, emails, ads, press releases and website copy, with trend analytics across saved reports.",
  },
  {
    slug: "tabsaver",
    title: "TabSaver",
    kind: "Chrome extension",
    year: "2025",
    summary:
      "Restores a whole working session, tab groups intact, in one click.",
    stack: ["JavaScript", "Chrome APIs"],
    role: "Solo developer",
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
    slug: "resumeforge",
    title: "ResumeForge",
    kind: "Free tool",
    year: "2025",
    summary:
      "A resume builder with live preview and in-browser PDF export. No account, no upload.",
    stack: ["React", "Tailwind CSS", "React Router"],
    role: "Solo developer",
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
  {
    slug: "stockmaster",
    title: "StockMaster",
    kind: "Inventory tracker",
    year: "2025",
    summary: "Real-time stock auditing on one centralized store, so every view agrees.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    role: "Full-stack developer",
    repo: "https://github.com/SamisDone/StockMaster",
    shot: "/shots/stockmaster.jpg",
    shotAlt: "The StockMaster landing page for its inventory management system.",
    problem:
      "Stock audits run from spreadsheets drift the moment two people count at once, and the disagreement surfaces weeks later when it is expensive to reconcile.",
    approach:
      "Counts live in one centralized store rather than in per-screen local state, and the UI is assembled from a small typed component set, which is what keeps a new audit screen cheap to add.",
    outcome: "Working application with the component library and state layer built out.",
  },
];

/** The rest of the shelf. A compact index, not a second grid of cards. */
export const otherWork: Project[] = [
  {
    slug: "kandesk",
    title: "KanDesk",
    kind: "Task manager",
    year: "2026",
    summary: "A Kanban board with full CRUD, priorities, filtering and protected routes.",
    stack: ["React", "Tailwind CSS", "TanStack Router"],
    role: "Solo developer",
    repo: "https://github.com/SamisDone/KanDesk-A-full-featured-Kanban-task-manager",
    shot: "/shots/kandesk.jpg",
    shotAlt: "The KanDesk landing page above its three-column board.",
    problem:
      "Most Kanban demos stop at dragging a card between three columns and skip everything that makes one usable past the first day.",
    approach:
      "Three columns with counts, create, edit and delete with confirmation, colour-coded priority that can be filtered across every column at once, and routing that keeps the board behind an auth check.",
    outcome: "Working board with the full task lifecycle and protected routing in place.",
  },
  {
    slug: "anomlite",
    title: "AnomLite",
    kind: "Deep learning research",
    year: "2026",
    summary:
      "A hybrid model for multiclass crime detection in surveillance video, small enough to run on constrained hardware.",
    stack: ["PyTorch", "MobileNetV2", "LSTM"],
    role: "Solo developer",
    repo: "https://github.com/SamisDone/Violence-Detection",
    problem:
      "Anomaly detection on surveillance footage usually means a model too heavy to run anywhere near the camera, so the video has to travel to the compute instead.",
    approach:
      "MobileNetV2 handles the spatial features and an LSTM handles the temporal ones, which keeps the whole network to roughly 11 million parameters. Trained on the UCF-Crime dataset across 14 classes, from abuse and arson through to normal video.",
    outcome:
      "79 percent accuracy, 0.97 ROC AUC and a 0.75 macro F1, at a size that suits real-time deployment on constrained devices.",
  },
  {
    slug: "finpulse",
    title: "FinPulse",
    kind: "Personal finance app",
    year: "2026",
    summary:
      "Income, expenses, budgets and savings goals, with the security work actually done.",
    stack: ["PHP 8", "PDO", "MySQL", "Chart.js"],
    role: "Solo developer",
    repo: "https://github.com/SamisDone/FinPulse",
    highlights: [
      "Parameterised queries throughout, via PDO",
      "CSRF tokens on every form",
      "Rate-limited login",
      "Budgets, goals and charted reports",
    ],
    problem:
      "A finance app holds the most sensitive data a small project will ever touch, and student projects routinely ship one with the auth left as an afterthought.",
    approach:
      "Built on PHP 8 with PDO throughout, so queries are parameterised by default. Login is rate limited and forms carry CSRF tokens. On top of that sit income and expense tracking with recurring entries and receipts, category budgets, savings goals, and charted monthly reports.",
    outcome:
      "Complete application covering tracking, budgeting, goals and reporting.",
  },
  {
    slug: "sortnplay",
    title: "SortnPlay",
    kind: "Algorithm visualizer",
    year: "2024",
    summary: "Merge, Quick and Bubble sort running on the same input, side by side.",
    stack: ["Vanilla JS"],
    role: "Solo developer",
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
    slug: "pixelart",
    title: "Pixel Art Pad",
    kind: "Drawing tool",
    year: "2026",
    summary: "A pixel grid with pen, eraser and flood fill, exporting straight to an image.",
    stack: ["JavaScript", "Canvas"],
    role: "Solo developer",
    repo: "https://github.com/SamisDone/Pixel-Art-App",
    live: "https://pixelartweb.netlify.app/",
    liveLabel: "Open the pad",
    shot: "/shots/pixelart.jpg",
    shotAlt: "The Pixel Art Pad, a drawing grid with a colour palette and tools.",
    problem:
      "Drawing pixel art in a general image editor means fighting antialiasing and a canvas that does not think in cells.",
    approach:
      "No framework and no libraries. The grid is the data structure, the tools write into it directly, and flood fill walks neighbours from the clicked cell. Grid size switches between 16, 24, 32 and 48 squares, and export writes the grid out as an image.",
    outcome: "Deployed, with pen, eraser, fill, four grid sizes and image export.",
  },
  {
    slug: "hangman",
    title: "Hangman",
    kind: "Browser game",
    year: "2026",
    summary:
      "Hangman on a programming word list, with the figure drawn a stroke at a time.",
    stack: ["JavaScript", "Local storage"],
    role: "Solo developer",
    repo: "https://github.com/SamisDone/HangMan",
    live: "https://hangman-sam.netlify.app/",
    liveLabel: "Play it",
    shot: "/shots/hangman.jpg",
    shotAlt: "The Hangman game board with its letter keyboard and score.",
    problem:
      "A guessing game gives away nothing about how close you are to losing unless the state is visible at a glance.",
    approach:
      "The figure is drawn one stroke per wrong guess, so the remaining margin is the picture rather than a counter. Guesses come from the on-screen keyboard or the physical one, there is a hint for when a word stalls, and the running record persists in local storage.",
    outcome: "Deployed and playable, on a programming and technology word list.",
  },
  {
    slug: "glitch",
    title: "Glitch Breach",
    kind: "Browser game",
    year: "2026",
    summary:
      "A cyberpunk typing game: fix corrupted terminal commands before the clock runs out.",
    stack: ["JavaScript", "Local storage"],
    role: "Solo developer",
    repo: "https://github.com/SamisDone/GLITCH-BREACH",
    live: "https://glitch-breach-sam.netlify.app/",
    liveLabel: "Play it",
    shot: "/shots/glitch.jpg",
    shotAlt: "The Glitch Breach game screen, a green-on-black terminal interface.",
    problem:
      "Typing games mostly test speed on ordinary prose. Almost none of them make you read what you are typing closely enough to spot what is wrong with it.",
    approach:
      "Sixty-odd corrupted shell commands, and the player has to type the corrected version before the timer runs out. Three difficulty levels change the clock rather than the words, a combo multiplier rewards streaks, and answering faster scores higher, so speed and accuracy are both worth something.",
    outcome: "Deployed and playable, with a leaderboard and three lives per run.",
  },
  {
    slug: "task-scheduling",
    title: "Task Scheduling with ML, DL and DRL",
    kind: "Research comparison",
    year: "2026",
    summary:
      "Traditional CPU schedulers benchmarked against learned ones on the same simulated workload.",
    stack: ["Python", "PyTorch", "Jupyter"],
    role: "Solo developer",
    repo: "https://github.com/SamisDone/Task-Scheduling-using-Traditional-ML-DL-DRL",
    problem:
      "Learned schedulers are usually reported against their own baselines, which makes it hard to tell whether they beat first-come-first-served by a margin worth the complexity.",
    approach:
      "A simulated multi-tasking environment runs FCFS, shortest job first and shortest remaining time first alongside machine learning, deep learning and deep reinforcement learning approaches, all measured on the same average waiting time and turnaround time.",
    outcome: "A like-for-like comparison across every paradigm on one workload.",
  },
  {
    slug: "page-replacement",
    title: "Page Replacement Algorithms",
    kind: "OS algorithms",
    year: "2025",
    summary: "FIFO, LRU and optimal replacement implemented and compared in C++.",
    stack: ["C++"],
    role: "Solo developer",
    repo: "https://github.com/SamisDone/Page-Replacement-Algorithms",
    problem:
      "Page replacement is taught as three rules and a hit-rate table, which hides how differently the policies behave on the same reference string.",
    approach:
      "Each policy implemented from scratch in C++ and run over shared reference strings so the fault counts can be compared directly.",
    outcome: "Runnable comparison of the standard replacement policies.",
  },
  {
    slug: "roundrobin",
    title: "Adaptive Round Robin",
    kind: "OS scheduling simulator",
    year: "2025",
    summary: "A priority-aware scheduler where the quantum adapts instead of staying fixed.",
    stack: ["C++", "React"],
    role: "Systems programmer",
    repo: "https://github.com/SamisDone/Adaptive-Priority-Round-Robin",
    problem:
      "Round robin is easy to state and hard to feel. A fixed quantum punishes short jobs, and a table of numbers does not show you why.",
    approach:
      "Implemented the adaptive variant in C++, then drove a live process queue from the simulation so the starvation and turnaround trade-offs are visible while they happen.",
    outcome: "Runnable simulator pairing the scheduling core with a visual front end.",
  },
  {
    slug: "microops",
    title: "Microops",
    kind: "Hackathon build",
    year: "2025",
    summary: "A full-stack MVP taken end to end inside a 24 hour deadline.",
    stack: ["REST API", "React"],
    role: "Team build",
    repo: "https://github.com/SamisDone/Microops-Hackathon",
    problem:
      "A 24 hour hackathon rewards scope control more than it rewards code. The failure mode is a beautiful half of a product.",
    approach:
      "Cut the feature set to the one path that had to work, then built the API and the client against it in parallel so integration was continuous instead of a panic in the last hour.",
    outcome: "Complete working MVP submitted inside the deadline.",
  },
  {
    slug: "ems",
    title: "Energy Monitoring System",
    kind: "Real-time dashboard",
    year: "2026",
    summary:
      "An office power dashboard and a Discord bot reading the same live backend.",
    stack: ["React", "TypeScript", "Discord API"],
    role: "Contributor",
    repo: "https://github.com/PratikDev/energy-monitoring-system",
    problem:
      "Office power gets audited from a meter reading at the end of the month, which gives you the total and nothing about which light was left on over a weekend.",
    approach:
      "Every light and fan reports into one real-time backend and two clients read it: a dashboard in the browser and a bot in Discord. An alert reaches whoever is already in Discord rather than waiting for someone to think to open a tab.",
    outcome:
      "Dashboard, bot and alerting built against one shared real-time backend. The hosted demo is offline at the moment, so the repo is the thing to read.",
  },
  {
    slug: "rentease",
    title: "RentEase",
    kind: "Property management system",
    year: "2026",
    summary:
      "Properties, units, leases, payments and utilities, with landlords and tenants seeing different halves of it.",
    stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL"],
    role: "Contributor",
    repo: "https://github.com/maha-shweta/Rent_Ease",
    problem:
      "A landlord and a tenant need the same lease, the same payment record and the same utility bill, and almost none of the same controls over any of them.",
    approach:
      "One schema over properties, units, leases, payments, utilities and announcements, with two portals on top of it. A unit's availability follows from its lease rather than being a field someone remembers to update, which is the kind of thing that goes wrong first in a rental system.",
    outcome:
      "Full-stack system with both portals working over a Postgres schema.",
  },
  {
    slug: "debate-marksheet",
    title: "Debate Marksheet",
    kind: "Tournament tool",
    year: "2025",
    summary:
      "A Bangla scoresheet for parliamentary debate that totals the round and exports it as a PDF.",
    stack: ["HTML", "JavaScript", "html2pdf"],
    role: "Solo developer",
    repo: "https://github.com/SamisDone/Debate-Marksheet-Bangla",
    problem:
      "Inter-departmental rounds are scored on paper, and the adjudicator adds the columns by hand between speeches while the next speaker is already standing up.",
    approach:
      "One self-contained HTML file, in Bangla, laid out the way the format actually runs: government and opposition, prime minister through whip, the rebuttal round, with totals computed as marks are entered. It exports the finished sheet to PDF, so the record survives the evening without anyone photographing a piece of paper.",
    outcome:
      "Used for inter-departmental rounds. One file, no build step, no install, which is what makes it usable by whoever is adjudicating.",
  },
  {
    slug: "ssis-ssrs",
    title: "ETL and Reporting Pipeline",
    kind: "Data engineering",
    year: "2026",
    summary:
      "An SSIS package that moves and cleans the data, and an SSRS report that reads the result.",
    stack: ["SSIS", "SSRS", "SQL Server"],
    role: "Solo developer",
    repo: "https://github.com/SamisDone/SSIS-SSRS-ETL-Reporting",
    problem:
      "Reporting built straight on top of an operational database is reporting that breaks whenever the operational schema moves, and that competes with the application for the same rows.",
    approach:
      "The extract, transform and load runs as an Integration Services package, so the shaping happens once on a schedule rather than inside every query. The Reporting Services report reads what the package produced, which keeps the report's definition of a figure in one place instead of in each person's spreadsheet.",
    outcome:
      "Working package and report, built against SQL Server.",
  },
];

export type Milestone = {
  year: string;
  kind: "Publication";
  title: string;
  venue: string;
  note: string;
  href?: string;
  /**
   * The full author list in publication order, spelled the way the venue
   * spells it, with `selfIndex` saying which one is me.
   *
   * Printed rather than summarised, because the position is the information.
   * Fourth of six and first of five are different contributions, and a reader
   * given neither assumes the weaker one.
   */
  authors?: string[];
  selfIndex?: number;
  /**
   * The repository the paper points at. The ACL abstract names it, so a reader
   * who wants to reproduce the result should not have to go looking for it.
   */
  code?: string;
};

/** Academic output only. Employment is a separate section. */
export const research: Milestone[] = [
  {
    year: "2026",
    kind: "Publication",
    title:
      "A Machine Learning and Explainable AI-Based Multiclass Police Fraud Prediction Scheme with SHAP Based Interpretability",
    venue: "ICECTE 2026, IEEE",
    authors: [
      "M. Chowdhury",
      "J. Islam",
      "Md. A. I. Semon",
      "S. Sarker",
      "M. M. Barua",
      "A. Akter",
    ],
    selfIndex: 3,
    note: "Peer reviewed. SHAP attribution on every prediction, so a flagged case traces back to the features that drove it.",
    href: "https://ieeexplore.ieee.org/document/11429440",
  },
  {
    /**
     * This was filed as a competition placing and nothing else, which sold it
     * short: the system paper is published, peer reviewed, and first author.
     *
     * The link used to go to OpenReview, which stops a visitor at a browser
     * check before showing them anything. The Anthology page is the version of
     * record and carries the DOI.
     */
    year: "2026",
    kind: "Publication",
    title:
      "Still Loading@DravidianLangTech 2026: Telugu Prompt-Style Recovery using Multilingual Transformers",
    venue: "Proceedings of DravidianLangTech, ACL 2026",
    authors: [
      "Samonwita Sarker",
      "Isnat Mehrin Sami",
      "Priyontee Mojumder",
      "Arpita Mallik",
      "Hasan Murad",
    ],
    selfIndex: 0,
    code: "https://github.com/Priyontee1713/Still-Loading-Prompt-Recovery-for-LLM-in-Telugu",
    note: "First author. Sorting Telugu transcripts into nine communicative styles, comparing four multilingual transformers under focal loss. The MuRIL system placed 7th at 0.1703 macro F1, where chance sits near 0.11.",
    href: "https://aclanthology.org/2026.dravidianlangtech-1.58/",
  },
];

/**
 * What is being worked on now, which a ledger of finished output cannot show.
 * One entry, because there is one.
 */
export const currentResearch = {
  kind: "Undergraduate thesis, in progress",
  title: "Grapheme-aware Bangla and English scene text recognition",
  note: "Reading text off photographs where Bangla and Latin script share a frame. Bangla graphemes are composed rather than laid out one character after the next, so a recogniser that treats a word as a flat sequence gives up the conjuncts.",
};

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
      "Wrote evaluation tasks for agentic AI: long multi-step workflows inside simulated enterprise software, each grounded in data that genuinely exists in that environment.",
      "Reviewed other contributors' tasks before they shipped, checking each was solvable, unambiguous, not a repeat, and correct at the edges where an agent goes wrong.",
    ],
  },
  {
    org: "Freelance",
    role: "Web developer",
    period: "2025",
    location: "Contract",
    points: [
      "Built and shipped the site for PIERRA, a Montreal exterior design firm, in English and French.",
      "An interactive project gallery, a testimonial carousel and a consultation request form, with the copy in one locale-keyed layer so the two languages cannot drift apart.",
    ],
  },
];

export const about = {
  paragraphs: [
    "I am a Computer Science and Engineering undergraduate at CUET, graduating in 2027. Two of the Chrome extensions I wrote are published and installable right now, and I built and shipped a bilingual site for a design firm in Montreal.",
    "The other half of my time goes to research, on explainable AI and NLP. Two papers so far, one peer reviewed at IEEE ICECTE and one first-author system paper at an ACL workshop, and a thesis in progress on reading Bangla off photographs.",
    "The thread between the two is that I like problems where the engineering and the reasoning both have to hold up. A model whose predictions you can defend. An extension that keeps a promise about your privacy. A schema that stays correct as it grows.",
  ],
  stack: [
    { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "C++", "SQL"] },
    { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Motion"] },
    { group: "Backend and data", items: ["Node.js", "PostgreSQL", "Firebase", "REST"] },
    { group: "ML and research", items: ["PyTorch", "scikit-learn", "SHAP", "Transformers"] },
  ],
};

/**
 * Off the CV, and on the site for the first time. A portfolio that never says
 * where someone studies sends a recruiter looking for it, and the only copy
 * was a PDF download away.
 */
export const education = [
  {
    school: "Chittagong University of Engineering and Technology",
    award: "B.Sc. in Computer Science and Engineering",
    period: "2023 to 2027",
    note: "Six terms sat, two to go.",
  },
  {
    school: "Viqarunnisa Noon College",
    award: "Higher Secondary Certificate",
    period: "2021",
    note: "GPA 5.00 of 5.00.",
  },
];

export const leadership = [
  {
    org: "CUET Computer Club",
    role: "Vice President (Organizing)",
    period: "Current",
    note: "Runs the organizing side of the club: its workshops, bootcamps and intra-university events. Competes in inter-university programming contests.",
  },
  {
    org: "IEEE Computer Society, CUET Student Branch Chapter",
    role: "General Secretary, Development Wing",
    period: "Current",
    note: "Secretary of the chapter's development wing.",
  },
  {
    org: "CUET Debating Society",
    role: "Joint General Secretary",
    period: "Current",
    note: "Helps run the society and its inter-departmental tournaments, and competes in inter-university parliamentary debate.",
  },
  {
    org: "CUET MUN Club",
    role: "Joint Organizing Secretary",
    period: "2023 to present",
    note: "Organisational logistics for national conferences, and a delegate on committees covering international technology governance.",
  },
];

/**
 * Placings, kept apart from the research ledger. A datathon finish is a result,
 * not a publication, and filing it under "Published work" made the ledger claim
 * something it was not. The ACL shared task appears here as a placing and on
 * the research page as the paper, because it is genuinely both.
 */
export const competitions = [
  {
    result: "7th place",
    event: "DravidianLangTech shared task, ACL 2026",
    period: "2026",
    note: "Telugu prompt-style recovery, against international teams. The system paper is on the research page.",
  },
  {
    /* Certificate of achievement, IEEE CUET Student Branch with SheSTEM. The
       certificate names no placing; the finalist result is from the owner,
       as are the three below it that were "Participant" until she
       corrected them. */
    result: "Finalist",
    event: "AI Hackathon, SciBlitz 2.0",
    period: "2026",
    note: "Organised by the IEEE CUET Student Branch with SheSTEM. Certificate of achievement for the AI hackathon.",
  },
  {
    result: "Finalist",
    event: "IUT Techathon",
    period: "2026",
    note: "Built Greenlight, a robot arm driven from the browser six ways through one motion pipeline. It is on the work page.",
  },
  {
    result: "Finalist",
    event: "The Infinity AI BuildFest 2026",
    period: "2026",
    note: "AI build competition.",
  },
  {
    result: "Finalist",
    event: "PoliMemeDecode Datathon, CUET CSE Fest",
    period: "2025",
    note: "Political meme classification over image and text together: DenseNet-121 and BanglaBERT with EasyOCR, at 0.9008 macro F1.",
  },
  {
    result: "Finalist",
    event: "MicroOps Hackathon",
    period: "2025",
    note: "24-hour hackathon. A full-stack MVP, API and client, submitted inside the deadline.",
  },
];

/**
 * The CV links these from page three and the site did not link them anywhere.
 * The names are the CV's own; the folder is the one the CV points at, checked
 * to open without signing in.
 */
export const certifications = {
  href: "https://drive.google.com/drive/folders/1ybnT2oynox40j0Shpx_cueBbHoDCKC4j?usp=sharing",
  items: [
    "Full-Stack Development, freeCodeCamp",
    "Responsive Web Design, freeCodeCamp",
    "JavaScript Algorithms and Data Structures, freeCodeCamp",
    "Data Science and Python, DataCamp",
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

/**
 * Six terms of eight. No cumulative figure appears anywhere on this site, on
 * purpose: the degree is not finished, and a single number standing in for it
 * would be read as the final one.
 */
export const trajectoryCaption =
  "CUET, six terms of eight. Each point is that term alone, not a running total.";

/**
 * The strip under the hero, declared here rather than at the top of the file
 * because the last claim counts the project lists and has to read them after
 * they exist.
 */
const deployed = [...featured, ...otherWork].filter((p) => p.live).length;

export const proof: Proof[] = [
  {
    value: "2",
    label: "extensions published on the Chrome Web Store",
    href: "https://chromewebstore.google.com/detail/riphours/iagjeekneaalapjnnofnifleaiondbbb",
  },
  {
    // "1" rendered at the same size as the others undersold this badly. The
    // venue is the claim worth reading, not the count.
    value: "IEEE",
    label: "peer-reviewed paper at ICECTE 2026",
    href: "https://ieeexplore.ieee.org/document/11429440",
  },
  {
    // Was "7th of the field", which implies a denominator. The shared task
    // overview does not publish the number of teams anywhere I can cite, so
    // the placing stands on its own and the ACL Anthology page is the receipt.
    // That link also replaces the OpenReview one, which puts visitors through
    // a browser check before showing them anything.
    value: "7th",
    label: "at a DravidianLangTech shared task, ACL 2026",
    href: "https://aclanthology.org/2026.dravidianlangtech-1.58/",
  },
  {
    // This slot read "300+ competitive programming problems solved" over a
    // link to Codeforces, where the profile shows 83 solved at 1053. The 300+
    // is real and spread across judges, but the receipt attached to it argued
    // the opposite on the first click, which costs more than the claim is
    // worth. What replaces it is checkable in full: every one of these has a
    // live URL on the work page.
    value: String(deployed),
    label: "projects deployed and open to try right now",
    href: "/work",
    internal: true,
  },
];
