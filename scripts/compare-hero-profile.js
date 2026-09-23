/**
 * Compare the vertical profile of the SVG against the source, row by row.
 *
 * MAE alone says "how wrong" but not "wrong where". The source's profile through the
 * crest is known:
 *
 *   y= 96 135   y=132 208   y=168 117   y=204   2  <- limb
 *   y=108 192   y=144 167   y=180 111
 *   y=120 250 <- peak        y=192 100
 *
 * So the glow is a BROAD band: ~110px tall, from y~90 to the limb at y~198, with the
 * peak at y=120. A stroke 45px wide cannot cover 110px, which is why the mid band
 * scores worst. This prints both profiles side by side to confirm that reading.
 *
 * Usage: node scripts/compare-hero-profile.js
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

  const cols = [
    { name: "puncak x=720", x: 720 },
    { name: "kiri  x=540", x: 540 },
    { name: "kanan x=900", x: 900 },
  ];

  for (const { name, x } of cols) {
    console.log(`\n=== PROFIL VERTIKAL ${name} ===`);
    console.log("     y    asli   svg   selisih");
    let worst = { d: 0, y: 0 };
    for (let y = 60; y <= 240; y += 8) {
      const o = lum(orig.data, x, y), m = lum(mine.data, x, y);
      const d = m - o;
      if (Math.abs(d) > Math.abs(worst.d)) worst = { d, y };
      const flag = Math.abs(d) > 40 ? "  <<<" : "";
      console.log(`  ${String(y).padStart(4)}  ${o.toFixed(0).padStart(5)}  ${m.toFixed(0).padStart(5)}  ${d > 0 ? "+" : ""}${d.toFixed(0).padStart(5)}${flag}`);
    }
    console.log(`  selisih terbesar: ${worst.d > 0 ? "+" : ""}${worst.d.toFixed(0)} di y=${worst.y}`);
  }

  // Total glow mass: how much light energy each has in the top third.
  let om = 0, mm = 0;
  for (let y = 0; y < H / 3; y++) for (let x = 0; x < W; x += 2) { om += lum(orig.data, x, y); mm += lum(mine.data, x, y); }
  console.log(`\n=== TOTAL CAHAYA di sepertiga atas ===`);
  console.log(`  asli : ${(om / 1e6).toFixed(2)} juta`);
  console.log(`  svg  : ${(mm / 1e6).toFixed(2)} juta`);
  console.log(`  rasio: ${(mm / om).toFixed(3)}  ${mm < om ? "(svg KURANG terang)" : "(svg LEBIH terang)"}`);
})();
