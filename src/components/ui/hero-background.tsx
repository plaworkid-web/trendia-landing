"use client";

import * as React from "react";

/**
 * The hero artwork: a planet's lit limb with a cursor-following light behind it.
 *
 * WHY SVG RATHER THAN THE PNG IT REPLACED
 *  * It scales to any viewport with no upscaling. The PNG was 1440px wide and had to
 *    fill a 3440px monitor.
 *  * It is ~5KB instead of 511KB, and needs no format negotiation or per-breakpoint
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
 * ONE INSTANCE, MOUNTED ONCE
 * This is the page background: a single fixed layer behind every section on the landing
 * and on the portal. It is deliberately NOT also drawn inside the hero band, because two
 * instances cannot be made to agree — the band scrolls and a fixed layer does not, so
 * their sky gradients sit at different offsets and a seam appears where the band ends
 * (measured: a luminance step of +10.6 in dark mode, -26.2 in light, at exactly the
 * band's bottom edge). One layer has no boundary to hide.
 *
 * A side benefit of mounting it once: the cursor light works across the whole page, not
 * just the first screen.
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
 * `public/hero/hero.svg`; the test suite asserts the two agree, so editing one without
 * the other fails.
 *
 * TWO THEMES, ONE ARTWORK
 * Both surfaces have a light mode, so every colour is a CSS custom property rather than a
 * literal: the gradient stops read `var(--hero-sky-0)` and the theme swap happens in CSS,
 * with no JavaScript, no re-render, and no server/client mismatch. The dark values are the
 * measured ones; the light values are a separate wash defined alongside them.
 *
 * This file is duplicated verbatim into the portal (`src/components/ui/hero-background.tsx`)
 * because the two apps share no workspace package, and a test asserts the copies are
 * byte-identical so they cannot drift apart.
 */

/**
 * Measured by scripts/measure-hero-limb.js, then lifted so the arc reads higher.
 *
 * The measured centre is 870.5, which put the arc at 27.8% of the viewport height. The
 * first lift (836, then 780) overshot: at 780 the arc sat at 15.2% and crowded the
 * navigation, leaving the top feeling heavy. 818 lands it around 20.5%, which lifts the
 * arc clear of the nav without the planet losing the lower two-thirds of the frame.
 */
