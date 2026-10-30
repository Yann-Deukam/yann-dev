"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./providers/ThemeProvider";

gsap.registerPlugin(useGSAP);

/* ───────────── Data ───────────── */

const NAVIGATION = [
  { number: "01", label: "Home", href: "/#home" },
  { number: "02", label: "About", href: "/#about" },
  { number: "03", label: "Experience", href: "/#experience" },
  { number: "04", label: "Projects", href: "/#projects" },
  { number: "05", label: "Blog", href: "/#blog" },
  { number: "06", label: "Playground", href: "/#playground" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/Yann-Deukam" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/deukam-yann" },
  { label: "Email", href: "mailto:yanndeukam@gmail.com" },
];

/* ───────────── Config ───────────── */

const REVERSE_SPEED = 1.5;

const BURGER = {
  top: { x1: 3, y1: 7, x2: 17, y2: 7 },
  bottom: { x1: 3, y1: 13, x2: 17, y2: 13 },
};
const CROSS = {
  top: { x1: 5, y1: 5, x2: 15, y2: 15 },
  bottom: { x1: 5, y1: 15, x2: 15, y2: 5 },
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

/* ───────────── Shared class strings ───────────── */

  const glass =
  "border border-white/50 bg-white/30 backdrop-blur-md backdrop-saturate-150 " +
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_24px_rgba(26,0,80,0.10)] " +
  "dark:border-white/15 dark:bg-white/8 " +
  "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_12px_rgba(0,0,0,0.1)]";

  const iconButton =
  `${glass} grid size-11 mobile:size-10 shrink-0 cursor-pointer place-items-center rounded-full text-foreground transition duration-200 hover:scale-[1.04] hover:border-primary hover:bg-white/50 dark:hover:bg-white/15`;

const kicker =
  "mb-3.5 block text-[0.65rem] font-bold uppercase tracking-[0.13em] short:mb-2";

const panel =
  "menu-panel relative z-1 w-full max-w-[760px] shrink-0 rounded-sm border border-border";

/* ───────────── Component ───────────── */

