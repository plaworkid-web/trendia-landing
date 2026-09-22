"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Isometric stroke illustrations for the two service cards.
 *
 * Replaces the flat lucide glyphs (`Server`, `BrainCircuit`) on the homepage's
 * "Two Services" section. A 24px line icon said "server" and "brain" and nothing
 * else; the two products are the whole point of the section, so each card now
 * carries a drawing of what it sells.
 *
 * Drawn as SVG strokes rather than WebGL: three.js is ~600KB across three packages
 * and this is a 64px decorative slot, so a real 3D runtime would cost more than the
 * page it decorates. Isometric projection is geometry, not a rendering engine — the
 * same shapes are computed here from one axis ratio, which also keeps them crisp at
 * any size.
 *
 * Depth comes from CSS 3D: the illustration tilts toward the pointer, and the halo
 * sits behind on the Z axis, so the flat SVG reads as a solid object. Every
 * animation is disabled under `prefers-reduced-motion`; the shape still renders,
 * it just stops moving.
 *
 * The card's own layout is unchanged: this fills the slot the icon occupied.
 */

export type ServiceKind = "vps" | "ai";

/** Vertical squash of a 2:1 isometric projection (30 degrees from horizontal). */
const ISO = 0.5;

type Point = readonly [number, number];

const at = (p: Point, dy = 0) => `${p[0]} ${p[1] + dy}`;

/**
 * The three visible faces of an isometric box.
 *
 * A box seen isometrically shows exactly three faces: the top rhombus and the two
 * sides below it. Computed from a centre and a size so the stack lines up by
 * construction — hand-written coordinates drift apart as soon as one number moves.
 */
function isoBox(cx: number, cyTop: number, s: number, h: number) {
  const north: Point = [cx, cyTop - s * ISO];
  const east: Point = [cx + s, cyTop];
  const south: Point = [cx, cyTop + s * ISO];
  const west: Point = [cx - s, cyTop];
  return {
    top: `M ${at(north)} L ${at(east)} L ${at(south)} L ${at(west)} Z`,
    left: `M ${at(west)} L ${at(south)} L ${at(south, h)} L ${at(west, h)} Z`,
    right: `M ${at(south)} L ${at(east)} L ${at(east, h)} L ${at(south, h)} Z`,
  };
}

/** A node drawn as a flat rhombus, so it reads as sitting on the isometric plane. */
function isoDiamond(cx: number, cy: number, s: number) {
  const h = s * ISO;
  return `M ${cx} ${cy - h} L ${cx + s} ${cy} L ${cx} ${cy + h} L ${cx - s} ${cy} Z`;
}

// --- VPS: a stack of three servers with a live uplink -------------------------

const VPS_S = 9;
const VPS_H = 5;
const VPS_GAP = 2;
/** Distance between successive rhombus centres: body + full rhombus + gap. */
const VPS_STEP = VPS_H + VPS_S * 2 * ISO + VPS_GAP;
/** Top margin leaves room for the uplink line above the stack. */
const VPS_CY0 = 12 + VPS_S * ISO;

const VPS_BOXES = [0, 1, 2].map((i) => isoBox(32, VPS_CY0 + i * VPS_STEP, VPS_S, VPS_H));

// --- AI: a three-layer network on an isometric plane -------------------------

const AI_S = 2.6;

/** Layer i, node j. Each layer steps right and down, which is what makes it isometric. */
const AI_NODES: Point[][] = [0, 1, 2].map((i) =>
  [0, 1, 2].map((j) => [10 + i * 22, 18 + j * 12 + i * 9] as Point),
);

const AI_EDGES: Array<[Point, Point]> = [];
for (let i = 0; i < AI_NODES.length - 1; i += 1) {
  for (const from of AI_NODES[i]) {
    for (const to of AI_NODES[i + 1]) {
      AI_EDGES.push([from, to]);
    }
  }
}

/** Edges that carry the travelling pulse; the rest are static wiring. */
const AI_FLOW = AI_EDGES.filter((_, index) => index % 5 === 0);

