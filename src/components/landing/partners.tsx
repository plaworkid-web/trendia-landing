"use client";

import { TECH_LOGOS, orbitLogoUrl } from "@/lib/orbit-logos";
import { copy, type Locale } from "@/lib/site";

/**
 * The technology wall: one row of brand marks drifting right to left.
 *
 * A single lane, deliberately. Four labelled lanes grouped by kind read as a taxonomy
 * and made the section a band of its own; one row is a quiet line of marks under a
 * heading, which is what a trust strip is for.
 *
 * The row is narrower than the page and centred, so only a handful of marks are in view
 * at once. A strip that spans the full width shows a dozen logos at a glance and the eye
 * skips the whole thing; a short row has to be read.
 *
 * The drift is a CSS keyframe on a repeated list, translated by exactly one copy, so the
 * next copy lands where the previous one began and the loop has no seam. It is paused
 * under `prefers-reduced-motion`: a row that slides forever is exactly the movement that
 * setting exists to stop.
 */

/** Badge and mark size. Larger than a typical logo strip, so each brand is legible. */
const BADGE = 76;
const LOGO = 40;
/** Gap between badges, in pixels. */
const GAP = 28;
/**
 * Width of the fade at each end, in pixels.
 *
 * Fixed rather than a percentage: the row is 390px wide on a phone, where 10% is 39px -
 * narrower than a single 76px badge, so a mark sat half-visible with a hard edge instead
 * of fading. A fade at least one badge wide is what makes marks appear and disappear
 * rather than look chopped off.
 */
const EDGE_FADE = 96;

/**
 * The widest lane we expect to fill, in pixels. The row is capped at 768px, so this is
 * generous; the extra copy costs nothing and guarantees the loop never runs out.
 */
const MAX_LANE_WIDTH = 1024;

/** Width of one copy of the list: every badge plus the gap after each. */
const COPY_WIDTH = TECH_LOGOS.length * (BADGE + GAP);

/** How many times to repeat the list so its copies can cover the lane. */
const REPEATS = Math.ceil(MAX_LANE_WIDTH / COPY_WIDTH) + 1;

export function Partners({ locale }: { locale: Locale }) {
  const strip = Array.from({ length: REPEATS }, () => TECH_LOGOS).flat();

  return (
    <section className="border-y border-border/40 py-14">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {copy[locale].partners.title}
      </p>

      {/* Centred and capped so the row reads as a short line rather than a full-bleed
          band. The mask fades both ends by a fixed width, so marks appear and disappear
          instead of being cut off square at the container edge. */}
      <div
        className="mx-auto mt-8 max-w-3xl overflow-hidden px-6"
        style={{
          maskImage: `linear-gradient(to right, transparent, black ${EDGE_FADE}px, black calc(100% - ${EDGE_FADE}px), transparent)`,
          WebkitMaskImage: `linear-gradient(to right, transparent, black ${EDGE_FADE}px, black calc(100% - ${EDGE_FADE}px), transparent)`,
        }}
      >
        <div
          className="flex w-max items-center motion-reduce:animate-none"
          style={
            {
              gap: GAP,
              animation: "marquee-rtl 48s linear infinite",
              // Shift by exactly one copy, in pixels.
              //
              // A percentage of the whole strip is not the same thing once there is a gap
              // between badges: with N copies the exact distance is
              // length * (badge + gap), while 100/N % of the total drifts a few pixels
              // short because the final gap is missing. That difference is a small jump
              // once per pass.
              "--marquee-shift": `-${COPY_WIDTH}px`,
            } as React.CSSProperties
          }
        >
          {strip.map((logo, index) => (
            <span
              key={`${logo.slug}-${index}`}
              title={logo.label}
              className="flex shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-card"
              style={{ width: BADGE, height: BADGE }}
            >
              {/* The marks are stored as monochrome SVGs drawn with currentColor; an
                  <img> cannot inherit that, so they are inverted to read on a dark
                  surface. */}
              <img
                src={orbitLogoUrl(logo.slug)}
                alt={logo.label}
                width={LOGO}
                height={LOGO}
                loading="lazy"
                decoding="async"
                className="opacity-80 [filter:brightness(0)_invert(1)] dark:opacity-90"
                style={{ width: LOGO, height: LOGO }}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
