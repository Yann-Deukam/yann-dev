"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Observer, useGSAP);

const stacks = [
  {
    label: "01 / FRONTEND",
    direction: 1,
    technologies: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "GSAP", "Angular"],
  },
  {
    label: "02 / BACKEND & DATA",
    direction: -1,
    technologies: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Supabase", "REST APIs", "Prisma"],
  },
  {
    label: "03 / TOOLS & DESIGN",
    direction: 1,
    technologies: ["Git", "Docker", "Figma", "UI/UX", "WordPress", "React Native", "Three.js"],
  },
];

export default function Stack() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const rails = railRefs.current.filter(
        (rail): rail is HTMLDivElement => rail !== null
      );
      if (!rails.length) return;

      const loops: gsap.core.Tween[] = [];
      const baseSpeeds: number[] = [];

      rails.forEach((rail, index) => {
        const firstCopy = rail.querySelector<HTMLElement>("[data-stack-group]");
        if (!firstCopy) return;

        const copyWidth = firstCopy.getBoundingClientRect().width;
        if (!copyWidth) return;

        const baseSpeed = stacks[index].direction * 0.8;
        baseSpeeds[index] = baseSpeed;

        const loop = gsap.to(rail, {
          xPercent: -50,
          duration: copyWidth / 80,
          ease: "none",
          repeat: -1,
        });

        // Start deep in the timeline so it can also run in reverse.
        loop.totalTime(loop.duration() * 1000);
        loop.timeScale(baseSpeed);

        loops[index] = loop;
      });

      const observer = Observer.create({
        target: window,
        type: "wheel,touch",
        onChangeY(self) {
          const scrollDirection = self.deltaY < 0 ? -1 : 1;

          loops.forEach((loop, index) => {
            if (!loop) return;

            const baseSpeed = baseSpeeds[index];
            const boosted =
              Math.abs(baseSpeed) * 3.5 * scrollDirection * Math.sign(baseSpeed);

            gsap.killTweensOf(loop);

            gsap
              .timeline()
              .to(loop, { timeScale: boosted, duration: 0.2, ease: "power2.out" })
              .to(loop, { timeScale: baseSpeed, duration: 0.9, ease: "power2.out" });
          });
        },
      });

      return () => {
        observer.kill();
        loops.forEach((loop) => {
          gsap.killTweensOf(loop);
          loop.kill();
        });
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="stack-heading"
      className="relative overflow-hidden bg-background py-16 text-foreground md:pt-24 md:pb-16 [--gutter:max(1.5rem,calc((100vw-1200px)/2))]"
    >
      {/* Intro */}
      <header className="mx-auto mb-10 max-w-300 px-6 md:mb-16">
        <p className="mb-5 inline-flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.14em] text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          THE TOOLS BEHIND THE WORK
        </p>

        <h2
          id="stack-heading"
          className="text-[clamp(2.5rem,7vw,5.5rem)] leading-none font-bold tracking-[-0.04em]"
        >
          My creative <span className="text-primary">stack.</span>
        </h2>

        <p className="mt-6 max-w-136 text-[1.05rem] leading-relaxed text-muted-foreground">
          A growing toolkit for building thoughtful digital experiences, from
          the first sketch to the final deployment.
        </p>
      </header>

      {/* Marquee */}
      <div className="flex w-full flex-col">
        {stacks.map((stack, index) => (
          <div
            key={stack.label}
            className="grid min-w-0 grid-cols-1 items-center gap-4 border-t border-border py-5 last:border-b md:grid-cols-[max-content_minmax(0,1fr)] md:gap-0 md:py-6"
          >
            <div className="relative z-10 px-6 text-[0.65rem] font-bold tracking-widest whitespace-nowrap text-muted-foreground md:pr-8 md:pl-(--gutter)">
              {stack.label}
            </div>

            <div className="relative min-w-0 overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)] mask-[linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)]">
              <div
                ref={(element) => {
                  railRefs.current[index] = element;
                }}
                className="flex w-max items-center will-change-transform"
              >
                {[0, 1].map((copy) => (
                  <div
                    key={copy}
                    data-stack-group
                    aria-hidden={copy === 1}
                    className="flex flex-none items-center"
                  >
                    {stack.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="group mr-4 inline-flex flex-none items-center gap-3 rounded-full border border-border bg-panel px-6 py-3.5 text-[clamp(1rem,2.2vw,1.5rem)] font-medium tracking-[-0.01em] whitespace-nowrap text-foreground transition-colors duration-250 hover:border-primary hover:bg-muted"
                      >
                        <span className="size-2 rotate-45 rounded-xs bg-muted-foreground/50 transition-colors duration-250 group-hover:bg-accent" />
                        {technology}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footnote */}
      {/* <p className="mx-auto mt-10 flex max-w-300 items-center gap-4 px-6 text-[0.65rem] font-bold tracking-[0.14em] text-muted-foreground">
        <span>SCROLL</span>
        <span className="h-px w-12 bg-border" />
        <span>CHANGE THE PACE</span>
      </p> */}
    </section>
  );
}