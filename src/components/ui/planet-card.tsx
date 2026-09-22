"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A card lit like a planet: on hover, light appears behind it from the direction the
 * pointer is, the way a sun lights a planet from behind.
 *
 * Two layers, both centred on the pointer:
 *
 * 1. A halo *behind* the card. It is inset negatively and blurred, so it spills past
 *    the edges — that spill is what makes it read as light coming from behind rather
 *    than a tint on the surface.
 * 2. A rim light on the card's own edge, brightest where the pointer is, the way a
 *    planet's edge catches the sun.
 *
 * The pointer position is written to CSS custom properties on the element itself, not
 * to React state. `mousemove` fires up to 60 times a second; re-rendering the card
 * that often would make the page stutter for a decoration. The browser repaints the
 * gradient without React being involved at all.
 *
 * Layering is done with DOM order and an explicit `z-10` on the content, not a negative
 * z-index. A `-z-10` halo escapes to the nearest stacking context and can end up behind
 * the page background, where it is invisible — the card would appear to do nothing.
 *
 * The lift is behind `motion-safe:` so it is dropped for anyone who has asked for
 * reduced motion. The light itself stays: an opacity fade is not the kind of movement
 * that setting exists to prevent.
 *
 * Colours follow the hero's palette — white at the centre, fading through violet to
 * blue — so the card belongs to the same scene as the rest of the page.
 */

/** The hero's hues: white core, brand violet, then a cooler blue at the edge. */
const CORE = "rgba(255, 255, 255, 0.55)";
const VIOLET = "rgba(71, 8, 217, 0.42)";
const BLUE = "rgba(56, 148, 255, 0.26)";

export function PlanetCard({
  children,
  className,
  /** Radius of the halo in pixels. Larger reads as a bigger light source. */
  radius = 420,
  /** Adds a slight lift on hover. Off for cards inside a fixed-height bento slot. */
  lift = true,
  /**
   * Class for an opaque layer behind the card's content, e.g. `bg-background`.
   *
   * Needed whenever the card itself is translucent. The pricing and service cards are
   * glass (`--glass-bg` is 40% opaque) and `--card` is 45%, so without this the halo
   * shines through the middle of the card and washes out the text instead of staying
   * around the edges where it belongs. Cards that are already opaque can omit it.
   */
  surface,
  /**
   * Corner radius shared by the surface and the rim light, so both trace the card's
   * actual outline. A rim on a `rounded-xl` box inside a `rounded-2xl` card leaves the
   * corners unlit.
   */
  shape = "rounded-xl",
}: {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  lift?: boolean;
  surface?: string;
  shape?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);

  const handleMove = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Written straight to the element: no state, no re-render, no dropped frames.
    el.style.setProperty("--planet-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--planet-y", `${event.clientY - rect.top}px`);
  }, []);

  const handleEnter = React.useCallback(() => setActive(true), []);
  const handleLeave = React.useCallback(() => setActive(false), []);

  return (
    <div
      ref={ref}
      data-planet-card=""
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "group/planet relative",
        lift && "transition-transform duration-300 ease-out motion-safe:hover:-translate-y-1",
        className,
      )}
      style={
        {
          // A sensible default so the first paint has the light centred rather than
          // pinned to the top-left corner.
          "--planet-x": "50%",
          "--planet-y": "50%",
        } as React.CSSProperties
      }
    >
      {/* Halo behind the card. First in the DOM and absolute, so the content below
          paints over it; `-inset-6` plus a blur lets it spill past the edges. */}
      <span
        aria-hidden
        data-planet-halo=""
        className={cn(
          "pointer-events-none absolute -inset-6 rounded-[28px] blur-2xl transition-opacity duration-500",
          active ? "opacity-100" : "opacity-0",
        )}
        style={{
          background: `radial-gradient(${radius}px circle at var(--planet-x) var(--planet-y), ${CORE}, ${VIOLET} 32%, ${BLUE} 55%, transparent 78%)`,
        }}
      />

      {/* Opaque layer for a translucent card, so the halo stays outside it. */}
      {surface ? (
        <span
          aria-hidden
          data-planet-surface=""
          className={cn("pointer-events-none absolute inset-0", shape, surface)}
        />
      ) : null}

      {/* The card itself. */}
      <div className="relative z-10 h-full">{children}</div>

      {/* Rim light: the card's own edge catching the sun. Masked to a 1px ring so only
          the border lights up, never the surface. Last in the DOM so it sits on top. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-20 transition-opacity duration-500",
          shape,
          active ? "opacity-100" : "opacity-0",
        )}
        style={{
          padding: "1px",
          background: `radial-gradient(${radius * 0.7}px circle at var(--planet-x) var(--planet-y), rgba(255,255,255,0.9), rgba(71,8,217,0.55) 30%, transparent 62%)`,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
        }}
      />
    </div>
  );
}