function VpsShape() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="size-full" aria-hidden="true" focusable="false">
      {/* Uplink: dashes travel up the line, so the stack reads as live. */}
      <line
        x1="32"
        y1="11"
        x2="32"
        y2="1"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 4"
        className="iso-flow opacity-60"
      />
      <circle cx="32" cy="6" r="1.4" fill="currentColor" className="iso-pulse" />

      {VPS_BOXES.map((box, i) => (
        <g key={i} className="iso-fade" style={{ animationDelay: `${i * 110}ms` }}>
          {/* Faces carry a faint fill as well as the stroke: three outlines alone
              read as a flat wireframe, and the shading is what says "solid". */}
          <path d={box.top} fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" pathLength={1} className="iso-draw" style={{ animationDelay: `${i * 110}ms` }} />
          <path d={box.left} fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" pathLength={1} className="iso-draw" style={{ animationDelay: `${i * 110 + 70}ms` }} />
          <path d={box.right} fill="currentColor" fillOpacity="0.11" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" pathLength={1} className="iso-draw" style={{ animationDelay: `${i * 110 + 140}ms` }} />
          {/* Activity light on the front-left face. */}
          <circle cx={32 - VPS_S + 3} cy={VPS_CY0 + i * VPS_STEP + VPS_H / 2 + 1} r="1.1" fill="currentColor" className="iso-pulse" style={{ animationDelay: `${i * 220}ms` }} />
        </g>
      ))}
    </svg>
  );
}

function AiShape() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="size-full" aria-hidden="true" focusable="false">
      {/* Wiring first, so nodes sit on top of it.
          `strokeOpacity` and not `opacity`: the `iso-fade` animation drives
          `opacity`, and an animation beats a class, so `opacity-20` here would be
          overridden to 1 and the wiring would render as heavy as the nodes. */}
      <g className="iso-fade">
        {AI_EDGES.map(([from, to], i) => (
          <line
            key={i}
            x1={from[0]}
            y1={from[1]}
            x2={to[0]}
            y2={to[1]}
            stroke="currentColor"
            strokeWidth="0.6"
            strokeOpacity="0.2"
          />
        ))}
      </g>

      {/* A few connections carry a signal, which is what makes it a network rather
          than a diagram. */}
      <g className="iso-fade" style={{ animationDelay: "200ms" }}>
        {AI_FLOW.map(([from, to], i) => (
          <line
            key={i}
            x1={from[0]}
            y1={from[1]}
            x2={to[0]}
            y2={to[1]}
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="3 6"
            className="iso-flow"
            style={{ animationDelay: `${i * 300}ms` }}
          />
        ))}
      </g>

      <g className="iso-fade" style={{ animationDelay: "120ms" }}>
        {AI_NODES.map((layer, i) =>
          layer.map((node, j) => {
            const delay = i * 110 + j * 70;
            return (
              <path
                key={`${i}-${j}`}
                d={isoDiamond(node[0], node[1], AI_S)}
                fill="currentColor"
                fillOpacity="0.85"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinejoin="round"
                pathLength={1}
                /* One element, one `animation` declaration: `iso-draw` and
                   `iso-pulse` set the same property, so two classes would fight
                   and only the later one in the stylesheet would win. */
                className="iso-node"
                style={{ animationDelay: `${delay}ms, ${delay + 700}ms` }}
              />
            );
          }),
        )}
      </g>
    </svg>
  );
}

export function ServiceIllustration({
  kind,
  className,
}: {
  kind: ServiceKind;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    // Normalised to -1..1 from the centre, so the tilt does not depend on the
    // rendered size of the slot.
    setTilt({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  return (
    <span
      data-slot="service-illustration"
      data-kind={kind}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn(
        "relative flex size-24 items-center justify-center rounded-3xl bg-primary/10 text-primary [perspective:520px]",
        className,
      )}
    >
      {/* Halo sits behind the shape and moves least, which is what sells the depth. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl bg-primary/20 blur-xl [transform:translateZ(-18px)]"
      />
      {/* Two elements on purpose: `iso-float` animates `transform`, and a CSS
          animation overrides an inline `transform`. Bobbing and tilting on the
          same node would cancel the tilt. */}
      <span className="iso-float block size-[76px]">
        <span
          className="block size-full [transform-style:preserve-3d] transition-transform duration-150 ease-out"
          style={{ transform: `rotateY(${tilt.x * 16}deg) rotateX(${-tilt.y * 16}deg)` }}
        >
          {kind === "vps" ? <VpsShape /> : <AiShape />}
        </span>
      </span>
    </span>
  );
}
