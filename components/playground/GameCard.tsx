import type { PlaygroundGame } from "@/constants/playground";
import { glass } from "@/constants/styles";

type GameCardProps = {
  game: PlaygroundGame;
  index: number;
};

export default function GameCard({ game, index }: GameCardProps) {
  const { Component } = game;
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className={`${glass} flex flex-col gap-6 rounded-3xl p-6 md:p-8`}>
      <header className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent">{number}</p>
          <ul className="flex flex-wrap justify-end gap-2">
            {game.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground dark:border-white/10"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
            {game.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {game.description}
          </p>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-background/40 p-4 md:p-6 dark:border-white/10">
        <Component />
      </div>
    </article>
  );
}