export default function Navbar() {
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  const tl = useRef<gsap.core.Timeline | null>(null);
  const enterEnd = useRef(0);
  const isOpenRef = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

  /* ── Single timeline: enter → pause → exit ── */
  useGSAP(
    () => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      const q = gsap.utils.selector(overlay);
      const root = rootRef.current!;

      const backdrop = q(".menu-backdrop");
      const topPanel = q(".menu-top-panel");
      const middlePanel = q(".menu-middle-panel");
      const bottomPanel = q(".menu-bottom-panel");
      const panels = [...topPanel, ...middlePanel, ...bottomPanel];
      const items = q(".menu-item");
      const barTop = root.querySelector(".bar-top");
      const barBottom = root.querySelector(".bar-bottom");

      gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });

      const timeline = gsap.timeline({ paused: true });

      /* ═══ ENTER ═══ */
      timeline
        .set(overlay, { autoAlpha: 1, pointerEvents: "auto" })
        .to(
          backdrop,
          { autoAlpha: 1, duration: 0.35, ease: "power2.out", easeReverse: "power4.out" },
          0
        )
        .fromTo(
          topPanel,
          { x: "-105%", y: 0, rotation: 0 },
          { x: "0%", duration: 0.65, ease: "back.out(1.15)", easeReverse: "power3.in" },
          0
        )
        .fromTo(
          middlePanel,
          { x: "0%", y: "-35%", rotation: 0, autoAlpha: 0 },
          { y: "0%", autoAlpha: 1, duration: 0.6, ease: "power3.out", easeReverse: "power3.in" },
          0.1
        )
        .fromTo(
          bottomPanel,
          { x: "105%", y: 0, rotation: 0 },
          { x: "0%", duration: 0.6, ease: "back.out(1.1)", easeReverse: "power3.in" },
          0.12
        )
        .fromTo(
          items,
          { autoAlpha: 0, x: -18 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.045,
            ease: "power3.out",
            easeReverse: "power3.in",
          },
          0.25
        )
        .to(
          barTop,
          { attr: CROSS.top, duration: 0.35, ease: "back.out(1.4)", easeReverse: "power3.out" },
          0
        )
        .to(
          barBottom,
          { attr: CROSS.bottom, duration: 0.35, ease: "back.out(1.4)", easeReverse: "power3.out" },
          0
        )
        .addPause();

      enterEnd.current = timeline.duration();

      /* ═══ EXIT ═══ */
      timeline
        .addLabel("exit")
        .to(barTop, { attr: BURGER.top, duration: 0.25, ease: "power3.in" }, "exit")
        .to(barBottom, { attr: BURGER.bottom, duration: 0.25, ease: "power3.in" }, "exit")
        .to(
          panels,
          {
            y: "110vh",
            rotation: "random(-12, 12)",
            duration: 0.8,
            ease: "power3.in",
            stagger: { from: "end", each: 0.06 },
          },
          "exit"
        )
        .to(backdrop, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, "exit+=0.1")
        .set(overlay, { autoAlpha: 0, pointerEvents: "none" });

      tl.current = timeline;

      return () => {
        tl.current = null;
      };
    },
    { scope: rootRef }
  );

  /* ── Open / close ── */
  const setOpen = useCallback((next: boolean) => {
    const timeline = tl.current;
    if (!timeline || isOpenRef.current === next) return;

    isOpenRef.current = next;
    setIsOpen(next);

    const inEnterPhase = timeline.time() < enterEnd.current;

    if (next) {
      if (inEnterPhase) timeline.timeScale(1).play();
      else timeline.timeScale(1).restart();
    } else {
      if (inEnterPhase) timeline.timeScale(REVERSE_SPEED).reverse();
      else timeline.timeScale(1).play();
    }
  }, []);

  const toggleMenu = useCallback(() => setOpen(!isOpenRef.current), [setOpen]);

  const closeMenu = useCallback(() => {
    if (!isOpenRef.current) return;
    setOpen(false);
    menuButtonRef.current?.focus();
  }, [setOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeMenu]);

  /* ── Theme toggle with circular reveal ── */
  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const button = themeButtonRef.current;
    const doc = document as ViewTransitionDocument;

    if (!button || typeof doc.startViewTransition !== "function") {
      setTheme(nextTheme);
      return;
    }

    const rect = button.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--theme-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--theme-y", `${rect.top + rect.height / 2}px`);

    doc.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme));
    });
  };

  /* ───────────── Render ───────────── */
  return (
    <div ref={rootRef} className="relative z-300">
      {/* Top bar */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-310 flex items-center justify-between gap-5 px-[clamp(18px,4vw,56px)] py-4 mobile:px-4 mobile:py-3">
       <Link
  href="/#home"
  aria-label="Y. Deukam — Home"
  onClick={closeMenu}
  className={`${glass} pointer-events-auto inline-flex h-11 items-center gap-1 rounded-full pl-1.5 pr-5 no-underline transition duration-200 hover:border-primary mobile:h-10 mobile:pr-4`}
>
  <span className="grid size-8 place-items-center rounded-full bg-accent text-[0.95rem] font-extrabold leading-none text-white mobile:size-7">
    Y
  </span>
  <span className="text-[0.95rem] font-extrabold leading-none tracking-[-0.04em] text-foreground">
    <span className="text-accent"></span>DEUKAM<span className="text-accent">.</span>
  </span>
</Link>

        <div className="pointer-events-auto flex items-center gap-2.5">
          <button
            ref={themeButtonRef}
            type="button"
            onClick={handleThemeToggle}
            aria-label="Toggle color theme"
            title="Toggle theme"
            className={iconButton}
          >
            {mounted && theme === "dark" ? (
              <Sun size={19} strokeWidth={1.7} />
            ) : mounted ? (
              <Moon size={19} strokeWidth={1.7} />
            ) : (
              <span className="inline-block h-4.75 w-4.75" aria-hidden="true" />
            )}
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="portfolio-navigation"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className={`${iconButton} relative z-320`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="block overflow-visible"
            >
              <line className="bar-top" {...BURGER.top} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line className="bar-bottom" {...BURGER.bottom} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Overlay */}
      <nav
        ref={overlayRef}
        id="portfolio-navigation"
        aria-label="Main navigation"
        className="pointer-events-none invisible fixed inset-0 z-200 flex h-dvh flex-col items-end gap-1.5 overflow-hidden overscroll-contain px-[clamp(12px,3vw,36px)] pb-3 pt-19 opacity-0 min-[900px]:pr-[clamp(24px,5vw,72px)] short:gap-1.25 short:pb-2 short:pt-17 mobile:gap-1.5 mobile:px-2.5 mobile:pb-2.5 mobile:pt-16"
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          tabIndex={-1}
          onClick={closeMenu}
          className="menu-backdrop fixed inset-0 z-0 size-full cursor-default border-0 bg-overlay opacity-0"
        />

        {/* Top panel */}
        <section
          className={`${panel} menu-top-panel flex min-h-72.5 flex-[1_0_auto] flex-col bg-panel p-[clamp(20px,3vh,32px)] text-foreground short:min-h-60 short:px-6 short:py-4 mobile:min-h-66.25 mobile:p-5`}
        >
          <ul className="m-0 flex flex-1 list-none flex-col justify-center p-0">
            {NAVIGATION.map((item) => (
              <li key={item.number} className="menu-item overflow-hidden border-b border-border">
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="group grid grid-cols-[32px_1fr_auto] items-center gap-3 py-2.25 text-[clamp(1.35rem,3.3vh,2.15rem)] font-bold leading-[1.12] tracking-[-0.045em] text-foreground no-underline transition-colors duration-180 hover:text-primary short:py-1.75 short:text-[clamp(1.15rem,3.2vh,1.65rem)] mobile:text-[clamp(1.3rem,3.5vh,1.8rem)]"
                >
                  <span className="text-[0.66rem] font-medium tracking-normal text-muted-foreground">
                    {item.number}
                  </span>
                  <span>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className="-translate-x-1.25 translate-y-1.25 text-accent opacity-0 transition duration-180 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-2 pt-3.5 text-[0.78rem] text-muted-foreground short:mt-2.5 short:pt-2.5 tiny:text-[0.7rem]">
            <span>Have a project in mind?</span>
            <Link href="/#contact" onClick={closeMenu} className="font-bold text-primary no-underline">
              Let&apos;s talk ↗
            </Link>
          </div>
        </section>

        {/* Middle panel */}
        <section
          className={`${panel} menu-middle-panel flex min-h-38.75 flex-col justify-center border-[#6B35D4] bg-[linear-gradient(125deg,#7B2FFF_0%,#4A0EBF_100%)] p-[clamp(20px,3vh,30px)] text-white short:min-h-31.25 short:px-6 short:py-3.75 mobile:min-h-36.25 mobile:p-5`}
        >
          <span className="mb-2.5 block text-[0.65rem] font-bold uppercase tracking-[0.13em] text-white/70">
            Currently exploring
          </span>

          <h2 className="m-0 text-[clamp(1.8rem,4vh,3rem)] font-extrabold leading-[0.98] tracking-[-0.065em] short:text-[clamp(1.5rem,3.8vh,2.3rem)]">
            Engineering
            <br />
            <span className="font-normal italic">meets creativity.</span>
          </h2>

          <p className="mt-2.5 max-w-105 text-[0.82rem] leading-[1.45] text-white/80 short:mt-1.5 short:text-[0.76rem]">
            Software, thoughtful interfaces, and digital experiences built with intention.
          </p>

          <div className="mt-3.5 flex flex-wrap gap-1.5 short:mt-2">
            {["ENGINEERING", "DEVELOPMENT", "CREATIVE"].map((tag) => (
              <span
                key={tag}
                className="border border-white/30 px-2 py-1.25 text-[0.58rem] font-bold tracking-[0.06em]"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Bottom panel */}
        <section
          className={`${panel} menu-bottom-panel flex min-h-16 flex-wrap items-center justify-between gap-3 border-surface-dark bg-surface-dark px-5.5 py-4 text-surface-dark-text short:min-h-13 short:px-5 short:py-2.5 mobile:min-h-16 mobile:px-4.5 mobile:py-3.5`}
        >
          <span className="text-[0.58rem] font-bold tracking-[0.06em] text-[#C7B4E8]">
            © 2026 DEUKAM
          </span>

          <div className="flex flex-wrap gap-3.5 tiny:gap-2.5">
            {SOCIAL_LINKS.map((link) => {
              const external = link.href.startsWith("http");
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="text-[0.72rem] text-surface-dark-text no-underline transition-colors duration-180 hover:text-accent tiny:text-[0.67rem]"
                >
                  {link.label} ↗
                </a>
              );
            })}
          </div>

          <span className="text-[0.58rem] font-bold tracking-[0.06em] text-[#C7B4E8] mobile:hidden">
            BUILT WITH INTENTION.
          </span>
        </section>
      </nav>
    </div>
  );
}