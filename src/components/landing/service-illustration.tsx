"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Isometric wireframe illustrations for the two service cards.
 *
 * Modelled on the Linear homepage's figure cards, measured from the live page: the
 * drawing occupies ~72% of its card's width, the strokes are thin monochrome
 * outlines with no fills, and the ink fades along its own length rather than
 * sitting inside a coloured panel.
 *
 * Four changes from the previous version, each from that reference:
 *
 *  * The coloured box and its halo are gone. A blue panel competes with the
 *    artwork; the reference lets the lines carry it alone.
 *  * The faces are outlines, not fills. Filled faces read as solid models, and a
 *    pure wireframe is what makes the reference look technical.
 *  * The ink fades to transparent along the drawing (bright at the top, gone at
 *    the bottom) via an SVG gradient on the stroke, which is what the reference
 *    does. A mask on the container was the first attempt and it was wrong twice
 *    over: it clipped the drawing at the edges instead of shading it, and a
 *    gradient that reaches transparent inside a tight box erases the object.
 *  * The viewBox is computed from the drawing's own bounds, so the figure fills
 *    the space it is given. Previously a fixed 64x64 viewBox held a stack only
 *    ~28% as wide as its box, which is why the illustration read as a small icon
 *    no matter how large the container was.
 *
 * Still SVG strokes rather than WebGL: three.js is ~600KB across three packages
 * for a decorative figure. Isometric projection is geometry, not a rendering
 * engine — the shapes are computed from one axis ratio, so they stay aligned by
 * construction and crisp at any size.
 *
 * The drawing is monochrome and inherits `currentColor`, so it is white on the
 * dark theme (the requested look) and dark ink on the light theme, where a white
 * line would be invisible. Both themes are real here.
 */

export type ServiceKind = "vps" | "ai";

/** Vertical squash of a 2:1 isometric projection (30 degrees from horizontal). */
const ISO = 0.5;

type Point = readonly [number, number];

/**
 * The three visible faces of an isometric box, plus the shared vertical edge.
 *
 * A box seen isometrically shows exactly three faces: the top rhombus and the two
 * sides below it. Computed from a centre and a size so a cluster lines up by
 * construction — hand-written coordinates drift apart as soon as one number moves.
 *
 * The vertical edge is returned separately: a filled box can hide it, but a
 * wireframe that omits it reads as two detached planes rather than one solid.
 */
function isoBox(cx: number, cyTop: number, s: number, h: number) {
  const north: Point = [cx, cyTop - s * ISO];
  const east: Point = [cx + s, cyTop];
  const south: Point = [cx, cyTop + s * ISO];
  const west: Point = [cx - s, cyTop];
  // The three bottom corners. Each is the corner above it moved straight down:
  // the vertical edges are what make the outline read as a solid rather than a
  // flat hexagon.
  const southDown: Point = [south[0], south[1] + h];
  const eastDown: Point = [east[0], east[1] + h];
  const westDown: Point = [west[0], west[1] + h];
  const path = (pts: Point[]) => `M ${pts.map((p) => `${p[0]} ${p[1]}`).join(" L ")} Z`;
  return {
    top: path([north, east, south, west]),
    left: path([west, south, southDown, westDown]),
    right: path([south, east, eastDown, southDown]),
    /** The vertical edge where the two side faces meet. A filled box can hide it;
     *  a wireframe that omits it reads as two detached planes. */
    edge: `M ${south[0]} ${south[1]} L ${southDown[0]} ${southDown[1]}`,
    /** Every corner, so the caller can compute the drawing's true bounds. */
    corners: [north, east, south, west, southDown, eastDown, westDown],
  };
}

// --- VPS: a single server tower, seen isometrically ---------------------------

