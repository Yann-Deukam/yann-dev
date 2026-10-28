export type Project = {
  id: string;
  title: string;
  description: string;
  /** Path under /public, e.g. /projects/atlas.jpg (recommended 1600×1000). */
  image: string;
  stack: string[];
  github: string;
  live: string;
};

/* ---------- Edit these ---------- */
export const PROJECTS: Project[] = [
  {
    id: "atlas",
    title: "Atlas Dashboard",
    description: "Real-time analytics dashboard with live charts, saved views and role-based access.",
    image: "/projects/atlas.jpg",
    stack: ["Next.js", "TypeScript", "Tailwind", "Recharts"],
    github: "https://github.com/your-handle/atlas",
    live: "https://atlas.example.com",
  },
  {
    id: "launchpad",
    title: "Launch Pad",
    description: "Startup landing kit with animated sections, dark mode and a working contact flow.",
    image: "/projects/launchpad.jpg",
    stack: ["Next.js", "GSAP", "Tailwind"],
    github: "https://github.com/your-handle/launchpad",
    live: "https://launchpad.example.com",
  },
  {
    id: "mboa",
    title: "Mboa Market",
    description: "Marketplace for local artisans with mobile-money checkout and offline-friendly pages.",
    image: "/projects/mboa.jpg",
    stack: ["React", "Node.js", "PostgreSQL"],
    github: "https://github.com/your-handle/mboa",
    live: "https://mboa.example.com",
  },
  {
    id: "pulse",
    title: "Pulse Notes",
    description: "Minimal note-taking app with markdown, instant search and keyboard-first navigation.",
    image: "/projects/pulse.jpg",
    stack: ["React", "Zustand", "IndexedDB"],
    github: "https://github.com/your-handle/pulse",
    live: "https://pulse.example.com",
  },
  {
    id: "orbit",
    title: "Orbit 3D",
    description: "Interactive 3D product viewer with smooth camera moves and lazy-loaded models.",
    image: "/projects/orbit.jpg",
    stack: ["Three.js", "R3F", "TypeScript"],
    github: "https://github.com/your-handle/orbit",
    live: "https://orbit.example.com",
  },
];