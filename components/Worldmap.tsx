"use client";

import { useEffect, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import { DESTINATION, GREETINGS, LonLat, MOBILE_ROUTES, ORIGINS } from "@/constants/contactData";


const W = 1000;
const H = 520;

/* ---- Static geometry, computed once at module load ---- */
const topology = world as unknown as Topology;
const countries = feature(topology, topology.objects.countries as GeometryCollection).features.filter(
  (f) => String(f.id) !== "010", // no Antarctica
);
const projection = geoNaturalEarth1().fitExtent([[10, 10], [W - 10, H - 10]], { type: "Sphere" });
const toPath = geoPath(projection);
const isCameroon = (id: unknown) => String(id) === "120";

const LAND_PATH = countries.filter((f) => !isCameroon(f.id)).map((f) => toPath(f)).join(" ");
const CAMEROON_PATH = toPath(countries.find((f) => isCameroon(f.id))!) ?? "";

const project = (c: LonLat) => projection(c) as [number, number];
const TARGET = project(DESTINATION.coords);

const ROUTES = ORIGINS.map((o, i) => {
  const [x0, y0] = project(o.coords);
  const lift = Math.hypot(TARGET[0] - x0, TARGET[1] - y0) * 0.28;
  return {
    name: o.name,
    from: [x0, y0] as const,
    d: `M${x0},${y0} Q${(x0 + TARGET[0]) / 2},${(y0 + TARGET[1]) / 2 - lift} ${TARGET[0]},${TARGET[1]}`,
    duration: 6 + (i % 3),
    delay: i * 0.9,
    mobileHidden: i >= MOBILE_ROUTES,
  };
});

type Props = {
  celebrate: boolean;
  onCelebrateChange: (value: boolean) => void;
};

export function WorldMap({ celebrate, onCelebrateChange }: Props) {
  const [greeting, setGreeting] = useState(0);
  const speed = celebrate ? 2.5 : 1;

  useEffect(() => {
    if (!celebrate) return;
    const id = setInterval(() => setGreeting((i) => (i + 1) % GREETINGS.length), 900);
    return () => clearInterval(id);
  }, [celebrate]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
      aria-label={`World map with routes arriving in ${DESTINATION.name}`}
    >
      <path d={LAND_PATH} className="fill-foreground/[0.07] stroke-foreground/15" strokeWidth={0.5} />
      <path
        d={CAMEROON_PATH}
        strokeWidth={0.8}
        className={`stroke-accent transition-colors duration-500 ${celebrate ? "fill-accent" : "fill-accent/50"}`}
      />

      {ROUTES.map((r) => (
        <g key={r.name} className={`group/city ${r.mobileHidden ? "max-sm:hidden" : ""}`}>
          {/* faint trail */}
          <path d={r.d} fill="none" className="stroke-primary/20" strokeWidth={0.8} />
          {/* moving comet */}
          <path
            d={r.d}
            pathLength={1}
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            className="animate-comet stroke-accent [stroke-dasharray:0.12_2] motion-reduce:hidden"
            style={{ animationDuration: `${r.duration / speed}s`, animationDelay: `${r.delay}s` }}
          />
          {/* origin dot + hover label */}
          <circle cx={r.from[0]} cy={r.from[1]} r={10} fill="transparent" />
          <circle
            cx={r.from[0]}
            cy={r.from[1]}
            r={2.4}
            className="fill-foreground transition-transform duration-200 transform-fill origin-center group-hover/city:scale-[2]"
          />
          <text
            x={r.from[0]}
            y={r.from[1] - 9}
            textAnchor="middle"
            className="pointer-events-none fill-foreground text-[11px] opacity-0 transition-opacity group-hover/city:opacity-100"
          >
            {r.name}
          </text>
        </g>
      ))}

      {/* Destination pin + easter egg */}
      <g
        tabIndex={0}
        role="button"
        aria-label={`${DESTINATION.name}, hover or tap for a surprise`}
        aria-pressed={celebrate}
        className="cursor-pointer outline-none"
        onPointerEnter={() => onCelebrateChange(true)}
        onPointerLeave={() => onCelebrateChange(false)}
        onFocus={() => onCelebrateChange(true)}
        onBlur={() => onCelebrateChange(false)}
        onClick={() => onCelebrateChange(!celebrate)}
      >
        <circle cx={TARGET[0]} cy={TARGET[1]} r={22} fill="transparent" />
        <circle
          cx={TARGET[0]}
          cy={TARGET[1]}
          r={22}
          fill="none"
          strokeWidth={1.2}
          className="animate-ring stroke-accent transform-fill origin-center motion-reduce:hidden"
        />
        {celebrate &&
          [0, 0.6, 1.2].map((delay) => (
            <circle
              key={delay}
              cx={TARGET[0]}
              cy={TARGET[1]}
              r={34}
              fill="none"
              strokeWidth={1.5}
              className="animate-burst stroke-foreground transform-fill origin-center motion-reduce:hidden"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        <circle cx={TARGET[0]} cy={TARGET[1]} r={4.5} strokeWidth={1.5} className="fill-accent stroke-background" />
        {celebrate && (
          <text
            key={greeting}
            x={TARGET[0]}
            y={TARGET[1] - 20}
            textAnchor="middle"
            className="animate-greeting pointer-events-none fill-foreground text-[15px] font-semibold"
          >
            {GREETINGS[greeting]} 🇨🇲
          </text>
        )}
      </g>
    </svg>
  );
}