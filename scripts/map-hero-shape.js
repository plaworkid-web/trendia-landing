/**
 * Print the artwork's structure as a coarse map, so the SVG can be built to match.
 *
 * Numbers in isolation did not explain the image: the arc measured nearly flat
 * (radius 13712px, sag 17px) yet the horizontal profile showed a bright blob at the
 * centre falling to black by the edges, and the vertical falloff was non-monotonic
 * (bright at dy=0, black at dy=80, faintly lit again at dy=140). That combination
 * only makes sense with a picture of the whole thing, so this prints:
 *
 *   1. An ASCII luminance map, to see the shape.
 *   2. A vertical profile through the crest, to find the layers.
 *   3. A horizontal profile just under the crest, to size the glow.
 */
const sharp = require("sharp");
const path = require("path");

const SRC = path.join(__dirname, "..", "assets", "hero-source.png");

(async () => {
  const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  const lum = (x, y) => {
    const i = (y * W + x) * C;
    return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  };
  const hex = (x, y) => {
    const i = (y * W + x) * C;
    return "#" + [data[i], data[i + 1], data[i + 2]].map((v) => v.toString(16).padStart(2, "0")).join("");
  };

  // ---- 1. ASCII luminance map -----------------------------------------
  const GW = 72, GH = 30;
  console.log("=== PETA LUMINANSI (lebar penuh, tinggi penuh) ===");
  console.log(`   sumber ${W}x${H}; tiap sel = ${(W / GW).toFixed(1)}x${(H / GH).toFixed(1)} px`);
  const ramp = " .:-=+*#%@";
  const maxL = (() => { let m = 0; for (let y = 0; y < H; y += 4) for (let x = 0; x < W; x += 4) m = Math.max(m, lum(x, y)); return m; })();
  for (let gy = 0; gy < GH; gy++) {
    let line = "";
    for (let gx = 0; gx < GW; gx++) {
      // Average the cell so thin features are not missed by point sampling.
      let sum = 0, n = 0;
      const x0 = Math.floor((gx * W) / GW), x1 = Math.floor(((gx + 1) * W) / GW);
      const y0 = Math.floor((gy * H) / GH), y1 = Math.floor(((gy + 1) * H) / GH);
      for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) { sum += lum(x, y); n++; }
      const v = sum / Math.max(1, n);
      line += ramp[Math.min(ramp.length - 1, Math.round((v / maxL) * (ramp.length - 1)))];
    }
    const yPct = (((gy + 0.5) * H) / GH / H * 100).toFixed(0);
    console.log(`  ${String(yPct).padStart(3)}% |${line}|`);
  }
  console.log(`  skala: ' '=0  '@'=${maxL.toFixed(0)}`);

  // ---- 2. Vertical profile through the crest ---------------------------
  console.log("\n=== PROFIL VERTIKAL di x=720 (tengah) ===");
  console.log("     y    y%    lum    warna");
  for (let y = 0; y < H; y += 12) {
    const v = lum(720, y);
    const bar = "#".repeat(Math.round((v / 255) * 40));
    console.log(`  ${String(y).padStart(4)}  ${String(Math.round((y / H) * 100)).padStart(3)}%  ${v.toFixed(1).padStart(6)}  ${hex(720, y)}  ${bar}`);
  }

  // ---- 3. Horizontal profile under the crest ---------------------------
  console.log("\n=== PROFIL HORIZONTAL di y=140 (sedikit di bawah puncak) ===");
  console.log("     x    x%    lum    warna");
  for (let x = 0; x < W; x += 60) {
    const v = lum(x, 140);
    const bar = "#".repeat(Math.round((v / 255) * 40));
    console.log(`  ${String(x).padStart(4)}  ${String(Math.round((x / W) * 100)).padStart(3)}%  ${v.toFixed(1).padStart(6)}  ${hex(x, 140)}  ${bar}`);
  }

  // ---- 4. Where is the brightest pixel, precisely? --------------------
  let bx = 0, by = 0, bv = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = lum(x, y);
    if (v > bv) { bv = v; bx = x; by = y; }
  }
  console.log(`\n=== PIXEL TERTERANG ===`);
  console.log(`  x=${bx} (${((bx / W) * 100).toFixed(1)}%)  y=${by} (${((by / H) * 100).toFixed(1)}%)  lum=${bv.toFixed(1)}  warna=${hex(bx, by)}`);
})();
