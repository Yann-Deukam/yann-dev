"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---------- Edit these ---------- */
const NAME = "Deukam";
const EMAIL = "you@example.com";
const ROLES = ["Frontend Developer", "Creative Developer", "UI/UX"];

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/your-handle",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "X",
    href: "https://x.com/your-handle",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
  {
    label: "GitHub",
    href: "https://github.com/your-handle",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
];

/* Light: white panel + purple-tinted border (same as the Stack pills).
   Dark: the frosted white glass from before. */
const glass =
  "border border-border bg-panel/70 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] dark:border-white/10 dark:bg-white/5 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]";

/* Light: fills purple on hover like the Stack pills. */
const glassHover =
  "hover:border-primary hover:bg-primary hover:text-primary-foreground dark:hover:border-white/25 dark:hover:bg-white/15 dark:hover:text-foreground";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from("[data-letter]", {
        yPercent: 115,
        duration: 1.3,
        ease: "power4.out",
        delay: (_, el) => Number((el as HTMLElement).dataset.letter) * 0.07,
        scrollTrigger: {
          trigger: nameRef.current,
          start: "top 100%",
          once: true,
        },
      });
    },
    { scope: footerRef }
  );

  const onMove = contextSafe((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    gsap.to(glowRef.current, {
      "--mx": `${e.clientX - rect.left}px`,
      "--my": `${e.clientY - rect.top}px`,
      opacity: 1,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  });

  const onLeave = contextSafe(() => {
    gsap.to(glowRef.current, { opacity: 0, duration: 0.6, overwrite: "auto" });
  });

  const hop = contextSafe((i: number) => {
    gsap.to(`[data-letter="${i}"]`, {
      yPercent: -9,
      duration: 0.25,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      overwrite: "auto",
    });
  });

  const letters = NAME.split("");

  return (
    <footer
      ref={footerRef}
      className="relative isolate overflow-hidden bg-background pt-20 text-foreground md:pt-28 dark:bg-surface-dark"
    >
      {/* Soft light behind the glass */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[8%] -z-10 size-112 rounded-full bg-accent/15 blur-[120px] dark:bg-accent/25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 right-[6%] -z-10 size-128 rounded-full bg-primary/15 blur-[140px] dark:bg-primary/30"
      />

      {/* Glass card */}
      <div className="mx-auto max-w-300 px-6">
        <div className={`${glass} rounded-3xl`}>
          <div className="grid gap-10 p-8 md:grid-cols-[1.2fr_1fr] md:gap-0 md:p-12">
            {/* Left */}
            <div className="md:pr-12">
              <p
                className={`${glass} mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[0.7rem] font-bold tracking-[0.12em] text-muted-foreground dark:font-medium dark:text-foreground/80`}
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                AVAILABLE FOR NEW PROJECTS
              </p>

              <h2 className="text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
                Got an idea?
                <br />
                <span className="text-primary dark:text-foreground/50">
                  Let&apos;s build it.
                </span>
              </h2>

              <a
                href={`mailto:${EMAIL}`}
                className="mt-8 inline-block text-lg text-muted-foreground transition-colors hover:text-primary dark:text-foreground/70 dark:hover:text-foreground"
              >
                {EMAIL}
              </a>
            </div>

            {/* Right */}
            <div className="flex flex-col md:border-l md:border-border md:pl-12 dark:md:border-white/10">
              <p className="mb-4 text-xs font-bold tracking-[0.14em] text-muted-foreground dark:font-medium dark:text-foreground/50">
                SOCIALS
              </p>

              <div className="flex gap-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`${glass} ${glassHover} grid size-11 place-items-center rounded-full text-foreground transition-all duration-300 hover:-translate-y-0.5 dark:text-foreground/80`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-[1.1rem] fill-current"
                      aria-hidden
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>

              <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-foreground/70">
                {ROLES.map((role, i) => (
                  <span key={role} className="inline-flex items-center gap-3">
                    {i > 0 && (
                      <span className="size-1 rounded-full bg-foreground/30" />
                    )}
                    {role}
                  </span>
                ))}
              </p>

              <a
                href={`mailto:${EMAIL}`}
                className={`${glass} ${glassHover} group mt-8 inline-flex w-fit items-center gap-3 rounded-full py-2 pr-2 pl-6 text-sm font-medium transition-all duration-300`}
              >
                Let&apos;s Talk
                <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-accent group-hover:text-accent-foreground dark:bg-foreground dark:text-surface-dark dark:group-hover:bg-foreground dark:group-hover:text-surface-dark">
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between border-t border-border px-8 py-5 text-[0.65rem] font-bold tracking-[0.14em] text-muted-foreground md:px-12 dark:border-white/10 dark:font-medium dark:text-foreground/50">
            <span>
              © {year ?? ""} {NAME.toUpperCase()}
            </span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 transition-colors hover:text-primary dark:hover:text-foreground"
            >
              BACK TO TOP <span aria-hidden>↑</span>
            </button>
          </div>
        </div>
      </div>

      {/* Giant name */}
      <div
        ref={nameRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        aria-hidden
        className="relative mb-[-0.3em] mt-10 text-[21vw] leading-none font-black tracking-[-0.06em] select-none md:mt-16"
      >
        <div className="flex justify-center whitespace-nowrap">
          {letters.map((char, i) => (
            <span
              key={i}
              data-letter={i}
              onPointerEnter={() => hop(i)}
              className="inline-block cursor-default bg-linear-to-b from-foreground/40 to-foreground/5 bg-clip-text text-transparent will-change-transform"
            >
              {char}
            </span>
          ))}
        </div>

        <div
          ref={glowRef}
          style={{ "--mx": "-999px", "--my": "-999px" } as React.CSSProperties}
          className="pointer-events-none absolute inset-0 flex justify-center whitespace-nowrap opacity-0 [-webkit-mask-image:radial-gradient(300px_circle_at_var(--mx)_var(--my),#000,transparent)] mask-[radial-gradient(300px_circle_at_var(--mx)_var(--my),#000,transparent)]"
        >
          {letters.map((char, i) => (
            <span
              key={i}
              data-letter={i}
              className="inline-block bg-linear-to-b from-accent via-primary to-primary/20 bg-clip-text text-transparent will-change-transform"
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}