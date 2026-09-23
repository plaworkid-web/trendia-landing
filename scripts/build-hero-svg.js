/**
 * Build the hero artwork as SVG, with the glow following the planet's limb.
 *
 * WHY VECTOR
 * The source is a 1440x715 PNG: it must be upscaled to fill a wide monitor, it cannot
 * carry an interactive effect, and every device downloads it. As SVG it scales to any
 * resolution, weighs ~2KB, and its layers can move.
 *
 * WHY THIS CAN BE FAITHFUL
 * The artwork is smooth gradient with no texture, noise or fine detail (measured
 * entropy 4.3). That is the case where tracing to vectors loses nothing, because there
 * is no high-frequency content to lose. A photograph could not be rebuilt this way.
 *
 * THE MISTAKE THIS VERSION FIXES
 * The first attempt modelled the glow as a flat oval floating above a nearly-flat arc,
 * built from a three-point circle fit that gave a radius of 13712px. Rendering it read
 * as a lens flare detached from the planet, not as light on a limb.
 *
 * `scripts/measure-hero-limb.js` traces the actual limb — the last lit row before the
 * body goes dark, per column — and fits a circle to those points: **radius 671px
 * centred at (719.5, 870.5)**, with a mean fit error of 2.8px. The glow follows that
 * circle, which is why it now hugs the horizon instead of hovering over it.
 *
 * Layers, in paint order:
 *   1. Sky gradient.
 *   2. Wide halo  - the limb circle stroked wide and heavily blurred: the soft
 *      atmosphere bleeding off the horizon.
 *   3. Core arc   - the same circle stroked thin and less blurred: the bright crest.
 *   4. Planet     - the limb circle filled dark, drawn over the inner half of both
 *      strokes so only the part above the horizon shows.
 *   5. Cursor glow- the interactive layer, off until a pointer moves.
 *
 * Usage:
 *   node scripts/build-hero-svg.js            # write public/hero/hero.svg
 *   node scripts/build-hero-svg.js --compare  # also report error vs the source
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PUBLIC = path.join(__dirname, "..", "public");
const SRC = path.join(__dirname, "..", "assets", "hero-source.png");
const OUT = path.join(PUBLIC, "hero", "hero.svg");

const W = 1440;
const H = 715;

/** Measured by scripts/measure-hero-limb.js, then lifted so the arc reads higher. */
const LIMB = { cx: 719.5, cy: 818, r: 671.5 };

const P = {
  skyTop: "#120d2e",
  skyUpper: "#0b0620",
  skyMid: "#070126",
  planetFill: "#030014",

  /**
   * How far ABOVE the limb the bright core sits, in px. The source's vertical profile
   * through the crest is lum 250 at y=120 and the limb is at y=198, so the peak is
   * ~78px above the limb. Centring the stroke on the limb instead put the brightest
   * light in the wrong place, which is why the first limb-following attempt read as a
   * dim halo rather than a lit horizon.
   */
  coreOffset: 78,
  coreWidth: 22,
  coreBlur: 10,

  /**
   * How far ABOVE the limb the wide halo sits.
   *
   * The row-by-row comparison (scripts/compare-hero-profile.js) showed the previous
   * version was +128 too bright at y=196, right where the planet cuts the light off,
   * and -40 too dim at y=76 higher up. Centring the halo on the limb puts its mass
   * exactly where the source is already going dark, so the halo is lifted instead.
   */
  haloOffset: 60,
  haloWidth: 120,
  haloBlur: 32,

  hotWidth: 16,

  /**
   * Light bleeding onto the planet's own surface, just inside the limb.
   *
   * Present at the sides in the source but not at the crest, where the cut is hard.
   * Kept faint for that reason: a stronger bleed scored worse everywhere.
   */
  innerWidth: 60,
  innerBlur: 24,
  innerOpacity: 0.15,
};

/**
 * The gradient along the arc. A vertical linear gradient cannot follow a curve, but
 * the arc is horizontal at its crest and turns down at the sides, so a horizontal
 * gradient reads correctly: bright where the crest is, dim where it curves away.
 *
 * Stop positions come from the source's horizontal profile at y=140:
 *
 *   x=480 lum 104 #6261ba     x=840 lum 222 #d9dcfb
 *   x=540 lum 215 #d9d3f3     x=900 lum 207 #d2cbf1
 *   x=600 lum 193 #e2b1ff     x=960 lum 104 #765bba
 *
 * The band is near-white over the crest (x 540-900, i.e. 0.375-0.625 of the width) and
 * falls to a dim blue-violet by x=960. As fractions of 1440 the bright stops therefore
 * sit at 0.41-0.61.
 */