const LIMB = { cx: 719.5, cy: 818, r: 671.5 };

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
   * The listeners go on `window`, not on this wrapper.
   *
   * The wrapper sits inside a `pointer-events-none` layer (it is decoration, and it must not
   * intercept clicks meant for the page), so it receives no pointer events at all — measured:
   * zero `pointermove` events reached it, and the light never appeared. Dispatching synthetic
   * events straight at the element, which is what the first version of the test did, hid this
   * completely.
   *
   * Window-level is also what makes the light follow the pointer over the headline, the
   * buttons and every section below, rather than only over the artwork itself.
   *
   * The position is written to CSS custom properties, not React state: `pointermove` fires up
   * to 60 times a second and re-rendering the page that often would stutter for a decoration.
   * The browser repaints the gradient without React being involved.
   *
   * The coordinates are converted to VIEWBOX units. Writing raw CSS pixels puts the light at
   * the wrong place, because the SVG reads them as viewBox units; they only agree when the
   * element happens to be exactly viewBox-sized. `preserveAspectRatio` "slice" also crops the
   * overflowing axis, which has to be subtracted.
   */
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const toViewBox = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      // `slice` scales to COVER, so the scale is the larger ratio. With `xMidYMin` the
      // overflowing horizontal axis is cropped equally on both sides and the overflowing
      // vertical axis is cropped from the BOTTOM only, so there is no top offset.
      const scale = Math.max(rect.width / W, rect.height / H);
      const offsetX = (W * scale - rect.width) / 2;
      return {
        x: (clientX - rect.left + offsetX) / scale,
        y: (clientY - rect.top) / scale,
      };
    };

    const onMove = (event: PointerEvent) => {
      const point = toViewBox(event.clientX, event.clientY);
      if (!point) return;
      el.style.setProperty("--hero-x", `${point.x.toFixed(1)}px`);
      el.style.setProperty("--hero-y", `${point.y.toFixed(1)}px`);
      setActive(true);
    };
    const onLeave = () => setActive(false);
    // The pointer leaving the window has no `pointerleave` on the document, so it is
    // detected by the event having nowhere to go.
    const onOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) setActive(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  const coreR = LIMB.r + CORE_OFFSET;
  const haloR = LIMB.r + HALO_OFFSET;

  return (
    <div
      ref={ref}
      data-hero-background=""
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
        preserveAspectRatio="xMidYMin slice"
        role="presentation"
        aria-hidden="true"
        data-hero-art=""
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--hero-sky-0)" />
            <stop offset="0.14" stopColor="var(--hero-sky-1)" />
            <stop offset="0.34" stopColor="var(--hero-sky-2)" />
            <stop offset="0.62" stopColor="var(--hero-sky-3)" />
            <stop offset="1" stopColor="var(--hero-sky-4)" />
          </linearGradient>

          <linearGradient id="heroHalo" x1="0" y1="0" x2="1" y2="0">
            {arcStops(
              "var(--hero-halo-bright)",
              "var(--hero-halo-mid)",
              "var(--hero-halo-edge)",
            )}
          </linearGradient>

          <linearGradient id="heroCore" x1="0" y1="0" x2="1" y2="0">
            {arcStops(
              "var(--hero-core-bright)",
              "var(--hero-core-mid)",
              "var(--hero-core-edge)",
            )}
          </linearGradient>

          {/* Confined to the apex, so the blow-out does not run along the whole arc. */}
          <linearGradient id="heroHot" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--hero-hot)" stopOpacity="0" />
            <stop offset="0.42" stopColor="var(--hero-hot)" stopOpacity="0.6" />
            <stop offset="0.5" stopColor="var(--hero-hot)" stopOpacity="1" />
            <stop offset="0.58" stopColor="var(--hero-hot)" stopOpacity="0.6" />
            <stop offset="1" stopColor="var(--hero-hot)" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="heroCursor" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="var(--hero-cursor-core)" stopOpacity="0.85" />
            <stop offset="0.22" stopColor="var(--hero-cursor-mid)" stopOpacity="0.6" />
            <stop offset="0.45" stopColor="var(--hero-cursor-violet)" stopOpacity="0.35" />
            <stop offset="0.7" stopColor="var(--hero-cursor-blue)" stopOpacity="0.16" />
            <stop offset="1" stopColor="var(--hero-cursor-blue)" stopOpacity="0" />
          </radialGradient>

          {/*
            The planet's own shading, which is what makes it read as a sphere rather
            than a flat disc.

            Measured from the source (scripts/measure-hero-planet-body.js): the body is
            NOT a flat fill. Luminance falls with depth inside the limb — 5.2 in the first
            120px, 3.0 at 120-240, down to 1.0 at 480-600. So the visible cap is brightest
            near its edge and fades into shadow toward the interior.

            The gradient is centred on the limb circle, so offset 1 is the limb itself.
            The visible part of the planet is the cap above y~199, which corresponds to
            offsets ~0.7-1.0; the stops are dense there because that is where it shows.
          */}
          <radialGradient id="heroPlanetShade" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="var(--hero-planet-0)" />
            <stop offset="0.45" stopColor="var(--hero-planet-1)" />
            <stop offset="0.72" stopColor="var(--hero-planet-2)" />
            <stop offset="0.86" stopColor="var(--hero-planet-3)" />
            <stop offset="0.94" stopColor="var(--hero-planet-4)" />
            <stop offset="1" stopColor="var(--hero-planet-5)" />
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

        {/* The planet. Filled with its own shading rather than a flat colour, so the
            visible cap reads as the lit surface of a sphere fading into shadow — the
            source does this, and a flat fill looked like a cut-out. */}
        <circle data-hero-planet="" cx={LIMB.cx} cy={LIMB.cy} r={LIMB.r} fill="url(#heroPlanetShade)" />

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
