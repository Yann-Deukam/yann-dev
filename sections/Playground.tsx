import Button from "@/components/Button";
import SquareField from "@/components/SquareField";
import { glass } from "@/constants/styles";

/** Home page section that leads visitors into the /playground route. */
export default function Playground() {
  return (
    <section
      id="playground"
      className="relative overflow-hidden bg-background px-6 py-24 text-foreground md:px-14 md:py-32"
    >
      <div className="mx-auto flex max-w-300 flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-[0.3em] text-accent uppercase">
            Playground
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
            Digital Playground
          </h2>
        </div>

        <div
          className={`${glass} relative flex flex-col overflow-hidden rounded-[2.5rem] p-8 md:p-14`}
        >
          {/* Background: the tile field fills the card's bottom-right corner. */}
          <SquareField />

          {/* Foreground: the content sits above the field. */}
          <div className="relative z-10 flex flex-col gap-8">
            <h3 className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.04em]">
              What if you took a rest?
            </h3>

            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              A creative space where I experiment with interactive ideas, micro-projects, games,
              animations, and unconventional concepts. This is where exploration meets engineering.
            </p>

            <div>
              <Button href="/playground" arrow>
                Explore the Playground
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}