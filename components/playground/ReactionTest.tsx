"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "waiting" | "ready" | "result" | "early";

const PANEL_COPY: Record<Phase, string> = {
  idle: "Click to start",
  waiting: "Wait for green…",
  ready: "Click now!",
  result: "Click to try again",
  early: "Too soon. Click to retry",
};

const PANEL_STYLE: Record<Phase, string> = {
  idle: "bg-foreground/5 text-foreground",
  waiting: "bg-accent/15 text-foreground",
  ready: "bg-green-100 text-green-500",
  result: "bg-foreground/5 text-foreground",
  early: "bg-accent text-accent-foreground",
};

export default function ReactionTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [last, setLast] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);

  const timeout = useRef<number | undefined>(undefined);
  const startedAt = useRef(0);

  // Cancel a pending timer if the game unmounts.
  useEffect(() => () => window.clearTimeout(timeout.current), []);

  const startRound = () => {
    setPhase("waiting");
    const delay = 1500 + Math.random() * 3000;
    timeout.current = window.setTimeout(() => {
      startedAt.current = performance.now();
      setPhase("ready");
    }, delay);
  };

  const handlePress = () => {
    switch (phase) {
      case "waiting":
        window.clearTimeout(timeout.current);
        setPhase("early");
        break;
      case "ready": {
        const ms = Math.round(performance.now() - startedAt.current);
        setLast(ms);
        setBest((current) => (current === null || ms < current ? ms : current));
        setPhase("result");
        break;
      }
      default:
        startRound();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={handlePress}
        className={`${PANEL_STYLE[phase]} flex aspect-video w-full items-center justify-center rounded-2xl text-lg font-medium transition-colors duration-200 select-none`}
      >
        {PANEL_COPY[phase]}
      </button>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Last: <span className="text-foreground">{last ? `${last} ms` : "–"}</span>
        </span>
        <span>
          Best: <span className="text-foreground">{best ? `${best} ms` : "–"}</span>
        </span>
      </div>
    </div>
  );
}