/**
 * One tall server unit, not a grid of small boxes.
 *
 * The previous version was six identical cubes in a 3x2 grid, which read as "some
 * boxes" rather than as a server. A tower has a silhouette a server actually has:
 * one tall chassis, three bay slots down the front face, activity LEDs beside each
 * bay, and a single uplink leaving the top.
 *
 * Drawn as one chassis plus three bays rather than four separate boxes: stacked
 * boxes share no edges, so the outline breaks apart and it stops reading as one
 * object. The chassis carries the silhouette; the bays are inset panels on it.
 */
const VPS_W = 13;
const VPS_TOP = 15;
const VPS_BODY_H = 34;
const VPS_BAY_H = 5.5;
const VPS_BAY_GAP = 2.6;
const VPS_UPLINK_TOP = 4;

/** The chassis: one box, drawn as its three visible faces. */
const VPS_CHASSIS = isoBox(32, VPS_TOP, VPS_W, VPS_BODY_H);

/** Bay slots: shallow insets on the front-right face, each with an LED. */
const VPS_BAYS = [0, 1, 2].map((i) => {
  const yTop = VPS_TOP + 5 + i * (VPS_BAY_H + VPS_BAY_GAP);
  // The front-right face is a parallelogram; a slot on it is the same shape,
  // inset from the face's own edges so it sits ON the face rather than over it.
  const right = VPS_W;
  return {
    d: `M ${32 + 3} ${yTop} L ${32 + right - 2} ${yTop + (right - 5) * ISO} L ${32 + right - 2} ${yTop + VPS_BAY_H + (right - 5) * ISO} L ${32 + 3} ${yTop + VPS_BAY_H} Z`,
    ledX: 32 + 5.5,
    ledY: yTop + 2 + (right - 5) * ISO * 0.5,
  };
});

// --- AI: a volumetric node lattice, stacked in depth --------------------------

/**
 * A 3x3 lattice repeated on three isometric planes, stacked vertically.
 *
 * The previous version was a flat 4x4 grid of diamonds on one plane, which read as
 * a flat diagram: a rhombus has no volume, so nothing suggested height. Here each
 * layer is a plane, and every node is drawn as an isometric CUBE rather than a
 * rhombus — a cube shows three faces, so a node has a top and two sides and the
 * whole thing reads as a solid 3D structure.
 *
 * Position on a plane is `(i - j) * STEP` across and `(i + j) * STEP * ISO` down,
 * which is the isometric grid: both axes of the lattice run at 30 degrees. A layer
 * is then offset upward by `LAYER_DZ` to sit above the one below.
 */
const AI_STEP = 11;
const AI_GRID = 3;
const AI_LAYERS = 3;
const AI_NODE_S = 2.4;
const AI_NODE_H = 2.6;
/** Vertical separation between layers, in screen units. */
const AI_LAYER_DZ = 15;

const AI_NODES: Point[][][] = Array.from({ length: AI_LAYERS }, (_, k) =>
  Array.from({ length: AI_GRID }, (_, i) =>
    Array.from({ length: AI_GRID }, (_, j) => [
      34 + (i - j) * AI_STEP,
      34 + (i + j) * AI_STEP * ISO - k * AI_LAYER_DZ,
    ] as Point),
  ),
);

/** Wiring between lattice neighbours on the same layer, plus the vertical links
 *  between a node and the one directly above it — the links are what make the
 *  stack read as connected rather than as three separate sheets. */
const AI_EDGES: Array<[Point, Point]> = [];
for (let k = 0; k < AI_LAYERS; k += 1) {
  for (let i = 0; i < AI_GRID; i += 1) {
    for (let j = 0; j < AI_GRID; j += 1) {
      if (i + 1 < AI_GRID) AI_EDGES.push([AI_NODES[k][i][j], AI_NODES[k][i + 1][j]]);
      if (j + 1 < AI_GRID) AI_EDGES.push([AI_NODES[k][i][j], AI_NODES[k][i][j + 1]]);
      if (k + 1 < AI_LAYERS) AI_EDGES.push([AI_NODES[k][i][j], AI_NODES[k + 1][i][j]]);
    }
  }
}

