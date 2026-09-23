/**
 * Measure colour banding in the SVG's arc, objectively.
 *
 * Vision reports "posterized" steps between the purple and blue. Banding is real when
 * a gradient jumps between distinct luminance levels instead of moving continuously, so
 * this counts the steps along a horizontal scan through the arc in both images.
 *
 * A smooth gradient produces many small steps; a banded one produces few large jumps.
 *
 * Usage: node scripts/measure-hero-banding.js
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "assets", "hero-source.png");
const SVG = path.join(__dirname, "..", "public", "hero", "hero.svg");
const W = 1440, H = 715;

(async () => {
  const mine = await sharp(fs.readFileSync(SVG))
    .resize(W, H, { fit: "fill" }).flatten({ background: "#000000" }).removeAlpha()
    .raw().toBuffer({ resolveWithObject: true });
  const orig = await sharp(SRC)
    .resize(W, H, { fit: "fill" }).removeAlpha()
    .raw().toBuffer({ resolveWithObject: true });

  const lum = (buf, x, y) => {
    const i = (y * W + x) * 3;
    return 0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2];
  };

  /** Walk a row and count luminance jumps larger than a threshold. */
  function steps(buf, y, x0, x1, threshold) {
    let count = 0, maxJump = 0;
    let prev = lum(buf, x0, y);
    for (let x = x0 + 1; x <= x1; x++) {
      const v = lum(buf, x, y);
      const d = Math.abs(v - prev);
      if (d > threshold) count++;
      if (d > maxJump) maxJump = d;
      prev = v;
    }
    return { count, maxJump };
  }

  console.log("=== LANGKAH GRADASI (baris mendatar melalui busur) ===");
  console.log("  ambang |  asli: langkah/maxjump |  svg: langkah/maxjump");
  for (const y of [120, 140, 160]) {
    for (const th of [2, 4, 8]) {
      const o = steps(orig.data, y, 300, 1140, th);
      const m = steps(mine.data, y, 300, 1140, th);
      console.log(
        `  y=${y} th=${th} |  ${String(o.count).padStart(5)} / ${o.maxJump.toFixed(0).padStart(3)}` +
        `        |  ${String(m.count).padStart(5)} / ${m.maxJump.toFixed(0).padStart(3)}` +
        `   ${m.maxJump > o.maxJump * 1.8 ? "<<< svg lebih kasar" : ""}`,
      );
    }
  }

  // Distinct luminance levels across the arc: banding shows as few, widely spaced ones.
  console.log("\n=== TINGKAT LUMINAN UNIK (y=140, x 300-1140) ===");
  const levels = (buf) => {
    const set = new Set();
    for (let x = 300; x <= 1140; x++) set.add(Math.round(lum(buf, x, 140)));
    return set.size;
  };
  const ol = levels(orig.data), ml = levels(mine.data);
  console.log(`  asli: ${ol} tingkat`);
  console.log(`  svg : ${ml} tingkat`);
  console.log(`  rasio: ${(ml / ol).toFixed(2)}  ${ml < ol * 0.6 ? "(svg BANDING)" : "(serupa)"}`);

  // Vertical scan through the glow, where banding would be most visible.
  console.log("\n=== TINGKAT LUMINAN UNIK (x=720, y 80-200) ===");
  const vlevels = (buf) => {
    const set = new Set();
    for (let y = 80; y <= 200; y++) set.add(Math.round(lum(buf, 720, y)));
    return set.size;
  };
  const ov = vlevels(orig.data), mv = vlevels(mine.data);
  console.log(`  asli: ${ov} tingkat`);
  console.log(`  svg : ${mv} tingkat`);
  console.log(`  rasio: ${(mv / ov).toFixed(2)}  ${mv < ov * 0.6 ? "(svg BANDING)" : "(serupa)"}`);
})();
