"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The interactive parts of the hero, for mouse users only: the lens and the
 * measurements, plus the scroll drift of the two headline blocks.
 *
 * The headline and footer entrances are CSS animations (see hero-keyframes.css),
 * so they never depend on this hook. Touch and reduced-motion visitors get no
 * script at all.
 */
export function useHeroAnimation(sectionRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const lens = section.querySelector<HTMLElement>("[data-lens]");
      const coords = section.querySelector<HTMLElement>("[data-coords]");
      if (!lens || !coords) return;

      // Each block exists in both layers, so one selector moves both together.
      const blocksLeft = gsap.utils.toArray<HTMLElement>('[data-block="left"]', section);
      const blocksRight = gsap.utils.toArray<HTMLElement>('[data-block="right"]', section);

      const mm = gsap.matchMedia();

      mm.add(
        {
          fine: "(hover: hover) and (pointer: fine)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { fine, reduce } = context.conditions as { fine: boolean; reduce: boolean };

          // Touch or reduced motion: nothing to do. The CSS entrance and the static layout are enough.
          if (!fine || reduce) return;

          /* ---------- Geometry ---------- */

          const headlineCenter = () => {
            const headline =
              section.querySelector<HTMLElement>('[data-layer="design"] [data-headline]') ?? section;
            const box = headline.getBoundingClientRect();
            const outer = section.getBoundingClientRect();
            return {
              x: box.left - outer.left + box.width / 2,
              y: box.top - outer.top + box.height / 2,
            };
          };

          const hoverRadius = () => gsap.utils.clamp(120, 240, window.innerWidth * 0.14);

          const measure = () => {
            section.querySelectorAll<HTMLElement>("[data-dim]").forEach((tag) => {
              const block = tag.parentElement;
              if (!block) return;
              tag.textContent = `${Math.round(block.offsetWidth)} × ${Math.round(block.offsetHeight)}`;
            });
          };

          /* ---------- Lens rendering ---------- */

          const pos = { x: 0, y: 0, r: 0 };
          let visible = true;
          let lastFrame = "";

          const render = () => {
            if (!visible) return;
            const frame = `${pos.x.toFixed(1)}|${pos.y.toFixed(1)}|${pos.r.toFixed(1)}`;
            if (frame === lastFrame) return;
            lastFrame = frame;

            section.style.setProperty("--lens-x", `${pos.x}px`);
            section.style.setProperty("--lens-y", `${pos.y}px`);
            section.style.setProperty("--lens-r", `${Math.max(pos.r, 0)}px`);
            coords.textContent = `${Math.round(pos.x)}, ${Math.round(pos.y)}`;
          };
          gsap.ticker.add(render);

          // Stop rendering while the hero is off screen.
          const visibility = ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              visible = self.isActive;
            },
          });

          /* ---------- Interaction: the lens follows the pointer ---------- */

          const client = { x: 0, y: 0 };
          const setX = gsap.quickTo(pos, "x", { duration: 0.8, ease: "power3.out" });
          const setY = gsap.quickTo(pos, "y", { duration: 0.8, ease: "power3.out" });
          let inside = false;
          let radius = 0;

          const follow = () => {
            const box = section.getBoundingClientRect();
            setX(client.x - box.left);
            setY(client.y - box.top);
          };

          const grow = (next: number) => {
            if (next === radius) return;
            radius = next;
            gsap.to(pos, {
              r: next,
              duration: next ? 0.8 : 0.5,
              ease: next ? "expo.out" : "power3.out",
              overwrite: "auto",
            });
          };

          // Before anyone moves a mouse, the lens opens once to show the idea.
          const peek = gsap.timeline({
            delay: 2.2,
            onStart: () => {
              const center = headlineCenter();
              const width = section.clientWidth;
              gsap.set(pos, { x: center.x - width * 0.2, y: center.y - 40 });
            },
          });
          peek
            .to(pos, { r: hoverRadius(), duration: 0.8, ease: "expo.out" })
            .to(
              pos,
              {
                x: headlineCenter().x + section.clientWidth * 0.2,
                y: headlineCenter().y + 40,
                duration: 2,
                ease: "sine.inOut",
              },
              "<0.2"
            )
            .to(pos, { r: 0, duration: 0.7, ease: "power3.inOut" }, "-=0.6");

          const onMove = (event: PointerEvent) => {
            peek.kill();
            client.x = event.clientX;
            client.y = event.clientY;

            // On entry, jump to the pointer so the lens opens where it is.
            if (!inside) {
              inside = true;
              const box = section.getBoundingClientRect();
              gsap.set(pos, { x: client.x - box.left, y: client.y - box.top });
            }
            follow();

            // Over a link or button the lens closes, so the control stays readable.
            const overControl = (event.target as Element).closest("a, button") !== null;
            grow(overControl ? 0 : hoverRadius());
          };

          const onLeave = () => {
            inside = false;
            grow(0);
          };

          // Scrolling moves the hero under a still pointer.
          const onScroll = () => {
            if (inside) follow();
          };

          section.addEventListener("pointermove", onMove);
          section.addEventListener("pointerleave", onLeave);
          window.addEventListener("scroll", onScroll, { passive: true });

          /* ---------- Measurements ---------- */

          document.fonts.ready.then(measure);
          const resizeObserver = new ResizeObserver(measure);
          resizeObserver.observe(section);

          /* ---------- Scroll: the two blocks drift apart ---------- */

          const scrub = {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          };
          gsap.to(blocksLeft, { xPercent: -10, ease: "none", scrollTrigger: scrub });
          gsap.to(blocksRight, { xPercent: 10, ease: "none", scrollTrigger: scrub });

          /* ---------- Cleanup ---------- */

          return () => {
            peek.kill();
            gsap.ticker.remove(render);
            visibility.kill();
            resizeObserver.disconnect();
            section.removeEventListener("pointermove", onMove);
            section.removeEventListener("pointerleave", onLeave);
            window.removeEventListener("scroll", onScroll);
            section.style.removeProperty("--lens-x");
            section.style.removeProperty("--lens-y");
            section.style.removeProperty("--lens-r");
          };
        }
      );
    },
    { scope: sectionRef }
  );
}