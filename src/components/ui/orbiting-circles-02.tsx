"use client";

import { INNER_LOGOS, OUTER_LOGOS, orbitLogoUrl, type OrbitLogo } from "@/lib/orbit-logos";

/**
 * Brand marks orbiting the hero.
 *
 * Two details the previous hardcoded version did not have to face:
 *
 * 1. Positions are computed from an angle. Four hand-written Tailwind offsets cannot
 *    become eight without inventing offsets, so each badge is placed with
 *    `left/top` percentages around the ring and centred with `translate(-50%, -50%)`.
 * 2. Each badge counter-rotates against its ring. A ring turning 34s while its child
 *    spins with it would leave every logo permanently tilted — the mark would rotate
 *    with the orbit, which reads as a broken image rather than a turning logo. The
 *    counter-rotation uses the same duration, so the net rotation is zero.
 */
/**
 * Badge diameter and the mark inside it. The pair to change to resize the orbit.
 *
 * The ratio matters as much as the size: a mark that fills only ~40% of its badge looks
 * lost in the circle however large the badge gets. 34/64 keeps the mark comfortably
 * inside the ring while reading as the subject rather than a speck.
 */
const BADGE_SIZE = 64;
const LOGO_SIZE = 34;

function OrbitIcon({
  logo,
  angleDeg,
  durationSeconds,
  reverse,
}: {
  logo: OrbitLogo;
  angleDeg: number;
  durationSeconds: number;
  reverse: boolean;
}) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = 50 + 50 * Math.cos(rad);
  const y = 50 + 50 * Math.sin(rad);

  return (
    <span
      className="absolute flex items-center justify-center rounded-full border border-white/20 bg-black/45 shadow-[0_0_32px_rgba(71,8,217,0.55)] backdrop-blur-md"
      style={{
        width: BADGE_SIZE,
        height: BADGE_SIZE,
        left: `${x}%`,
        top: `${y}%`,
        // Centre on the point, then undo the ring's rotation.
        animation: `orbit-counter ${durationSeconds}s linear infinite${reverse ? "" : " reverse"}`,
      }}
    >
      <img
        src={orbitLogoUrl(logo.slug)}
        alt={logo.label}
        width={LOGO_SIZE}
        height={LOGO_SIZE}
        loading="lazy"
        decoding="async"
        className="opacity-90 [filter:brightness(0)_invert(1)]"
        style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
      />
    </span>
  );
}

function Ring({
  logos,
  durationSeconds,
  reverse = false,
  insetPercent,
}: {
  logos: OrbitLogo[];
  durationSeconds: number;
  reverse?: boolean;
  insetPercent: number;
}) {
  return (
    <div
      className="absolute rounded-full border border-dashed border-violet-300/25"
      style={{
        inset: `${insetPercent}%`,
        animation: `spin ${durationSeconds}s linear infinite${reverse ? " reverse" : ""}`,
      }}
    >
      {logos.map((logo, index) => (
        <OrbitIcon
          key={logo.slug}
          logo={logo}
          angleDeg={(360 / logos.length) * index}
          durationSeconds={durationSeconds}
          reverse={reverse}
        />
      ))}
    </div>
  );
}

/** Decorative model/provider orbit layer for the hero. */
export default function OrbitingCirclesGlobe() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden"
    >
      <div className="relative mt-20 aspect-square w-[min(182.02vw,1602px)] shrink-0 translate-y-[30%] opacity-80 sm:mt-12 sm:w-[min(152.9vw,1602px)]">
        <div className="absolute inset-[7%] rounded-full border border-white/10 [box-shadow:0_0_80px_rgba(71,8,217,0.28),inset_0_0_80px_rgba(71,8,217,0.18)]" />

        {/* Outer ring — model makers. */}
        <Ring logos={OUTER_LOGOS} durationSeconds={34} insetPercent={7} />

        {/* Inner ring — infrastructure, turning the other way. */}
        <Ring logos={INNER_LOGOS} durationSeconds={24} reverse insetPercent={22} />
      </div>
    </div>
  );
}
