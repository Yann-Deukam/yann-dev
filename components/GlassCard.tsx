"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";

/** Glass panel with a subtle pointer-following highlight. */
export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const track = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      onPointerMove={track}
      style={{ "--mx": "50%", "--my": "0%" } as CSSProperties}
      className={`group/glass relative overflow-hidden rounded-3xl border border-border bg-panel/70 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] dark:border-white/10 dark:bg-white/5 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] ${className}`}
    >
      <div
  aria-hidden
  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/glass:opacity-100
    bg-[radial-gradient(380px_circle_at_var(--mx)_var(--my),color-mix(in_oklab,var(--primary)_10%,transparent),transparent_65%)]
    dark:bg-[radial-gradient(380px_circle_at_var(--mx)_var(--my),rgb(255_255_255/0.14),transparent_65%)]"
/>
      <div className="relative">{children}</div>
    </div>
  );
}