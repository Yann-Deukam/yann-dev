"use client";

import { useState } from "react";
import Button from "@/components/Button";

const SENTENCES = [
  "Good design is invisible until it is missing.",
  "Motion should explain, not decorate.",
  "Simple tools make the best playgrounds.",
];

/** Average English word length, used by the standard WPM formula. */
const CHARS_PER_WORD = 5;

export default function TypingSpeed() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  // Every character added, and how many of those were wrong.
  const [keystrokes, setKeystrokes] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const sentence = SENTENCES[index];
  const finished = finishedAt !== null;

  const handleChange = (value: string) => {
    if (finished) return;

    if (startedAt === null && value.length > 0) {
      setStartedAt(performance.now());
    }

    // Count only added characters, so deleting a mistake does not count against you twice.
    if (value.length > typed.length) {
      const added = value.length - 1;
      setKeystrokes((count) => count + 1);
      if (value[added] !== sentence[added]) {
        setMistakes((count) => count + 1);
      }
    }

    setTyped(value);

    if (value === sentence) {
      setFinishedAt(performance.now());
    }
  };

  /** Clears the input. After a finished sentence, it also moves on to the next one. */
  const tapToReset = () => {
    if (finished) {
      setIndex((current) => (current + 1) % SENTENCES.length);
    }
    setTyped("");
    setStartedAt(null);
    setFinishedAt(null);
    setKeystrokes(0);
    setMistakes(0);
  };

  const accuracy =
    keystrokes > 0 ? Math.round(((keystrokes - mistakes) / keystrokes) * 100) : 100;

  const seconds =
    startedAt !== null && finishedAt !== null ? (finishedAt - startedAt) / 1000 : 0;
  const wpm =
    seconds > 0 ? Math.round(sentence.length / CHARS_PER_WORD / (seconds / 60)) : 0;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-lg leading-relaxed font-medium md:text-xl" aria-live="polite">
        {sentence.split("").map((char, i) => {
          const isTyped = i < typed.length;
          const isCorrect = typed[i] === char;

          const color = !isTyped
            ? "text-muted-foreground/60"
            : isCorrect
              ? "text-foreground"
              : "text-accent underline decoration-accent";

          return (
            <span key={i} className={color}>
              {char}
            </span>
          );
        })}
      </p>

      {finished && (
        <div
          role="status"
          className="flex flex-col gap-2 rounded-2xl border border-green-600/40 bg-green-500/10 p-5"
        >
          <p className="text-xl font-semibold text-green-500">Congratulations, you finished!</p>
          <p className="text-sm leading-relaxed text-foreground">
            You typed the whole sentence in{" "}
            <span className="font-semibold">{seconds.toFixed(1)} s</span> at{" "}
            <span className="font-semibold">{wpm} WPM</span> with{" "}
            <span className="font-semibold">{accuracy}%</span> accuracy.
          </p>
        </div>
      )}

      <input
        type="text"
        value={typed}
        onChange={(event) => handleChange(event.target.value)}
        disabled={finished}
        placeholder="Start typing here"
        aria-label="Type the sentence above"
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none disabled:opacity-60"
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {finished ? "Tap to reset for the next sentence." : "Type the sentence exactly as shown."}
        </p>
        <Button onClick={tapToReset}>Tap to reset</Button>
      </div>
    </div>
  );
}