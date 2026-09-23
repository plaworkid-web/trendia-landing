"use client";

import * as React from "react";

/**
 * The hero artwork, as inline SVG, with a cursor-following light behind the planet.
 *
 * WHY SVG RATHER THAN THE PNG IT REPLACED
 *  * It scales to any viewport with no upscaling. The PNG was 1440px wide and had to
 *    fill a 3440px monitor.
 *  * It is 4.5KB instead of 511KB, and needs no format negotiation or per-breakpoint
 *    crops — one file covers every width.
 *  * Its layers can be moved. A raster cannot put a light behind its own subject.
 *
 * WHY THIS IS A FAITHFUL COPY, NOT AN APPROXIMATION
 * The artwork is smooth gradient with no texture, noise or fine detail (measured
 * entropy 4.3). That is the one case where tracing to vectors loses nothing, because
 * there is no high-frequency content to lose. Measured against the source it is 96.8%
 * accurate per pixel, and its colour gradation is smoother than the original's
 * (largest luminance jump 4 vs 13-23 across the arc). A photographic background could
 * not be rebuilt this way.
 *
 * WHY INLINE AND NOT AN <img>
 * The light has to sit BEHIND the planet. As an external image the whole artwork is one
 * opaque layer, so a glow placed behind it is invisible and one placed in front of it
 * covers the planet. Inlining lets the cursor layer be painted between the arc and the
 * planet, which is the only arrangement where it reads as light coming from behind.
 *
 * THE GEOMETRY
 * Every number here was measured, not chosen by eye:
 *  * `LIMB` is the planet's edge, found by tracing the last lit row per column and
 *    fitting a circle: r=671.5 at (719.5, 870.5), mean fit error 2.8px.
 *  * `coreOffset` 78 puts the bright crest where the source's brightest pixel is
 *    (y=120 against a limb at y=198). Centring it on the limb instead put the peak
 *    light in the wrong place.
 *  * `haloOffset` 60 lifts the wide glow, because the source is already going dark at
 *    the limb and a limb-centred halo was 128/255 too bright there.
 *  * The gradient stops come from the source's horizontal profile at y=140, which is
 *    near-white from x=540 to x=900 and dim by x=960.
 *
 * `scripts/build-hero-svg.js` holds the same numbers and writes the standalone
 * `public/hero/hero.svg`; `tests/test_landing_product_pages.py` asserts the two agree,
 * so editing one without the other fails the suite.
 */

/** Measured by scripts/measure-hero-limb.js. */
const LIMB = { cx: 719.5, cy: 870.5, r: 671.5 };

/** Measured and tuned by scripts/build-hero-svg.js and the tune-hero-svg*.js sweeps. */
const CORE_OFFSET = 78;
const CORE_WIDTH = 22;
const CORE_BLUR = 10;
const HALO_OFFSET = 60;
const HALO_WIDTH = 120;
const HALO_BLUR = 32;
const HOT_WIDTH = 16;
const INNER_WIDTH = 60;
const INNER_BLUR = 24;
const INNER_OPACITY = 0.15;

const W = 1440;
const H = 715;

/** Bright over the crest, dim where the arc curves away. */
const arcStops = (bright: string, mid: string, edge: string) => (
  <>
    <stop offset="0" stopColor={edge} stopOpacity="0" />
    <stop offset="0.26" stopColor={edge} stopOpacity="0.12" />
    <stop offset="0.36" stopColor={mid} stopOpacity="0.8" />
    <stop offset="0.41" stopColor={bright} stopOpacity="1" />
    <stop offset="0.61" stopColor={bright} stopOpacity="1" />
    <stop offset="0.66" stopColor={mid} stopOpacity="0.8" />
    <stop offset="0.76" stopColor={edge} stopOpacity="0.12" />
    <stop offset="1" stopColor={edge} stopOpacity="0" />
  </>
);

