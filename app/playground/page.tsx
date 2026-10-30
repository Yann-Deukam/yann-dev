import type { Metadata } from "next";
import Button from "@/components/Button";
import { PLAYGROUND_GAMES } from "@/constants/playground";
import GameCard from "@/components/playground/GameCard";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Small interactive experiments: a reaction test, memory match, snake and a typing speed test.",
};

export default function PlaygroundPage() {
  return (
    <main className="min-h-svh bg-background px-6 pt-32 pb-24 font-sans text-foreground md:px-14">
      <header className="mx-auto flex max-w-300 flex-col gap-4">
        <Button href="/" className="self-start">
          ← Back to home
        </Button>

        <p className="mt-6 text-xs font-semibold tracking-[0.3em] text-accent uppercase">
          Playground
        </p>
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
          Digital Playground
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Four small experiments, each built to show a specific piece of front-end work. Click
          around, break things, and see what the code does.
        </p>
      </header>

      <div className="mx-auto mt-14 grid max-w-300 gap-6 md:grid-cols-2">
        {PLAYGROUND_GAMES.map((game, index) => (
          <GameCard key={game.id} game={game} index={index} />
        ))}
      </div>
    </main>
  );
}