/** Edges that carry the travelling pulse; the rest are static wiring. */
const AI_FLOW = AI_EDGES.filter((_, index) => index % 5 === 0);

/** Every cube corner, so the viewBox covers the drawing including node height. */
function aiNodeCorners(node: Point): Point[] {
  const [x, y] = node;
  const s = AI_NODE_S;
  const h = AI_NODE_H;
  const n: Point = [x, y - s * ISO];
  const e: Point = [x + s, y];
  const so: Point = [x, y + s * ISO];
  const w: Point = [x - s, y];
  return [
    n, e, so, w,
    [n[0], n[1] + h], [e[0], e[1] + h], [so[0], so[1] + h], [w[0], w[1] + h],
  ];
}

/** Bounds of a set of points, with a margin, as an SVG viewBox string. */
function viewBoxOf(points: Point[], pad = 3) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  return {
    value: `${minX} ${minY} ${Math.max(...xs) + pad - minX} ${Math.max(...ys) + pad - minY}`,
    minY,
    maxY: Math.max(...ys) + pad,
  };
}

const VPS_VIEW = viewBoxOf([
  ...VPS_CHASSIS.corners,
  [32, VPS_UPLINK_TOP],
]);

const AI_VIEW = viewBoxOf(
  AI_NODES.flatMap((layer) => layer.flatMap((row) => row.flatMap(aiNodeCorners))),
);

/** Thin, because the figure is scaled up: 0.7 user units at this size is ~1px. */
const STROKE = 0.7;

/**
 * The fade, as a gradient on the ink itself.
 *
 * `userSpaceOnUse` and not the default `objectBoundingBox`: the latter is relative
 * to each path, so every face would fade from its own top to its own bottom and the
 * drawing would look striped. Anchored to the figure's full height instead, so the
 * whole illustration shades once, top to bottom.
 */
