"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ABOUT_STORY, type IconTone } from "@/constants/About";
import Icon from "@/components/Icon";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ───────────── Story layout ───────────── */

type Segment = (typeof ABOUT_STORY)[number][number];
type ChipSegment = Exclude<Segment, string>;

/**
 * Each line as either text or an icon slot. The slot is the icon's resting place,
 * so the icon always lines up with the sentence, whatever the screen size.
 */
const LINES = ABOUT_STORY.map((line) =>
  line.map((segment: Segment) =>
    typeof segment === "string"
      ? { text: segment }
      : { segment: segment as ChipSegment }
  )
);

/* ───────────── Motion settings ───────────── */

/** Start offsets from the centre of the stage, in pixels, so the icons begin as a loose cluster. */
const CLUSTER = [
  { x: -26, y: -12, rotate: -14 },
  { x: 20, y: -18, rotate: 10 },
  { x: -12, y: 22, rotate: 6 },
  { x: 28, y: 14, rotate: -8 },
  { x: -4, y: -34, rotate: 4 },
  { x: 8, y: 30, rotate: -4 },
  { x: 18, y: 4, rotate: 8 },
];

/** How far the visitor scrolls while the stage is pinned, as a multiple of the screen height. */
const SCROLL_SCREENS = 1.4;

/* ───────────── Styles ───────────── */

/** A slot is em-sized, so icons scale with the text on every screen. */
const slotClass = "relative mx-[0.12em] inline-block size-[0.95em] align-middle";

/** The icon fills its slot exactly. Its transform is the only thing the script changes. */
const tileClass =
  "pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[0.3em] border border-white/50 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_6px_16px_rgba(26,0,80,0.12)] dark:border-white/15 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]";

const toneClass: Record<IconTone, string> = {
  primary: "bg-primary/15 text-primary dark:text-foreground",
  accent: "bg-accent/20 text-accent",
};

/* ───────────── Helpers ───────────── */

/**
 * How far a slot is from the centre of the stage. Slots are never transformed, so
 * the measurement is stable while the icons inside them move.
 */
function offsetToCentre(slot: HTMLElement, stage: HTMLElement) {
  const stageBox = stage.getBoundingClientRect();
  const slotBox = slot.getBoundingClientRect();

  return {
    x: stageBox.left + stageBox.width / 2 - (slotBox.left + slotBox.width / 2),
    y: stageBox.top + stageBox.height / 2 - (slotBox.top + slotBox.height / 2),
  };
}

/* ───────────── Component ───────────── */

export default function AboutSection() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage) return;

      const slots = gsap.utils.toArray<HTMLElement>("[data-slot]", stage);
      const icons = gsap.utils.toArray<HTMLElement>("[data-icon]", stage);
      const words = gsap.utils.toArray<HTMLElement>("[data-text]", stage);

      const mm = gsap.matchMedia();

      // Reduced motion: every icon is already on its slot, and all the text is visible.
      // Nothing to set up, because the resting state is the default state.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Icons start as a loose cluster at the centre of the stage.
        const placeAtCluster = () => {
          icons.forEach((icon, index) => {
            const offset = offsetToCentre(slots[index], stage);
            const cluster = CLUSTER[index % CLUSTER.length];

            gsap.set(icon, {
              x: offset.x + cluster.x,
              y: offset.y + cluster.y,
              rotate: cluster.rotate,
              scale: 1.15,
            });
          });
        };

        placeAtCluster();

        // Only the words are hidden at the start. The icons stay visible.
        gsap.set(words, { autoAlpha: 0, y: 20 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${window.innerHeight * SCROLL_SCREENS}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            // Recalculate the starting cluster on every refresh (resize, font load).
            onRefreshInit: placeAtCluster,
          },
        });

        // 1. Icons travel from the cluster onto their slots.
        icons.forEach((icon, index) => {
          timeline.to(
            icon,
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              duration: 0.6,
              ease: "power3.inOut",
            },
            0.1 + index * 0.04
          );
        });

        // 2. The words reveal themselves once the icons have landed.
        timeline.to(
          words,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.5
        );
      });

      // Fonts change the line breaks, which moves the slots. Refresh once they load.
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} id="about" className="relative bg-background text-foreground">
      <div
        ref={stageRef}
        className="relative flex h-dvh min-h-120 flex-col justify-center gap-7 overflow-hidden px-6 py-16 md:gap-10 md:px-14 md:py-20"
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-accent uppercase">A little more about me</p>

        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 text-[clamp(1.35rem,5.2vw,3.2rem)] leading-snug font-semibold tracking-[-0.03em] md:leading-tight">
          {LINES.map((line, lineIndex) => (
            <p key={lineIndex}>
              {line.map((item, itemIndex) =>
                "text" in item ? (
                  <span key={itemIndex} data-text>
                    {item.text}{" "}
                  </span>
                ) : (
                  <span key={itemIndex} data-slot className={slotClass}>
                    <span
                      data-icon
                      className={`${tileClass} ${toneClass[item.segment.tone]}`}
                    >
                      <Icon name={item.segment.icon} className="size-[58%]" />
                    </span>
                  </span>
                )
              )}
            </p>
          ))}
        </div>

        <p className="text-sm text-muted-foreground flex right-0">Keep scrolling</p>
      </div>
    </section>
  );
}