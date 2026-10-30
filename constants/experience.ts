import { IconName } from "@/components/Icon";


export type ExperienceItem = {
  id: string;
  title: string;
  organisation: string;
  /** Shown as a small label. Replace the placeholder with real dates. */
  period: string;
  icon: IconName;
  summary: string;
  points: string[];
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "Codees-cm",
    title: "Frontend Developer & Designer",
    organisation: "Codees-cm",
    period: "Present",
    icon: "briefcase",
    summary:
      "A freelance studio offering digital solutions for small and medium size enterprizes",
    points: [
      "Frontend builds in Next.js and React",
      "Optimized and user-driven interfaces",
      "sophisticated API integration",
    ],
  },
  {
  id: "full-stack",
  title: "Software Development",
  organisation: "AJEL Corporation",
  period: "Freelance",
  icon: "layers",
  summary:
    "Contributed to the company's digital ecosystem through website and management system development.",
  points: [
    "Built and maintained the company website using Next.js",
    "Contributed to the implementation of its management system",
    "Focused on visual hierarchy, performance and SEO",
  ],
},
  {
    id: "Global Asset Cameroon",
    title: "Internship, Software engineer",
    organisation: "Global Asset Cameroon Ltd",
    period: "2021",
    icon: "briefcase",
    summary:
      "Applied software development and design skills to real projects while contributing to SYSDEVAM, a securities dematerialization platform.",
    points: [
      "Introduction to Angular framework",
      "System analysis and design",
      "Development and deployment of SYSDEVAM Framework",
    ],
  },
];