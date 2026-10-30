"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";

const SIZE = 16;
const TICK_MS = 180;

type Grid = boolean[][];

const emptyGrid = (): Grid =>
  Array.from({ length: SIZE }, () => Array<boolean>(SIZE).fill(false));

const randomGrid = (): Grid =>
  Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => Math.random() < 0.3)
  );

/** Applies the rules once. The edges wrap, so the board has no border. */
function step(grid: Grid): Grid {
  return grid.map((row, y) =>
    row.map((alive, x) => {
      let neighbours = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ny = (y + dy + SIZE) % SIZE;
          const nx = (x + dx + SIZE) % SIZE;
          if (grid[ny][nx]) neighbours++;
        }
      }
      return alive ? neighbours === 2 || neighbours === 3 : neighbours === 3;
    })
  );
}

export default function GameOfLife() {
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [running, setRunning] = useState(false);

  // Advance the simulation while running. The interval is cleared when paused or unmounted.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setGrid((current) => step(current)), TICK_MS);
    return () => window.clearInterval(id);
  }, [running]);

  const toggleCell = (x: number, y: number) => {
    setGrid((current) =>
      current.map((row, rowIndex) =>
        rowIndex === y ? row.map((cell, colIndex) => (colIndex === x ? !cell : cell)) : row
      )
    );
  };

  const clear = () => {
    setRunning(false);
    setGrid(emptyGrid());
  };

  const randomise = () => {
    setRunning(false);
    setGrid(randomGrid());
  };

  const population = grid.reduce(
    (total, row) => total + row.filter(Boolean).length,
    0
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid aspect-square w-full grid-cols-16 gap-px overflow-hidden rounded-xl bg-border/60">
        {grid.map((row, y) =>
          row.map((alive, x) => (
            <button
              key={`${x}-${y}`}
              type="button"
              onClick={() => toggleCell(x, y)}
              aria-label={`Cell ${x + 1}, ${y + 1}, ${alive ? "alive" : "dead"}`}
              aria-pressed={alive}
              className={`${alive ? "bg-primary" : "bg-background hover:bg-foreground/10"} transition-colors duration-150`}
            />
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Alive: <span className="text-foreground">{population}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setRunning((value) => !value)}>
            {running ? "Pause" : "Run"}
          </Button>
          <Button onClick={() => setGrid((current) => step(current))}>
            Step
          </Button>
          <Button onClick={randomise}>Random</Button>
          <Button onClick={clear}>Clear</Button>
        </div>
      </div>
    </div>
  );
}