import { heroMono } from "@/constants/fonts";
import { HERO } from "@/constants/heroData";

type HeroHeadlineProps = {
  /** "design" is the real, accessible headline. "build" is its blueprint twin. */
  mode: "design" | "build";
};

/** Index of the block in HERO.blocks that is set in the accent colour. */
const ACCENT_BLOCK = 1;

/**
 * Fluid size: limited by width on phones and by height on short screens,
 * so four rows always fit above the card.
 */
const headlineSize = "text-[clamp(3rem,min(15vw,16svh),11rem)]";

/**
 * Both layers render this same markup, so every letter lands on the same pixel.
 * Only the paint differs between the two modes.
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
              {rows.map((row) => (
                <span key={row} className="block whitespace-nowrap">
                  {row.split(" ").map((word, wordIndex, words) => (
                    <span key={`${word}-${wordIndex}`}>
                      {/* Each word sits in its own mask, so it can rise into view. */}
                      <span className="my-[-0.1em] inline-block overflow-hidden py-[0.1em] align-top">
                        <span
                          data-reveal={isBuild ? undefined : true}
                          className={
                            isBuild
                              ? "inline-block"
                              : "inline-block [@media(hover:hover)_and_(pointer:fine)]:invisible"
                          }
                        >
                          {word}
                        </span>
                      </span>
                      {wordIndex < words.length - 1 ? " " : null}
                    </span>
                  ))}
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