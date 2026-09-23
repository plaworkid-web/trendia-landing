/**
 * Measure how the source shades the planet's body, so the SVG can match it.
 *
 * The planet is a flat fill (`#030014`) in the rebuild. The question is whether the
 * source is flat too, or whether it has a gradient that makes it read as a sphere.
 *
 * The limb circle is at (719.5, 870.5) with r=671.5, so the visible cap is the part
 * above y~198. Samples are taken along the vertical centre line and along a horizontal
 * line, and reported with their distance from the limb edge.
 */
const sharp = require("sharp");
const path = require("path");

const SRC = path.join(__dirname, "..", "assets", "hero-source.png");
const LIMB = { cx: 719.5, cy: 870.5, r: 671.5 };

(async () => {
  const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  const rgb = (x, y) => {
    const i = (Math.round(y) * W + Math.round(x)) * C;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const hex = ([r, g, b]) =>
    "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Distance inside the limb for a point: r - distance to centre.
  const inside = (x, y) => LIMB.r - Math.hypot(x - LIMB.cx, y - LIMB.cy);

  console.log("=== BADAN PLANET: profil vertikal di x=720 ===");
  console.log("     y   di dalam limba   warna      lum");
  for (let y = 200; y <= 700; y += 25) {
    const c = rgb(720, y);
    console.log(
      `  ${String(y).padStart(4)}   ${inside(720, y).toFixed(0).padStart(6)}px      ` +
      `${hex(c)}  ${lum(c).toFixed(1).padStart(5)}`,
    );
  }

  console.log("\n=== BADAN PLANET: profil mendatar di y=300 ===");
  console.log("     x   di dalam limba   warna      lum");
  for (let x = 100; x <= 1340; x += 80) {
    const d = inside(x, 300);
    if (d < 0) continue; // outside the planet
    const c = rgb(x, 300);
    console.log(
      `  ${String(x).padStart(4)}   ${d.toFixed(0).padStart(6)}px      ` +
      `${hex(c)}  ${lum(c).toFixed(1).padStart(5)}`,
    );
  }

  // Is the body uniform, or does it vary with depth? Compare the extremes.
  console.log("\n=== APAKAH BADANNYA RATA? ===");
  let min = 999, max = -1, minAt = null, maxAt = null;
  for (let y = 205; y < H; y += 3) {
    for (let x = 0; x < W; x += 3) {
      if (inside(x, y) < 8) continue; // stay clear of the edge
      const l = lum(rgb(x, y));
      if (l < min) { min = l; minAt = { x, y }; }
      if (l > max) { max = l; maxAt = { x, y }; }
    }
  }
  console.log(`  luminan minimum ${min.toFixed(1)} di (${minAt.x}, ${minAt.y}) = ${hex(rgb(minAt.x, minAt.y))}`);
  console.log(`  luminan maksimum ${max.toFixed(1)} di (${maxAt.x}, ${maxAt.y}) = ${hex(rgb(maxAt.x, maxAt.y))}`);
  console.log(`  rentang ${(max - min).toFixed(1)}  -> ${max - min < 12 ? "RATA (bukan bola)" : "BERGRADASI (ada bentuk bola)"}`);

  // Where is the brightest part of the body? That is where the sphere's light falls.
  console.log("\n=== DI MANA BAGIAN TERANG BADAN? ===");
  const bands = {};
  for (let y = 205; y < H; y += 4) {
    for (let x = 0; x < W; x += 4) {
      const d = inside(x, y);
      if (d < 10) continue;
      const bucket = Math.min(6, Math.floor(d / 120));
      bands[bucket] = bands[bucket] || { n: 0, sum: 0 };
      bands[bucket].n++;
      bands[bucket].sum += lum(rgb(x, y));
    }
  }
  for (const [b, v] of Object.entries(bands)) {
    const lo = b * 120, hi = lo + 120;
    console.log(`  ${String(lo).padStart(4)}-${String(hi).padStart(4)}px dari tepi: rata-rata lum ${(v.sum / v.n).toFixed(1)}`);
  }
})();
