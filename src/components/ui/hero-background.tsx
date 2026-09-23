"use client";

/**
 * The hero background, one crop per viewport class.
 *
 * WHY NOT ONE IMAGE WITH `object-cover` — which is what this replaced:
 *
 *  * The source is 2.01:1. A phone hero is portrait, so `object-cover` centred the
 *    artwork and showed only 23% of it: the glowing arc, the entire subject of the
 *    image, was cropped to a thin strip at the top. Cropping in CSS cannot fix that,
 *    because `object-cover` always centres — there is no way to say "keep the arc".
 *  * At 3440px the same file was upscaled 2.39x and read as soft.
 *  * It shipped a 511KB PNG to every device, phones included.
 *
 * So the crops are made ahead of time by `scripts/build-hero-bg.js`: five aspect
 * ratios, each with the arc positioned for that shape, each rendered at the size
 * that viewport actually needs, in AVIF + WebP + JPEG. The arc sits higher as the
 * frame gets taller, because a portrait phone has the headline directly beneath it.
 *
 * A plain `<picture>` rather than `next/image`, deliberately. Art direction means
 * choosing a DIFFERENT image per breakpoint, and `next/image` renders a single
 * `<img>` whose `srcSet` is width variants of one file — it cannot express "use a
 * different crop below 640px". Wrapping it in `<picture>` does not help either:
 * the loader's own `<img>` ignores sibling `<source>` elements it did not render.
 * The format and size work the loader would normally do is already done here, at
 * build time, which is why the files are small enough not to need it.
 *
 * `<source>` is evaluated top-down and the first match wins, so the list runs from
 * the narrowest breakpoint outward and the `<img>` is the fallback. AVIF comes
 * before WebP within each breakpoint, since both are the same picture.
 */

/** (name, max-width) per crop. Narrowest first: `<source>` is first-match. */
const CROPS: Array<[name: string, media: string]> = [
  ["hero-mobile", "(max-width: 640px)"],
  ["hero-tablet", "(max-width: 1024px)"],
  ["hero-laptop", "(max-width: 1440px)"],
  ["hero-desktop", "(max-width: 2560px)"],
];

/** The crop above every breakpoint, and the `<img>` fallback. */
const WIDEST = "hero-wide";

const src = (name: string, ext: string) => `/hero/${name}.${ext}`;

export function HeroBackground({ className }: { className?: string }) {
  return (
    <picture className={className}>
      {CROPS.flatMap(([name, media]) => [
        <source key={`${name}-avif`} media={media} srcSet={src(name, "avif")} type="image/avif" />,
        <source key={`${name}-webp`} media={media} srcSet={src(name, "webp")} type="image/webp" />,
        <source key={`${name}-jpg`} media={media} srcSet={src(name, "jpg")} type="image/jpeg" />,
      ])}
      {/* Above every crop breakpoint: AVIF for the widths that support it, with the
          <img> below serving the JPEG fallback. An <img srcSet> cannot carry a
          format, so the ultrawide AVIF has to be its own <source>. */}
      <source media="(min-width: 2561px)" srcSet={src(WIDEST, "avif")} type="image/avif" />
      <source media="(min-width: 2561px)" srcSet={src(WIDEST, "webp")} type="image/webp" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src(WIDEST, "jpg")}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-cover object-top"
      />
    </picture>
  );
}
