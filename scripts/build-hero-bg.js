/**
 * Generate the hero background set.
 *
 * WHY THIS EXISTS
 * The source artwork is 1440x715 (aspect 2.01) and was rendered with `object-cover`
 * at every viewport. Measured on the live site, that meant:
 *
 *   - upscaled 1.26x at 1512px, 1.33x at 1920px, 2.39x at 3440px  -> soft
 *   - only 23% of the artwork visible at 390px wide                 -> the arc, which
 *     is the entire point of the image, was cropped to a thin strip
 *   - 511KB PNG sent to every device, phones included
 *
 * THE HONEST LIMIT
 * The source has no detail above 1440px, so a larger render is interpolation, not
 * new information. That is acceptable here for a specific reason: this artwork is
 * smooth vector-style gradients with no noise, texture or fine edges (measured
 * entropy 4.3). A gradient survives upscaling almost losslessly, where a photograph
 * would not. If this is ever replaced with a photographic background, it needs a
 * genuinely large source — this script cannot substitute for that.
 *
 * HOW THE CROP IS CHOSEN
 * Each target is aspect-matched to the viewport class it serves, and the crop window
 * is positioned so the glowing arc lands at a chosen height. Cropping in CSS cannot
 * do this: `object-cover` centres the image, which is what put the arc in a thin
 * strip at the top on mobile.
 *
 * Run: node scripts/build-hero-bg.js
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// The source lives in assets/, NOT public/: everything in public/ is served
// statically, and this 511KB file is an input to the build, never requested by a
// browser. It used to sit in public/ and was served on every deploy for nothing.
const ASSETS = path.join(__dirname, "..", "assets");
const PUBLIC = path.join(__dirname, "..", "public");
const SRC = path.join(ASSETS, "hero-source.png");
const OUT = path.join(PUBLIC, "hero");

/**
 * The luminous crest in the source, as a fraction of its height.
 *
 * MEASURED, not estimated: `scripts/measure-hero-arc.js` finds the brightest row of
 * the artwork, which is the crest. It reports 0.187, and the profile confirms the
 * shape is a curve rather than a flat horizon (luminance across the peak row is 198
 * at the centre against 6 at the edges).
 *
 * This started as a visual guess of 0.38, which was wrong by 19 points. The crops
 * were positioned around an arc that did not exist there, so the mobile crop began
 * at y=147 and cut the real crest at y=134 clean out of the image. The result was a
 * hero with no arc in it, which is what the mobile screenshot showed.
 */
const ARC_Y = 0.187;

/**
 * One entry per viewport class.
 *
 * `arcAt` is where the crest should sit in the finished image. It rises as the
 * frame gets taller: a portrait phone has the headline just under the arc, so the
 * arc belongs in the upper third; a wide desktop has room to spare and can afford
 * the arc nearer the middle.
 */
const VARIANTS = [
  { name: "hero-wide", width: 3440, height: 1440, arcAt: 0.26, quality: 82 },
  { name: "hero-desktop", width: 2560, height: 1440, arcAt: 0.28, quality: 84 },
  { name: "hero-laptop", width: 2268, height: 1473, arcAt: 0.26, quality: 84 },
  { name: "hero-tablet", width: 1536, height: 1152, arcAt: 0.25, quality: 86 },
  { name: "hero-mobile", width: 860, height: 1864, arcAt: 0.24, quality: 86 },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const meta = await sharp(SRC).metadata();
  console.log(`sumber: ${meta.width}x${meta.height} (rasio ${(meta.width / meta.height).toFixed(2)})\n`);

  for (const v of VARIANTS) {
    const targetAspect = v.width / v.height;

    /**
     * Largest source crop with the target's aspect, positioned so the arc sits at
     * `arcAt` of the crop.
     *
     * The arc is at absolute y = ARC_Y * srcH. Inside a crop of height Hc starting
     * at `top`, it appears at (arcAbs - top) / Hc, which must equal arcAt. So
     * `top = arcAbs - arcAt * Hc`, and the crop must stay inside the source:
     *
     *   top >= 0            ->  Hc <= arcAbs / arcAt
     *   top + Hc <= srcH    ->  Hc <= (srcH - arcAbs) / (1 - arcAt)
     *   width fits          ->  Hc <= srcW / targetAspect
     */
    const arcAbs = meta.height * ARC_Y;
    const maxByTop = arcAbs / v.arcAt;
    const maxByBottom = (meta.height - arcAbs) / (1 - v.arcAt);
    const maxByWidth = meta.width / targetAspect;
    const hc = Math.floor(Math.min(maxByTop, maxByBottom, maxByWidth, meta.height));
    const wc = Math.floor(hc * targetAspect);
    const top = Math.round(Math.min(meta.height - hc, Math.max(0, arcAbs - v.arcAt * hc)));
    const left = Math.round((meta.width - wc) / 2);

    const upscale = (v.width / wc).toFixed(2);

    // Crop the source region first, then resize it to the target. Order matters:
    // resizing before cropping would change which pixels the window covers.
    const base = sharp(SRC)
      .extract({ left, top, width: wc, height: hc })
      .resize(v.width, v.height, { fit: "fill", kernel: "lanczos3" });

    const webp = path.join(OUT, `${v.name}.webp`);
    const avif = path.join(OUT, `${v.name}.avif`);
    const jpg = path.join(OUT, `${v.name}.jpg`);
    await base.clone().webp({ quality: v.quality, effort: 6 }).toFile(webp);
    await base.clone().avif({ quality: v.quality - 6, effort: 4 }).toFile(avif);
    await base.clone().jpeg({ quality: v.quality - 2, mozjpeg: true }).toFile(jpg);

    const kb = (p) => (fs.statSync(p).size / 1024).toFixed(0);
    console.log(
      `${v.name.padEnd(14)} ${String(v.width).padStart(4)}x${String(v.height).padStart(4)}` +
      `  crop ${wc}x${hc}@(${left},${top})  arc@${(v.arcAt * 100).toFixed(0)}%` +
      `  upscale ${upscale}x  webp=${kb(webp)}KB avif=${kb(avif)}KB jpg=${kb(jpg)}KB`,
    );
  }

  console.log(`\nsumber PNG: ${(fs.statSync(SRC).size / 1024).toFixed(0)}KB -> varian di public/hero/`);
})();