function InkFade({ id, minY, maxY }: { id: string; minY: number; maxY: number }) {
  return (
    <defs>
      <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1={minY} x2="0" y2={maxY}>
        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
        <stop offset="45%" stopColor="currentColor" stopOpacity="0.72" />
        <stop offset="78%" stopColor="currentColor" stopOpacity="0.34" />
        {/* Fully transparent at the very bottom: the "gradasi ke transparant" the
            reference shows, where the object dissolves rather than stopping. */}
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

function VpsShape() {
  const ink = "url(#iso-vps-ink)";
  return (
    <svg viewBox={VPS_VIEW.value} fill="none" className="size-full" aria-hidden="true" focusable="false">
      <InkFade id="iso-vps-ink" minY={VPS_VIEW.minY} maxY={VPS_VIEW.maxY} />

      {/* Uplink leaving the top of the chassis: dashes travel up it, so the tower
          reads as live rather than as a static box. */}
      <line
        x1="32"
        y1={VPS_TOP - VPS_W * ISO}
        x2="32"
        y2={VPS_UPLINK_TOP}
        stroke={ink}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray="2 4"
        className="iso-flow"
      />
      <circle cx="32" cy={VPS_UPLINK_TOP + 3.5} r="1.3" fill={ink} className="iso-pulse" />

      <g className="iso-fade">
        {/* The chassis: outline only, which is what keeps this a wireframe. The
            three faces are drawn in back-to-front order so the shared vertical edge
            lands last and reads as the corner. */}
        {[VPS_CHASSIS.top, VPS_CHASSIS.left, VPS_CHASSIS.right, VPS_CHASSIS.edge].map((d, j) => (
          <path
            key={`chassis-${j}`}
            d={d}
            stroke={ink}
            strokeWidth={STROKE}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            className="iso-draw"
            style={{ animationDelay: `${j * 70}ms` }}
          />
        ))}

        {/* Three bay slots on the front-right face, each with an activity LED.
            They sit ON the chassis, so the tower reads as one object with drive
            bays rather than as several stacked boxes. */}
        {VPS_BAYS.map((bay, i) => (
          <g key={`bay-${i}`} className="iso-fade" style={{ animationDelay: `${300 + i * 130}ms` }}>
            <path
              d={bay.d}
              stroke={ink}
              strokeWidth={STROKE * 0.8}
              strokeLinejoin="round"
              pathLength={1}
              className="iso-draw"
              style={{ animationDelay: `${300 + i * 130}ms` }}
            />
            <circle
              cx={bay.ledX}
              cy={bay.ledY}
              r="0.9"
              fill={ink}
              className="iso-pulse"
              style={{ animationDelay: `${i * 220}ms` }}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

function AiShape() {
  const ink = "url(#iso-ai-ink)";
  return (
    <svg viewBox={AI_VIEW.value} fill="none" className="size-full" aria-hidden="true" focusable="false">
      <InkFade id="iso-ai-ink" minY={AI_VIEW.minY} maxY={AI_VIEW.maxY} />

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
            stroke={ink}
            strokeWidth={STROKE * 0.7}
            strokeOpacity="0.45"
          />
        ))}
      </g>

      {/* A few connections carry a signal, which is what makes it a network rather
          than a diagram. */}
      <g className="iso-fade" style={{ animationDelay: "180ms" }}>
        {AI_FLOW.map(([from, to], i) => (
          <line
            key={i}
            x1={from[0]}
            y1={from[1]}
            x2={to[0]}
            y2={to[1]}
            stroke={ink}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray="2.5 6"
            className="iso-flow"
            style={{ animationDelay: `${i * 300}ms` }}
          />
        ))}
      </g>

      {/* Nodes as isometric CUBES, not flat diamonds: a cube shows three faces, so
          each node has volume and the stack reads as 3D. Draw order is back-to-front
          (farthest layer first, and within a layer the far corner first) so nearer
          cubes overlap the ones behind them. */}
      {AI_NODES.map((layer, k) =>
        layer.map((row, i) =>
          row.map((node, j) => {
            const delay = (AI_LAYERS - 1 - k) * 90 + i * 40 + j * 25;
            const box = isoBox(node[0], node[1], AI_NODE_S, AI_NODE_H);
            return (
              <g key={`${k}-${i}-${j}`} className="iso-fade" style={{ animationDelay: `${delay}ms` }}>
                {[box.top, box.left, box.right, box.edge].map((d, f) => (
                  <path
                    key={f}
                    d={d}
                    fill={ink}
                    /* Faint face fill, unlike the VPS rack: at this node size a
                       pure outline is illegible, and the shading is what makes a
                       2-unit cube read as a solid. */
                    fillOpacity={f === 0 ? 0.55 : f === 2 ? 0.3 : 0.18}
                    stroke={ink}
                    strokeWidth={STROKE * 0.7}
                    strokeLinejoin="round"
                    pathLength={1}
                    /* One element, one `animation` declaration: `iso-draw` and
                       `iso-pulse` set the same property, so two classes would fight
                       and only the later one in the stylesheet would win. */
                    className="iso-node"
                    style={{ animationDelay: `${delay}ms, ${delay + 900}ms` }}
                  />
                ))}
              </g>
            );
          }),
        ),
      )}
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
    // rendered size of the figure.
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
        // Centred and large: no box, no coloured panel, just the drawing. The
        // figure fills its own viewBox, so this height is the drawing's height.
        "relative mx-auto flex h-60 w-full items-center justify-center text-foreground [perspective:700px]",
        className,
      )}
    >
      {/* Two elements on purpose: `iso-float` animates `transform`, and a CSS
          animation overrides an inline `transform`. Bobbing and tilting on the
          same node would cancel the tilt. */}
      <span className="iso-float block size-full">
        <span
          className="block size-full [transform-style:preserve-3d] transition-transform duration-150 ease-out"
          style={{ transform: `rotateY(${tilt.x * 11}deg) rotateX(${-tilt.y * 11}deg)` }}
        >
          {kind === "vps" ? <VpsShape /> : <AiShape />}
        </span>
      </span>
    </span>
  );
}
