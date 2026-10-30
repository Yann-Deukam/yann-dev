"use client";

import { useRef, type UIEvent } from "react";
import gsap from "gsap";
import { glass, glassHover } from "@/constants/styles";
import { ProjectCard } from "@/components/ProjectCard";
import { PROJECTS } from "@/constants/projectData";


const arrow = `${glass} ${glassHover} grid size-11 place-items-center rounded-full transition-all duration-300`;

/** Same alignment as the other sections' max-w-300 container, so cards line up with the header. */
const gutter = "max(1.5rem, calc((100vw - 75rem) / 2 + 1.5rem))";

/** Fixed header + a swipeable scroll-snap carousel: one project per screen on every breakpoint. */
export function Project() {
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const onScroll = (e: UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    const p = el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth);
    if (barRef.current) gsap.set(barRef.current, { scaleX: Math.min(1, Math.max(0, p)) });
  };

  const slide = (dir: 1 | -1) => {
    const track = trackRef.current;
    const [a, b] = Array.from(track?.children ?? []) as HTMLElement[];
    if (!track || !a || !b) return;
    track.scrollBy({ left: dir * (b.offsetLeft - a.offsetLeft), behavior: "smooth" });
  };

  return (
    <section
      id="projects"
      className="relative isolate overflow-hidden bg-background py-16 text-foreground sm:py-20 lg:flex lg:h-dvh lg:flex-col lg:py-0 lg:pt-28 dark:bg-surface-dark"
    >
      {/* Soft light behind the glass */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -left-24 -z-10 size-112 rounded-full bg-accent/15 blur-[120px] dark:bg-accent/25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] bottom-0 -z-10 size-128 rounded-full bg-primary/15 blur-[140px] dark:bg-primary/30"
      />

      {/* Fixed header */}
      <header className="mx-auto w-full max-w-300 px-6">
        <div className="flex items-end justify-between gap-6">
          <div className="lg:flex lg:items-end lg:gap-12">
            <h2 className="text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.04em] lg:text-[clamp(2.5rem,4.5vw,4.25rem)]">
              Things I&apos;ve built
            </h2>
            <p className="mt-4 max-w-xl text-foreground/70 lg:mt-0 lg:max-w-md lg:pb-1 lg:text-sm">
              A few projects I&apos;m proud of, from first sketch to production.
            </p>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => slide(-1)} aria-label="Previous project" className={arrow}>
              ←
            </button>
            <button type="button" onClick={() => slide(1)} aria-label="Next project" className={arrow}>
              →
            </button>
          </div>
        </div>

        <div className="mt-8 h-px bg-foreground/15 lg:mt-6" role="presentation">
          <div ref={barRef} className="h-full origin-left scale-x-0 bg-primary" />
        </div>
      </header>

      {/* Cards */}
      <ul
        ref={trackRef}
        onScroll={onScroll}
        aria-label="Projects"
        style={{ paddingInline: `var(--gutter)`, scrollPaddingInline: `var(--gutter)`, "--gutter": gutter } as React.CSSProperties}
        className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 scrollbar-none lg:mt-auto lg:mb-[6dvh] lg:gap-16 lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ul>
    </section>
  );
}