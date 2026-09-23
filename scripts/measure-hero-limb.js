/**
 * Measure the planet's limb: the edge where the glow ends and the dark body begins.
 *
 * The first SVG modelled the glow as a flat oval floating in the sky, which read as a
 * lens flare rather than a lit planet. The source's glow follows the limb, so the
 * shape to trace is the LIMB, not the glow's brightest row.
 *
 * For each column this walks down until the luminance collapses after having been lit,
 * which is where the planet's body begins. Fitting a circle to those points gives the
 * arc the glow has to follow.
 *
 * Usage: node scripts/measure-hero-limb.js
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

  // The limb: the last lit row before the body goes dark.
  const pts = [];
  for (let x = 0; x < W; x += 4) {
    let lit = false, limb = null;
    for (let y = 0; y < H; y++) {
      const v = lum(x, y);
      if (v > 45) lit = true;
      else if (lit && v < 12) { limb = y; break; }
    }
    if (limb !== null) pts.push({ x, y: limb });
  }

  if (pts.length < 10) {
    console.log("limb tidak terdeteksi");
    return;
  }

  // Fit a circle by least squares (Kasa fit), which tolerates the noisy edge better
  // than the three-point construction used before.
  let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, sxz = 0, syz = 0, sz = 0;
  for (const p of pts) {
    const z = p.x * p.x + p.y * p.y;
    sx += p.x; sy += p.y; sxx += p.x * p.x; syy += p.y * p.y;
    sxy += p.x * p.y; sxz += p.x * z; syz += p.y * z; sz += z;
  }
  const n = pts.length;
  const a11 = 2 * (sxx - (sx * sx) / n);
  const a12 = 2 * (sxy - (sx * sy) / n);
  const a22 = 2 * (syy - (sy * sy) / n);
  const b1 = sxz - (sx * sz) / n;
  const b2 = syz - (sy * sz) / n;
  const det = a11 * a22 - a12 * a12;
  const cx = (b1 * a22 - b2 * a12) / det;
  const cy = (a11 * b2 - a12 * b1) / det;
  const r = Math.sqrt((sxx - 2 * cx * sx + n * cx * cx + syy - 2 * cy * sy + n * cy * cy) / n);

  const errs = pts.map((p) => Math.abs(Math.hypot(p.x - cx, p.y - cy) - r));
  const meanErr = errs.reduce((a, b) => a + b, 0) / errs.length;

  console.log("=== LIMBA PLANET ===");
  console.log(`  titik terdeteksi : ${n} dari ${Math.floor(W / 4) + 1} kolom`);
  console.log(`  pusat lingkaran  : (${cx.toFixed(1)}, ${cy.toFixed(1)})`);
  console.log(`  radius           : ${r.toFixed(1)} px`);
  console.log(`  error rata-rata  : ${meanErr.toFixed(2)} px  (${meanErr < 3 ? "busur bersih" : "busur kasar"})`);

  console.log("\n  contoh titik (x, y limba):");
  for (const f of [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]) {
    const p = pts[Math.min(pts.length - 1, Math.round(f * (pts.length - 1)))];
    console.log(`    x=${String(p.x).padStart(4)}  y=${String(p.y).padStart(3)}`);
  }

  // How far above the limb does the glow reach, per column? That sets the stroke width.
  console.log("\n  tinggi glow di atas limba:");
  for (const f of [0.1, 0.25, 0.5, 0.75, 0.9]) {
    const p = pts[Math.min(pts.length - 1, Math.round(f * (pts.length - 1)))];
    let top = p.y;
    for (let y = p.y; y >= 0; y--) {
      if (lum(p.x, y) < 25) { top = y; break; }
      top = y;
    }
    console.log(`    x=${String(p.x).padStart(4)}  limba y=${String(p.y).padStart(3)}  glow sampai y=${String(top).padStart(3)}  tinggi=${p.y - top}px`);
  }

  console.log("\n=== JSON untuk generator ===");
  console.log(JSON.stringify({ limb: { cx: +cx.toFixed(1), cy: +cy.toFixed(1), r: +r.toFixed(1), meanErr: +meanErr.toFixed(2) } }));
})();
