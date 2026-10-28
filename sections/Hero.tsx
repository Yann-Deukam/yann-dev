"use client";

import { useRef } from "react";
import { heroMono } from "@/constants/fonts";
import { HERO } from "@/constants/heroData";
import { glass } from "@/constants/styles";
import Button from "@/components/Button";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";
import HeroHeadline from "@/components/HeroHeadline";

/** Blueprint grid for the build layer. */
const gridBackground =
  "bg-[linear-gradient(to_right,color-mix(in_srgb,var(--primary)_12%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--primary)_12%,transparent)_1px,transparent_1px)] bg-[length:48px_48px]";

/** The lens: a circle whose centre and radius the hook sets on the section. */
const lensClip =
  "[clip-path:circle(var(--lens-r,0px)_at_var(--lens-x,50%)_var(--lens-y,50%))]";

/** The build layer only exists for pointers that can hover. */
const lensVisibility = "hidden [@media(hover:hover)_and_(pointer:fine)]:block";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  useHeroAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative isolate h-svh min-h-144 w-full overflow-hidden bg-background font-sans text-foreground md:min-h-156"
    >
      {/* Drifting light behind the glass. Keeps moving on all devices. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-16 -z-10 size-96 animate-hero-drift-a rounded-full bg-accent/20 blur-[120px] motion-reduce:animate-none md:left-[8%] md:size-112 dark:bg-accent/25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -bottom-32 -z-10 size-96 animate-hero-drift-b rounded-full bg-primary/20 blur-[120px] motion-reduce:animate-none md:right-[6%] md:size-128 dark:bg-primary/30"
      />

      {/* Layer 1: the finished design. Always visible on touch and without JavaScript. */}
      <div data-layer="design" className="absolute inset-0 z-10">
        <HeroHeadline mode="design" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 px-4 pb-4 md:flex-row md:items-end md:justify-between md:gap-8 md:px-14 md:pb-10">
          <div
            data-foot
            className={`${glass} flex w-full flex-col gap-5 rounded-3xl p-5 md:max-w-md md:gap-6 md:p-6`}
          >
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {HERO.support}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={HERO.primaryCta.href} arrow className="w-full sm:w-fit">
                {HERO.primaryCta.label}
              </Button>
              <Button href={HERO.secondaryCta.href} className="w-full sm:w-fit">
                {HERO.secondaryCta.label}
              </Button>
            </div>
          </div>

          {/* Only shown where a mouse can reveal the lens. */}
          <p
            data-foot
            className="hidden max-w-[16rem] text-sm leading-relaxed text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:block"
          >
            {HERO.hint}
          </p>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[url(/grain.svg)] opacity-[0.08]"
        />
      </div>

      {/* Layer 2: the build view, seen only through the lens on desktop */}
      <div
        data-lens
        aria-hidden
        className={`${lensVisibility} pointer-events-none absolute inset-0 z-20 bg-panel-alt text-primary ${lensClip}`}
      >
        <div className={`absolute inset-0 ${gridBackground}`} />

        <HeroHeadline mode="build" />

        <p
          className={`${heroMono.className} absolute inset-x-0 bottom-0 px-4 pb-4 text-[12px] leading-relaxed whitespace-pre md:px-14 md:pb-10 md:text-[13px]`}
        >
          {HERO.buildNotes.join("\n")}
        </p>

        <div className="absolute top-0 left-0 text-accent transform-[translate3d(var(--lens-x,0px),var(--lens-y,0px),0)] will-change-transform before:absolute before:-left-3 before:top-0 before:h-px before:w-6 before:bg-current before:content-[''] after:absolute after:-top-3 after:left-0 after:h-6 after:w-px after:bg-current after:content-['']">
          <span
            data-coords
            className={`${heroMono.className} absolute top-3 left-3 text-[11px] leading-none whitespace-nowrap`}
          />
        </div>
      </div>
    </section>
  );
}