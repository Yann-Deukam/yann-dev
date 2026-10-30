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
    id: "g-ni-studio",
    title: "Founder, Developer & Designer",
    organisation: "G-ni Studio",
    period: "Present",
    icon: "briefcase",
    summary:
      "A freelance studio offering frontend development and graphic design, so a business can keep one look from the label to the landing page.",
    points: [
      "Frontend builds in Next.js and React",
      "Branding, packaging, illustration and posters",
      "Websites and visual identity for businesses",
    ],
  },
  {
    id: "full-stack",
    title: "Full-stack Development",
    organisation: "Core stack",
    period: "—",
    icon: "layers",
    summary:
      "The toolkit I use for product work, from interfaces through to the data behind them.",
    points: [
      "Next.js, React and Express",
      "MongoDB and PostgreSQL for data",
      "WordPress as a secondary skill",
    ],
  },
];