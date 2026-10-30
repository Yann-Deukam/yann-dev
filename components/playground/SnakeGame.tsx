"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import { glass, glassHover } from "@/constants/styles";

const SIZE = 16;
const TICK_MS = 140;

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";
type Status = "ready" | "playing" | "over";

type GameState = {
  snake: Point[]; // head first
  food: Point;
  status: Status;
  score: number;
};

const START_SNAKE: Point[] = [
  { x: 6, y: 8 },
  { x: 5, y: 8 },
  { x: 4, y: 8 },
];

const MOVES: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

const isSamePoint = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

/** Picks a random empty cell for the next piece of food. */
function placeFood(snake: Point[]): Point {
  const free: Point[] = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = { x, y };
      if (!snake.some((part) => isSamePoint(part, cell))) free.push(cell);
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? snake[0];
}

/** Moves the snake one cell. Returns the new state, or "over" if it hit a wall or itself. */
function advance(state: GameState, direction: Direction): GameState {
  const head = state.snake[0];
  const next = { x: head.x + MOVES[direction].x, y: head.y + MOVES[direction].y };
  const ate = isSamePoint(next, state.food);

  // The tail moves away each step unless the snake eats, so the head can follow the old tail.
  const body = ate ? state.snake : state.snake.slice(0, -1);

  const hitWall = next.x < 0 || next.y < 0 || next.x >= SIZE || next.y >= SIZE;
  const hitSelf = body.some((part) => isSamePoint(part, next));
  if (hitWall || hitSelf) return { ...state, status: "over" };

  const snake = [next, ...body];
  return {
    snake,
    food: ate ? placeFood(snake) : state.food,
    status: "playing",
    score: state.score + (ate ? 1 : 0),
  };
}

export default function SnakeGame() {
  const [game, setGame] = useState<GameState>(() => ({
    snake: START_SNAKE,
    food: { x: 11, y: 8 },
    status: "ready",
    score: 0,
  }));
  const [best, setBest] = useState(0);

  // The direction the snake is moving in, and turns waiting for the next ticks.
  const heading = useRef<Direction>("right");
  const queue = useRef<Direction[]>([]);

  // Queue a turn. Ignores repeats and reversals, and keeps at most two queued turns.
  const turn = useCallback((next: Direction) => {
    const last = queue.current[queue.current.length - 1] ?? heading.current;
    if (next === last || next === OPPOSITE[last]) return;
    if (queue.current.length < 2) queue.current.push(next);
  }, []);

  const start = () => {
    queue.current = [];
    heading.current = "right";
    setGame({ snake: START_SNAKE, food: placeFood(START_SNAKE), status: "playing", score: 0 });
  };

  // Move one cell per tick while playing.
  useEffect(() => {
    if (game.status !== "playing") return;

    const id = window.setInterval(() => {
      const direction = queue.current.shift() ?? heading.current;
      heading.current = direction;
      setGame((state) => advance(state, direction));
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [game.status]);

  // Keyboard controls. Only captured while playing, so the page still scrolls otherwise.
  useEffect(() => {
    if (game.status !== "playing") return;

    const onKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[event.key];
      if (!direction) return;
      event.preventDefault();
      turn(direction);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [game.status, turn]);

  // Record the best score when a round ends.
  useEffect(() => {
    if (game.status === "over") setBest((current) => Math.max(current, game.score));
  }, [game.status, game.score]);

  const snakeCells = new Set(game.snake.map((part) => `${part.x},${part.y}`));
  const head = game.snake[0];
  const playing = game.status === "playing";

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Steer the snake into the glowing food to grow longer. Avoid the walls and your own body.
      </p>

      <div className="relative w-full">
        <div className="grid aspect-square w-full grid-cols-16 gap-px overflow-hidden rounded-xl bg-border/60">
          {Array.from({ length: SIZE * SIZE }, (_, index) => {
            const x = index % SIZE;
            const y = Math.floor(index / SIZE);
            const key = `${x},${y}`;

            if (isSamePoint(game.food, { x, y })) {
              return (
                <div key={key} className="flex items-center justify-center bg-background">
                  <span className="size-[60%] rounded-full bg-accent" />
                </div>
              );
            }

            const isHead = head && isSamePoint(head, { x, y });
            const isBody = snakeCells.has(key);
            const color = isHead ? "bg-accent" : isBody ? "bg-primary" : "bg-background";

            return <div key={key} className={color} />;
          })}
        </div>

        {!playing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-background/75 p-6 text-center backdrop-blur-sm">
            {game.status === "over" ? (
              <p className="text-lg font-semibold">
                Game over. Score <span className="text-accent">{game.score}</span>
              </p>
            ) : (
              <p className="text-lg font-semibold">Ready when you are</p>
            )}
            <Button onClick={start}>{game.status === "over" ? "Play again" : "Start"}</Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Score <span className="text-foreground">{game.score}</span> · Best{" "}
          <span className="text-foreground">{best}</span>
        </p>
        <p className="hidden text-xs text-muted-foreground md:block">Arrow keys or WASD</p>
      </div>

      <div className="mx-auto grid grid-cols-3 gap-2">
        <span />
        <DirectionButton label="Up" symbol="↑" onPress={() => playing && turn("up")} />
        <span />
        <DirectionButton label="Left" symbol="←" onPress={() => playing && turn("left")} />
        <span />
        <DirectionButton label="Right" symbol="→" onPress={() => playing && turn("right")} />
        <span />
        <DirectionButton label="Down" symbol="↓" onPress={() => playing && turn("down")} />
        <span />
      </div>
    </div>
  );
}

type DirectionButtonProps = {
  label: string;
  symbol: string;
  onPress: () => void;
};

/** On-screen control for touch devices. */
function DirectionButton({ label, symbol, onPress }: DirectionButtonProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={`Turn ${label.toLowerCase()}`}
      className={`${glass} ${glassHover} grid size-12 place-items-center rounded-full text-lg transition-colors duration-200`}
    >
      {symbol}
    </button>
  );
}