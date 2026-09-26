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

/**
 * `pointerTarget`: which element the cursor light listens on.
 *
 *   "window"  - the light follows the pointer across the whole page. For a FIXED page
 *               background, where the artwork is behind everything and the wrapper
 *               itself is `pointer-events-none`.
 *   "section" - the light follows the pointer only over the enclosing <section>. For an
 *               IN-FLOW band, which is where this started.
 *
 * This is a prop rather than one hardcoded choice because the landing and the portal
 * need different answers while the file must stay byte-identical between them (a test
 * asserts that). `window` would light the portal's whole page from behind a login form;
 * `section` would give the landing's full-page background no light at all, since its
 * wrapper receives no pointer events.
 */
export function HeroBackground({
  className,
  pointerTarget = "section",
}: {
  className?: string;
  pointerTarget?: "section" | "window";
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);

  /**
   * The listeners go on the enclosing <section>, not on this wrapper.
   *
   * The wrapper is `z-0` and the hero content sits above it at `z-10`, so the wrapper
   * only ever receives pointer events over the artwork itself. Moving the mouse across
   * the headline, the description or the buttons - which is most of the hero - produced
   * no events at all, so the light never appeared where anyone would actually move the
   * pointer. Measured with real CDP mouse movement: zero pointermove events reached the
   * wrapper. Dispatching synthetic events straight at the element, which is what the
   * first version of the test did, hid this completely.
   *
   * The <section> spans the whole hero and sits underneath the content, so it sees every
   * pointer move over the hero.
   *
   * The position is written to CSS custom properties, not React state: `pointermove`
   * fires up to 60 times a second and re-rendering the hero that often would stutter for
   * a decoration. The browser repaints the gradient without React being involved.
   *
   * The coordinates are converted to VIEWBOX units. Writing raw CSS pixels puts the
   * light at the wrong place, because the SVG reads them as viewBox units; they only
   * agree when the element happens to be exactly viewBox-sized. `preserveAspectRatio`
   * "slice" also crops the overflowing axis, which has to be subtracted.
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

    /*
      A window target needs different events: `pointerenter`/`pointerleave` never fire on
      `window`, and the pointer leaving the window is only detectable as a `pointerout`
      whose `relatedTarget` is null.
    */
    if (pointerTarget === "window") {
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
    }
    const surface = el.closest("section") ?? el;
    surface.addEventListener("pointermove", onMove);
    surface.addEventListener("pointerenter", onMove);
    surface.addEventListener("pointerleave", onLeave);
    return () => {
      surface.removeEventListener("pointermove", onMove);
      surface.removeEventListener("pointerenter", onMove);
      surface.removeEventListener("pointerleave", onLeave);
    };
  }, [pointerTarget]);

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
            NOT a flat fill. Luminance falls with depth inside the limb - 5.2 in the first
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
            visible cap reads as the lit surface of a sphere fading into shadow - the
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

      {/*
        The blend into the section below.

        The next section (the capabilities grid) is pure `#000000`; the hero's own sky
        fades to a near-black #010105, close but not identical, so a seam showed where
        they met.

        This is a CSS overlay rather than a rect inside the SVG, because the artwork uses
        `preserveAspectRatio="slice"`: on a wide viewport the SVG is scaled up and
        centre-cropped, so a rect at the bottom of the viewBox can fall outside the
        visible area entirely (measured: 400px cropped away at 3440px wide). An overlay
        positioned on the element itself always sits exactly at the hero's bottom edge.

        Kept short on purpose. A tall fade reads as its own dark band rather than as one
        continuous colour, so the ramp is eased: most of the change happens in the last
        fifth.
      */}
      <div
        aria-hidden="true"
        data-hero-bottom-fade=""
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-black via-black/70 to-transparent"
      />
    </div>
  );
}
