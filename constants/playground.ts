import MemoryMatch from "@/components/playground/MemoryMatch";
import ReactionTest from "@/components/playground/ReactionTest";
import SnakeGame from "@/components/playground/SnakeGame";
import TypingSpeed from "@/components/playground/TypingSpeed";
import type { ComponentType } from "react";


export type PlaygroundGame = {
  id: string;
  title: string;
  description: string;
  /** Skills the game demonstrates, shown as chips on its card. */
  tags: string[];
  Component: ComponentType;
};

/** The games on /playground. Order here is the order on the page. */
export const PLAYGROUND_GAMES: PlaygroundGame[] = [
  {
    id: "reaction-test",
    title: "Reaction Test",
    description:
      "Wait for the panel to turn green, then click as fast as you can. Your best time is kept for the session.",
    tags: ["State", "Timers", "Cleanup"],
    Component: ReactionTest,
  },
  {
    id: "memory-match",
    title: "Memory Match",
    description:
      "Flip two cards at a time and find every pair. Counts your moves and detects when the board is solved.",
    tags: ["Arrays", "Effects", "Derived state"],
    Component: MemoryMatch,
  },
  {
    id: "snake",
    title: "Snake",
    description:
      "Eat the food to grow, and avoid the walls and your own tail. Play with the keyboard or the on-screen buttons.",
    tags: ["Game loop", "Keyboard input", "Touch controls"],
    Component: SnakeGame,
  },
  {
    id: "typing-speed",
    title: "Typing Speed",
    description:
      "Type the sentence exactly as shown. Each character is coloured as you go, and you get words per minute and accuracy at the end.",
    tags: ["Input handling", "Metrics", "Accessibility"],
    Component: TypingSpeed,
  },
];