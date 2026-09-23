/**
 * Measure the hero artwork so it can be rebuilt as SVG.
 *
 * The goal is a faithful vector copy, so this extracts the numbers that define the
 * image rather than eyeballing them:
 *
 *   1. The arc's y position at many x positions -> the curve's shape and radius.
 *   2. The colour along the arc -> the gradient stops.
 *   3. The background above and below -> the base fill.
 *   4. How the glow falls off with distance from the arc -> the blur radius.
 *
 * Output is JSON on stdout so the generator can consume it directly.
 */
const sharp = require("sharp");
const path = require("path");

const SRC = path.join(__dirname, "..", "assets", "hero-source.png");

(async () => {
  const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  const px = (x, y) => {
    const i = (y * W + x) * C;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const lum = (x, y) => {
    const [r, g, b] = px(x, y);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const hex = ([r, g, b]) =>
    "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

  // ---- 1. The arc: brightest row at each column -------------------------
  // Search only the upper half; the lower half is the dark planet body.
  const limit = Math.floor(H * 0.6);
  const cols = [];
  for (let x = 0; x < W; x += 2) {
    let best = -1, bestY = 0;
    for (let y = 0; y < limit; y++) {
      const v = lum(x, y);
      if (v > best) { best = v; bestY = y; }
    }
    cols.push({ x, y: bestY, lum: +best.toFixed(1) });
  }

  const peak = cols.reduce((a, b) => (b.lum > a.lum ? b : a));
  const edgeL = cols[0], edgeR = cols[cols.length - 1];

  // ---- 2. Fit a circle through the arc --------------------------------
  // Three points (left edge, crest, right edge) define the circle. If the arc is a
  // circle, its centre is far below the image and the radius is large.
  const p1 = { x: edgeL.x, y: edgeL.y };
  const p2 = { x: peak.x, y: peak.y };
  const p3 = { x: edgeR.x, y: edgeR.y };
  const d = 2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
  let circle = null;
  if (Math.abs(d) > 1e-6) {
    const ux =
      ((p1.x ** 2 + p1.y ** 2) * (p2.y - p3.y) +
        (p2.x ** 2 + p2.y ** 2) * (p3.y - p1.y) +
        (p3.x ** 2 + p3.y ** 2) * (p1.y - p2.y)) / d;
    const uy =
      ((p1.x ** 2 + p1.y ** 2) * (p3.x - p2.x) +
        (p2.x ** 2 + p2.y ** 2) * (p1.x - p3.x) +
        (p3.x ** 2 + p3.y ** 2) * (p2.x - p1.x)) / d;
    circle = {
      cx: +ux.toFixed(1),
      cy: +uy.toFixed(1),
      r: +Math.hypot(p1.x - ux, p1.y - uy).toFixed(1),
    };
  }

  // ---- 3. Colours along the arc ---------------------------------------
  // Sample at the crest and at several points across, so the gradient is measured
  // where the glow actually is.
  const samples = [0.08, 0.25, 0.5, 0.75, 0.92].map((f) => {
    const x = Math.round((W - 1) * f);
    const c = cols.reduce((a, b) => (Math.abs(b.x - x) < Math.abs(a.x - x) ? b : a));
    // Brightest pixel in a small window around the arc, to catch the core.
    let best = [0, 0, 0], bestV = -1;
    for (let dy = -3; dy <= 3; dy++) {
      const y = Math.max(0, Math.min(H - 1, c.y + dy));
      const v = lum(c.x, y);
      if (v > bestV) { bestV = v; best = px(c.x, y); }
    }
    return { at: f, x: c.x, y: c.y, colour: hex(best), lum: +bestV.toFixed(1) };
  });

  // ---- 4. Background: top, mid, bottom --------------------------------
  const bg = {
    top: hex(px(Math.round(W * 0.5), 2)),
    topQuarter: hex(px(Math.round(W * 0.5), Math.round(H * 0.08))),
    midBelow: hex(px(Math.round(W * 0.5), Math.round(H * 0.55))),
    bottom: hex(px(Math.round(W * 0.5), H - 3)),
    cornerTL: hex(px(3, 3)),
    cornerBR: hex(px(W - 3, H - 3)),
  };

  // ---- 5. Glow falloff below the crest --------------------------------
  const cx = peak.x;
  const falloff = [];
  for (const dy of [0, 10, 20, 40, 80, 140, 220, 320, 450]) {
    const y = Math.min(H - 1, peak.y + dy);
    falloff.push({ dy, lum: +lum(cx, y).toFixed(1), colour: hex(px(cx, y)) });
  }

  // ---- 6. Horizontal extent of the glow -------------------------------
  const rowAtPeak = [];
  for (let x = 0; x < W; x += Math.floor(W / 12)) {
    rowAtPeak.push({ x, lum: +lum(x, peak.y).toFixed(1) });
  }

  console.log(JSON.stringify({
    source: { width: W, height: H, aspect: +(W / H).toFixed(3) },
    arc: {
      peak: { x: peak.x, y: peak.y, fracY: +(peak.y / H).toFixed(4) },
      leftEdge: { x: edgeL.x, y: edgeL.y },
      rightEdge: { x: edgeR.x, y: edgeR.y },
      sag: +(peak.y - (edgeL.y + edgeR.y) / 2).toFixed(1),
      circle,
    },
    arcColours: samples,
    background: bg,
    glowFalloff: falloff,
    arcHorizontalProfile: rowAtPeak,
  }, null, 1));
})();
