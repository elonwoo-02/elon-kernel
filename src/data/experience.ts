export interface HeroProfile {
  name: string;
  line2: string;
  line3: string;
  researchTitle: string;
  researchBullets: string[];
  closing: string;
  // optional avatar path relative to public/, e.g. /avatars/default.png
  avatar?: string;
}

export interface ActionLinks {
  githubUrl: string;
  cvUrl: string;
  email: string;
}

export interface ResearchItem {
  title: string;
  summary: string;
  keywords: string[];
}

export interface ProjectItem {
  title: string;
  period: string;
  summary: string;
  tech: string[];
  link?: string;
}

export interface PublicationItem {
  title: string;
  venue: string;
  year: string;
  status: string;
  url?: string;
}

export interface ExperienceSectionRef {
  id: "research" | "projects" | "publications";
  label: string;
}

export const heroProfile: HeroProfile = {
  name: "Mr. Woo",
  line2: "CS Major",
  line3: "University of NorthEast",
  researchTitle: "Research Interests:",
  researchBullets: [
    "Machine Learning Systems",
    "Efficient LLM Fine-tuning",
    "Model Compression and Inference Optimization",
  ],
  closing:
    "I am currently applying for MSc programs and seeking research-oriented training opportunities.",
  // default avatar (uses existing public/avatars/default.png)
  avatar: "/avatars/default.png",
};

export const actionLinks: ActionLinks = {
  githubUrl: "https://github.com/elonwoo-02/",
  cvUrl: "/cv/mr-woo-cv.md",
  email: "mailto:gongzi_1076@163.com",
};

export const researchItems: ResearchItem[] = [
  {
    title: "Scalable Training and Serving for LLMs",
    summary:
      "Study practical system bottlenecks in training and inference pipelines and improve throughput-to-cost tradeoffs.",
    keywords: ["Distributed Systems", "Performance Profiling", "Model Serving"],
  },
  {
    title: "Parameter-Efficient Fine-tuning",
    summary:
      "Explore LoRA and QLoRA style adaptation for domain tasks while controlling memory overhead.",
    keywords: ["PEFT", "Low-bit Training", "Generalization"],
  },
  {
    title: "Reproducible Applied ML Workflows",
    summary:
      "Build reliable experiment loops with strong logging, evaluation discipline, and deployable baselines.",
    keywords: ["Experiment Tracking", "Evaluation", "MLOps"],
  },
];

export const projectItems: ProjectItem[] = [
  {
    title: "Dimensional Debris",
    period: "2025 - Present",
    summary:
      "Designed and built a personal web platform with Astro-based architecture, reusable UI systems, and content workflows.",
    tech: ["Astro", "TypeScript", "Tailwind CSS", "Preact"],
    link: "https://dimensional-debris.dev/",
  },
  {
    title: "Interactive Terminal UI Module",
    period: "2025",
    summary:
      "Implemented a browser terminal interaction layer for navigation and utility commands with keyboard-first UX.",
    tech: ["JavaScript", "DOM Events", "Command Parsing"],
  },
  {
    title: "Game Tooling and Pipeline Support",
    period: "2024",
    summary:
      "Contributed to gameplay feature tooling and content integration workflows during a game development internship.",
    tech: ["Unity", "C#", "Pipeline Integration"],
  },
];

export const publicationItems: PublicationItem[] = [];

export const experienceSections: ExperienceSectionRef[] = [
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "publications", label: "Publications" },
];
