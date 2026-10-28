"use client";

import { useRef, type UIEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ProjectCard } from "@/components/ProjectCard";
import { PROJECTS } from "@/constants/projectData";
import { glass, glassHover } from "@/constants/styles";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const arrow = `${glass} ${glassHover} grid size-11 place-items-center rounded-full transition-all duration-300`;

/**
 * Desktop (lg+): the section pins, the header stays put and page scroll drives the cards sideways.
 * Mobile/tablet (or reduced motion): a native swipeable scroll-snap carousel with arrow buttons.
 */
export function Project() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const setProgress = (p: number) => {
    if (barRef.current) gsap.set(barRef.current, { scaleX: Math.min(1, Math.max(0, p)) });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;
        const viewport = viewportRef.current!;
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        gsap.set(track, { overflowX: "visible", scrollSnapType: "none" });
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const onScroll = (e: UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    setProgress(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
  };

  const slide = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    track.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 20), behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative isolate overflow-hidden bg-background py-16 text-foreground sm:py-20 lg:flex lg:h-dvh lg:flex-col lg:py-0 lg:pt-8 dark:bg-surface-dark"
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
          <div className="lg:flex lg:items-end lg:gap-10">
            <h2 className="text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] lg:text-[clamp(1.75rem,3vw,2.75rem)] font-semibold tracking-[-0.04em]">
              Things I&apos;ve built
            </h2>
            <p className="mt-4 max-w-xl text-foreground/70 lg:mt-0 lg:max-w-md lg:pb-1 lg:text-sm">
              A few projects I&apos;m proud of, from first sketch to production.
            </p>
          </div>

          <div className="flex gap-3 lg:hidden">
            <button type="button" onClick={() => slide(-1)} aria-label="Previous project" className={arrow}>
              ←
            </button>
            <button type="button" onClick={() => slide(1)} aria-label="Next project" className={arrow}>
              →
            </button>
          </div>
        </div>

        <div className="mt-8 h-px bg-foreground/15 lg:mt-4" role="presentation">
          <div ref={barRef} className="h-full origin-left scale-x-0 bg-primary" />
        </div>
      </header>

      {/* Cards */}
      <div ref={viewportRef} className="mt-8 lg:mt-auto lg:mb-[3dvh] lg:overflow-hidden">
        <ul
          ref={trackRef}
          onScroll={onScroll}
          aria-label="Projects"
          className="flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pb-6 scrollbar-none lg:gap-6 lg:pb-0 lg:pr-6 lg:pl-[max(1.5rem,calc((100vw-75rem)/2+1.5rem))] [&::-webkit-scrollbar]:hidden"
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      </div>
    </section>
  );
}