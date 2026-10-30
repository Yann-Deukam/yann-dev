import { heroMono } from "@/constants/fonts";
import { HERO } from "@/constants/heroData";

type HeroHeadlineProps = {
  /** "design" is the real, accessible headline. "build" is its blueprint twin. */
  mode: "design" | "build";
};

/** Index of the block in HERO.blocks that is set in the accent colour. */
const ACCENT_BLOCK = 1;

/** Time before the first word starts rising, so the page has painted. */
const START_DELAY_MS = 200;
/** Delay between one row of words and the next. */
const ROW_STEP_MS = 180;
/** Delay between one word and the next within a row. */
const WORD_STEP_MS = 70;

/**
 * Fluid size: limited by width on phones and by height on short screens,
 * so four rows always fit above the card.
 */
const headlineSize = "text-[clamp(3rem,min(15vw,16svh),11rem)]";

/**
 * Both layers render this same markup, so every letter lands on the same pixel.
 * Only the paint differs between the two modes.
 *
 * The design words rise in with a CSS animation, so the entrance runs on every
 * load without depending on JavaScript. The build layer is static.
 */
export default function HeroHeadline({ mode }: HeroHeadlineProps) {
  const isBuild = mode === "build";
  const Tag = isBuild ? "div" : "h1";

  const paint = isBuild
    ? "text-primary [-webkit-text-fill-color:transparent] [-webkit-text-stroke:1.5px_currentColor]"
    : "text-foreground";

  return (
    <div className="absolute inset-x-0 top-[36%] -translate-y-1/2 px-6 md:top-[45%] md:px-14">
      <Tag
        data-headline
        className={`flex flex-col gap-[0.08em] font-sans leading-[0.92] font-semibold tracking-[-0.04em] ${headlineSize} ${paint}`}
      >
        {HERO.blocks.map((rows, blockIndex) => {
          const side = blockIndex % 2 === 0 ? "left" : "right";
          const placement = side === "left" ? "self-start" : "self-end text-right";
          const tone = blockIndex === ACCENT_BLOCK ? "text-accent" : "";
          const outline = isBuild
            ? "outline outline-dashed outline-primary/60 outline-offset-[0.1em]"
            : "";

          return (
            <span
              key={blockIndex}
              data-block={side}
              className={`relative block w-fit ${placement} ${tone} ${outline}`}
            >
              {rows.map((row, rowIndex) => (
                <span key={row} className="block whitespace-nowrap">
                  {row.split(" ").map((word, wordIndex, words) => {
                    // Reading order: each block starts after the previous one's rows.
                    const order = blockIndex * 2 + rowIndex;
                    const delay = START_DELAY_MS + order * ROW_STEP_MS + wordIndex * WORD_STEP_MS;

                    return (
                      <span key={`${word}-${wordIndex}`}>
                        {/* Each word sits in its own mask, so it can rise into view. */}
                        <span className="my-[-0.1em] inline-block overflow-hidden py-[0.1em] align-top">
                          <span
                            className={
                              isBuild
                                ? "inline-block"
                                : "inline-block animate-hero-rise motion-reduce:animate-none"
                            }
                            style={isBuild ? undefined : { animationDelay: `${delay}ms` }}
                          >
                            {word}
                          </span>
                        </span>
                        {wordIndex < words.length - 1 ? " " : null}
                      </span>
                    );
                  })}
                </span>
              ))}

              {/* Width and height of the block, measured live by the hook. */}
              {isBuild && (
                <span
                  data-dim
                  className={`${heroMono.className} absolute bottom-full left-0 mb-5 text-[11px] leading-none whitespace-nowrap text-accent [-webkit-text-fill-color:currentColor] [-webkit-text-stroke:0]`}
                />
              )}
            </span>
          );
        })}
      </Tag>
    </div>
  );
}