export function HeroBackground({ className }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);

  /**
   * Write the pointer position to CSS custom properties on the wrapper, not to React
   * state: `pointermove` fires up to 60 times a second and re-rendering the hero that
   * often would stutter for a decoration. The browser repaints the gradient without
   * React being involved. Same approach as PlanetCard.
   *
   * The coordinates are converted to VIEWBOX units. The first version wrote raw CSS
   * pixels, which the SVG read as viewBox units - so on a 1512px-wide hero the light
   * landed at x=756 of a 1440-unit viewBox instead of under the pointer. It also has to
   * account for `preserveAspectRatio="slice"`, which crops the overflowing axis.
   */
  const handleMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    // `slice` scales to COVER, so the scale is the larger of the two ratios and the
    // axis that overflows is cropped equally on both sides.
    const scale = Math.max(rect.width / W, rect.height / H);
    const offsetX = (W * scale - rect.width) / 2;
    const offsetY = (H * scale - rect.height) / 2;

    const vbX = (event.clientX - rect.left + offsetX) / scale;
    const vbY = (event.clientY - rect.top + offsetY) / scale;

    el.style.setProperty("--hero-x", `${vbX.toFixed(1)}px`);
    el.style.setProperty("--hero-y", `${vbY.toFixed(1)}px`);
  }, []);

  const coreR = LIMB.r + CORE_OFFSET;
  const haloR = LIMB.r + HALO_OFFSET;

  return (
    <div
      ref={ref}
      data-hero-background=""
      onPointerMove={handleMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      className={className}
      style={
        {
          // Centred default, in viewBox units, so the first paint is not pinned to a
          // corner.
          "--hero-x": `${W / 2}px`,
          "--hero-y": `${H / 2}px`,
        } as React.CSSProperties
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
        aria-hidden="true"
        data-hero-art=""
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#120d2e" />
            <stop offset="0.14" stopColor="#0b0620" />
            <stop offset="0.34" stopColor="#070126" />
            <stop offset="0.62" stopColor="#04001a" />
            <stop offset="1" stopColor="#000102" />
          </linearGradient>

          <linearGradient id="heroHalo" x1="0" y1="0" x2="1" y2="0">
            {arcStops("#b98cff", "#6a4fd0", "#332470")}
          </linearGradient>

          <linearGradient id="heroCore" x1="0" y1="0" x2="1" y2="0">
            {arcStops("#ffffff", "#dcb6ff", "#4a5fd8")}
          </linearGradient>

          {/* Confined to the apex, so the blow-out does not run along the whole arc. */}
          <linearGradient id="heroHot" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.42" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="0.58" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="heroCursor" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="0.22" stopColor="#e4c6ff" stopOpacity="0.6" />
            <stop offset="0.45" stopColor="#a86dff" stopOpacity="0.35" />
            <stop offset="0.7" stopColor="#4714d9" stopOpacity="0.16" />
            <stop offset="1" stopColor="#4714d9" stopOpacity="0" />
          </radialGradient>

          <filter id="heroHaloBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={HALO_BLUR} />
          </filter>
          <filter id="heroCoreBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={CORE_BLUR} />
          </filter>
          <filter id="heroInnerBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={INNER_BLUR} />
          </filter>

          <clipPath id="heroPlanetClip">
            <circle cx={LIMB.cx} cy={LIMB.cy} r={LIMB.r} />
          </clipPath>
        </defs>

        <rect width={W} height={H} fill="url(#heroSky)" />

        <circle
          cx={LIMB.cx} cy={LIMB.cy} r={haloR} fill="none"
          stroke="url(#heroHalo)" strokeWidth={HALO_WIDTH} filter="url(#heroHaloBlur)"
        />
        <circle
          cx={LIMB.cx} cy={LIMB.cy} r={coreR} fill="none"
          stroke="url(#heroCore)" strokeWidth={CORE_WIDTH} filter="url(#heroCoreBlur)"
        />
        <circle
          cx={LIMB.cx} cy={LIMB.cy} r={coreR} fill="none"
          stroke="url(#heroHot)" strokeWidth={HOT_WIDTH} filter="url(#heroCoreBlur)"
        />

        {/* The cursor light. Painted here, after the arc and before the planet, so the
            planet covers its lower half — that is what makes it read as light coming
            from behind the planet rather than a spot drawn on top of the scene.

            rx/ry are in viewBox units and sized to the limb circle (r=671.5), so the
            light is comparable in scale to the planet rather than a small dot. The
            first version used 620x420, which shrank the glow roughly threefold against
            the 44%/70% of the frame it replaced, and combined with low opacities it was
            effectively invisible. */}
        <ellipse
          data-hero-cursor=""
          cx="var(--hero-x, 720px)"
          cy="var(--hero-y, 357px)"
          rx="900"
          ry="620"
          fill="url(#heroCursor)"
          className={active ? "opacity-100" : "opacity-0"}
          style={{ transition: "opacity 500ms ease" }}
        />

        <circle cx={LIMB.cx} cy={LIMB.cy} r={LIMB.r} fill="#030014" />

        {/* A faint bleed onto the planet's own surface, clipped to it. Present at the
            sides in the source but not at the crest, where the cut is hard. */}
        <g clipPath="url(#heroPlanetClip)">
          <circle
            cx={LIMB.cx} cy={LIMB.cy} r={LIMB.r} fill="none"
            stroke="url(#heroHalo)" strokeWidth={INNER_WIDTH}
            filter="url(#heroInnerBlur)" opacity={INNER_OPACITY}
          />
        </g>
      </svg>
    </div>
  );
}
