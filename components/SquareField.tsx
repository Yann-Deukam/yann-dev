/** Theme tones, mixed so neighbouring tiles differ. Literal class names so Tailwind can find them. */
const TONES = [
  "bg-primary/40",
  "bg-accent/50",
  "bg-foreground/15",
  "bg-primary/25",
  "bg-accent/30",
];

/**
 * Grid size. Chosen so that, across the 60% area on a desktop card, the tiles
 * come out close to square. Change these together with the grid-cols-* and
 * grid-rows-* classes below.
 */
const COLUMNS = 10;
const ROWS = 6;

/** Milliseconds between one diagonal of tiles and the next. Controls how fast the wave travels. */
const WAVE_STEP_MS = 90;

/**
 * Fills the bottom-right corner of its card (30% wide, 60% tall), flush with the right and bottom edges.
 * The card clips the rounded corner. Decorative only: hidden from assistive
 * technology, ignores the pointer, and stops for reduced motion.
 */
export default function SquareField() {
  const tiles = Array.from({ length: COLUMNS * ROWS }, (_, index) => {
    const column = index % COLUMNS;
    const row = Math.floor(index / COLUMNS);

    // Distance from the bottom-right corner sets when each tile joins the wave.
    const distance = COLUMNS - 1 - column + (ROWS - 1 - row);

    return {
      key: index,
      tone: TONES[(column * 3 + row * 7) % TONES.length],
      delay: distance * WAVE_STEP_MS,
    };
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-0 bottom-0 hidden h-[60%] w-[30%] grid-cols-10 grid-rows-6 gap-1.5 sm:grid"
    >
      {tiles.map((tile) => (
        <span
          key={tile.key}
          className={`${tile.tone} h-full w-full rounded-[3px] animate-tile-wave motion-reduce:animate-none`}
          style={{ animationDelay: `${tile.delay}ms` }}
        />
      ))}
    </div>
  );
}