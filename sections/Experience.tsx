"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { glass } from "@/constants/styles";
import { EXPERIENCE } from "./experience";
import Icon from "@/components/Icon";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Experience() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      // Motion is optional. Without it, the cards sit in place.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Cards slide in from alternating sides as they scroll into view.
        gsap.utils.toArray<HTMLElement>("[data-exp-item]", root).forEach((item, index) => {
          const direction = index % 2 === 0 ? -1 : 1;

          gsap.fromTo(
            item,
            { x: direction * 48 },
            {
              x: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 92%",
                end: "top 60%",
                scrub: 0.6,
              },
            }
          );
        });

        // Icon nodes grow from the rail as their card arrives.
        gsap.utils.toArray<HTMLElement>("[data-exp-node]", root).forEach((node) => {
          gsap.fromTo(
            node,
            { scale: 0.5 },
            {
              scale: 1,
              ease: "back.out(1.6)",
              scrollTrigger: {
                trigger: node,
                start: "top 92%",
                end: "top 65%",
                scrub: 0.6,
              },
            }
          );
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      id="experience"
      className="relative overflow-hidden bg-background px-6 py-24 text-foreground md:px-14 md:py-32"
    >
      <div className="mx-auto flex max-w-300 flex-col gap-14">
        <header className="flex max-w-2xl flex-col gap-4">
          <p className="text-xs font-semibold tracking-[0.3em] text-accent uppercase">Experience</p>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
            Where I&apos;ve been building
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Freelance work, formal study, and the stack I use day to day.
          </p>
        </header>

        <ol className="relative flex flex-col gap-8 before:absolute before:top-6 before:bottom-6 before:left-5.25 before:w-px before:bg-border md:gap-10 md:before:left-6.75">
          {EXPERIENCE.map((item) => (
            <li key={item.id} data-exp-item className="relative pl-16 md:pl-22">
              <span
                data-exp-node
                className={`${glass} absolute top-0 left-0 grid size-11 place-items-center rounded-2xl text-primary md:size-14`}
              >
                <Icon name={item.icon} className="size-5 md:size-6" />
              </span>

              <article className={`${glass} flex flex-col gap-5 rounded-3xl p-6 md:p-8`}>
                <header className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-semibold tracking-[-0.02em] md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.organisation}</p>
                  </div>
                  <p className="rounded-full border border-border px-3 py-1 text-xs font-semibold tracking-[0.15em] text-accent uppercase dark:border-white/10">
                    {item.period}
                  </p>
                </header>

                <p className="leading-relaxed text-muted-foreground">{item.summary}</p>

                <ul className="flex flex-col gap-2 text-sm text-foreground/85">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}