const arcStops = (bright, mid, edge) => [
  [0, edge, 0],
  [0.26, edge, 0.12],
  [0.36, mid, 0.8],
  [0.41, bright, 1],
  [0.61, bright, 1],
  [0.66, mid, 0.8],
  [0.76, edge, 0.12],
  [1, edge, 0],
];

/** The crest gradient: white at the apex, blue-violet where the arc curves away. */
const CORE_ARC = ["#ffffff", "#dcb6ff", "#4a5fd8"];

/** The planet's own shading: light near the limb, falling into shadow inward. */
const PLANET_SHADE = [
  [0, "#010104"],
  [0.45, "#030016"],
  [0.72, "#060124"],
  [0.86, "#090232"],
  [0.94, "#0d0929"],
  [1, "#171241"],
];

const stopXml = (list) =>
  list
    .map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ""}/>`)
    .join("");

function buildSvg(p = P, limb = LIMB) {
  // The bright core is drawn on a slightly LARGER circle than the limb, so it sits
  // above the horizon rather than on it. See `coreOffset`.
  const coreR = limb.r + p.coreOffset;
  const haloR = limb.r + p.haloOffset;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" role="presentation" data-hero-art="">
  <defs>
    <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.skyTop}"/>
      <stop offset="0.14" stop-color="${p.skyUpper}"/>
      <stop offset="0.34" stop-color="${p.skyMid}"/>
      <stop offset="0.62" stop-color="#04001a"/>
      <stop offset="1" stop-color="#000102"/>
    </linearGradient>

    <linearGradient id="heroHalo" x1="0" y1="0" x2="1" y2="0">
      ${stopXml(arcStops("#c9a6ff", "#7b5ce0", "#3a2a8a"))}
    </linearGradient>

    <linearGradient id="heroCore" x1="0" y1="0" x2="1" y2="0">
      ${stopXml(arcStops(...CORE_ARC))}
    </linearGradient>

    <!-- The hot spot: pure white, and gone by the time the arc curves away, so the
         blow-out is confined to the apex. -->
    <linearGradient id="heroHot" x1="0" y1="0" x2="1" y2="0">
      ${stopXml([[0, "#ffffff", 0], [0.42, "#ffffff", 0.55], [0.5, "#ffffff", 1], [0.58, "#ffffff", 0.55], [1, "#ffffff", 0]])}
    </linearGradient>

    <!-- The planet's own shading. A flat fill reads as a cut-out disc; the source
         shades the body, so the visible cap is lit near its edge and fades inward. -->
    <radialGradient id="heroPlanetShade" cx="50%" cy="50%" r="50%">
      ${stopXml(PLANET_SHADE.map(([o, c]) => [o, c]))}
    </radialGradient>

    <radialGradient id="heroCursor" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="0.22" stop-color="#e4c6ff" stop-opacity="0.6"/>
      <stop offset="0.45" stop-color="#a86dff" stop-opacity="0.35"/>
      <stop offset="0.7" stop-color="#4714d9" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#4714d9" stop-opacity="0"/>
    </radialGradient>

    <filter id="heroHaloBlur" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="${p.haloBlur}"/>
    </filter>
    <filter id="heroCoreBlur" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="${p.coreBlur}"/>
    </filter>
    <filter id="heroInnerBlur" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="${p.innerBlur}"/>
    </filter>

    <!-- Clips the inner bleed to the planet, so it only lights the surface. -->
    <clipPath id="heroPlanetClip">
      <circle cx="${limb.cx}" cy="${limb.cy}" r="${limb.r}"/>
    </clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#heroSky)"/>

  <!-- Atmosphere: the limb stroked wide, so the light bleeds off the horizon. -->
  <circle cx="${limb.cx}" cy="${limb.cy}" r="${haloR}" fill="none"
          stroke="url(#heroHalo)" stroke-width="${p.haloWidth}" filter="url(#heroHaloBlur)"/>

  <!-- The bright crest: a slightly larger circle, so the peak light sits above the
       horizon where the source has it, not on the limb. -->
  <circle cx="${limb.cx}" cy="${limb.cy}" r="${coreR}" fill="none"
          stroke="url(#heroCore)" stroke-width="${p.coreWidth}" filter="url(#heroCoreBlur)"/>

  <!-- The hot spot at the apex. -->
  <circle cx="${limb.cx}" cy="${limb.cy}" r="${coreR}" fill="none"
          stroke="url(#heroHot)" stroke-width="${p.hotWidth}" filter="url(#heroCoreBlur)"/>

  <!-- The planet itself, over the inner half of the strokes above. -->
  <circle cx="${limb.cx}" cy="${limb.cy}" r="${limb.r}" fill="url(#heroPlanetShade)"/>

  <!-- Inner bleed, clipped to the planet so it lights the surface just under the
       horizon. Drawn after the planet, or the planet covers it. -->
  <g clip-path="url(#heroPlanetClip)">
    <circle cx="${limb.cx}" cy="${limb.cy}" r="${limb.r}" fill="none"
            stroke="url(#heroHalo)" stroke-width="${p.innerWidth}" filter="url(#heroInnerBlur)"
            opacity="${p.innerOpacity}"/>
  </g>

  <!-- Interactive layer, positioned by the custom properties written on the hero
       element by the pointer handler; opacity 0 until a pointer is over the hero. -->
  <ellipse data-cursor-glow="" cx="50%" cy="50%" rx="44%" ry="70%" fill="url(#heroCursor)" opacity="0"/>
</svg>
`;
}

