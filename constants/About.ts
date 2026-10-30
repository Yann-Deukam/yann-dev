import type { IconName } from "@/components/Icon";

export type IconTone = "primary" | "accent";

/** Either a run of text, or an icon chip placed inline in the sentence. */
export type StorySegment = string | { icon: IconName; tone: IconTone };

const code = { icon: "code", tone: "primary" } as const;
const cap = { icon: "cap", tone: "accent" } as const;
const briefcase = { icon: "briefcase", tone: "primary" } as const;
const mic = { icon: "mic", tone: "accent" } as const;
const pin = { icon: "pin", tone: "primary" } as const;
const pen = { icon: "pen", tone: "accent" } as const;
const layers = { icon: "layers", tone: "primary" } as const;

/**
 * One inner array per paragraph. Each chip sits where its idea appears:
 * developer, degree, experience, communication, location, design, applications.
 */
export const ABOUT_STORY: StorySegment[][] = [
  [
    "Hi, I am Yann Deukam, a passionate developer",
    code,
    "with a bachelor degree in software engineering",
    cap,
    "and 3+ years of experience",
    briefcase,
    "with good communication skills",
    mic,
    ".",
  ],
  [
    "Based in Cameroon",
    pin,
    ", I build pixel-perfect interfaces",
    pen,
    "and robust applications",
    layers,
    ".",
  ],
];