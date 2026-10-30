"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";

type Card = {
  symbol: string;
  flipped: boolean;
  matched: boolean;
};

const SYMBOLS = ["◆", "●", "▲", "■", "★", "✚", "⬟", "✦"];

/** Two of each symbol, shuffled with Fisher–Yates. */
function createDeck(): Card[] {
  const deck = [...SYMBOLS, ...SYMBOLS].map((symbol) => ({
    symbol,
    flipped: false,
    matched: false,
  }));

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

export default function MemoryMatch() {
  // Empty on the server, dealt on mount, so the shuffle never differs between server and client.
  const [cards, setCards] = useState<Card[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    setCards(createDeck());
  }, []);

  // Two cards are open: keep them up briefly, then either lock them or flip them back.
  useEffect(() => {
    if (open.length !== 2) return;

    const [a, b] = open;
    const isMatch = cards[a].symbol === cards[b].symbol;

    const timer = window.setTimeout(() => {
      setCards((current) =>
        current.map((card, index) => {
          if (index !== a && index !== b) return card;
          return isMatch ? { ...card, matched: true } : { ...card, flipped: false };
        })
      );
      setOpen([]);
    }, isMatch ? 300 : 800);

    return () => window.clearTimeout(timer);
  }, [open, cards]);

  const flip = (index: number) => {
    const card = cards[index];
    if (open.length === 2 || card.flipped || card.matched) return;

    if (open.length === 1) setMoves((count) => count + 1);

    setCards((current) =>
      current.map((c, i) => (i === index ? { ...c, flipped: true } : c))
    );
    setOpen((current) => [...current, index]);
  };

  const restart = () => {
    setCards(createDeck());
    setOpen([]);
    setMoves(0);
  };

  const solved = cards.length > 0 && cards.every((card) => card.matched);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {cards.map((card, index) => {
          const showing = card.flipped || card.matched;
          const style = card.matched
            ? "bg-accent/20 text-accent"
            : card.flipped
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/5 text-transparent hover:bg-foreground/10";

          return (
            <button
              key={index}
              type="button"
              onClick={() => flip(index)}
              aria-label={showing ? `Card ${card.symbol}` : "Face-down card"}
              className={`${style} aspect-square rounded-xl text-2xl transition-colors duration-200 select-none md:text-3xl`}
            >
              {card.symbol}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {solved ? (
            <>
              Solved in <span className="text-foreground">{moves}</span> moves
            </>
          ) : (
            <>
              Moves: <span className="text-foreground">{moves}</span>
            </>
          )}
        </p>
        <Button onClick={restart}>Shuffle</Button>
      </div>
    </div>
  );
}