async function compare() {
  const mine = await sharp(Buffer.from(buildSvg()))
    .resize(W, H, { fit: "fill" }).flatten({ background: "#000000" }).removeAlpha()
    .raw().toBuffer({ resolveWithObject: true });
  const orig = await sharp(SRC)
    .resize(W, H, { fit: "fill" }).removeAlpha()
    .raw().toBuffer({ resolveWithObject: true });

  if (mine.info.channels !== 3 || orig.info.channels !== 3) {
    throw new Error(`channel mismatch: svg=${mine.info.channels} src=${orig.info.channels}`);
  }

  let sum = 0, worst = 0, worstAt = null;
  const bands = Array.from({ length: 6 }, () => ({ n: 0, err: 0 }));
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 3;
      const e = (Math.abs(mine.data[i] - orig.data[i]) +
                 Math.abs(mine.data[i + 1] - orig.data[i + 1]) +
                 Math.abs(mine.data[i + 2] - orig.data[i + 2])) / 3;
      sum += e;
      if (e > worst) { worst = e; worstAt = { x, y }; }
      const b = bands[Math.min(5, Math.floor((y / H) * 6))];
      b.n++; b.err += e;
    }
  }
  const mae = sum / (W * H);
  console.log(`\n=== SELISIH vs SUMBER (0-255) ===`);
  console.log(`  MAE      : ${mae.toFixed(2)}`);
  console.log(`  akurasi  : ${(100 - (mae / 255) * 100).toFixed(2)}%`);
  console.log(`  terburuk : ${worst.toFixed(1)} di (${worstAt.x}, ${worstAt.y})`);
  console.log(`\n  per pita tinggi:`);
  bands.forEach((b, i) => {
    const lo = (i * 100 / 6).toFixed(0), hi = ((i + 1) * 100 / 6).toFixed(0);
    console.log(`    ${lo.padStart(3)}-${hi.padStart(3)}%  MAE ${(b.err / b.n).toFixed(2)}`);
  });

  await sharp({ create: { width: W * 2 + 20, height: H, channels: 3, background: "#222222" } })
    .composite([
      { input: await sharp(Buffer.from(buildSvg())).resize(W, H, { fit: "fill" }).png().toBuffer(), left: 0, top: 0 },
      { input: await sharp(SRC).resize(W, H, { fit: "fill" }).png().toBuffer(), left: W + 20, top: 0 },
    ])
    .png()
    .toFile("/tmp/hero_svg_compare.png");
  console.log(`\n  perbandingan: /tmp/hero_svg_compare.png (kiri SVG, kanan asli)`);
}

if (require.main === module) {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const svg = buildSvg();
  fs.writeFileSync(OUT, svg);
  console.log(`ditulis: ${OUT} (${(svg.length / 1024).toFixed(1)} KB)`);
  if (process.argv.includes("--compare")) compare();
}

module.exports = { buildSvg, P, LIMB };
