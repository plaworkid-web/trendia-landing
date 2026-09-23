/**
 * Measure the apex hot spot in the source and in the rendered SVG.
 *
 * Vision keeps reporting the rebuilt apex as "not white enough", and MAE is a poor
 * judge of a small blown-out highlight: a 40x20px region of a 1440x715 image is 0.08%
 * of the pixels, so it barely moves the average. This measures that region directly.
 *
 * Usage: node scripts/measure-hero-apex.js
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

  const rgb = (buf, x, y) => {
    const i = (y * W + x) * 3;
    return [buf[i], buf[i + 1], buf[i + 2]];
  };
  const lum = (buf, x, y) => {
    const [r, g, b] = rgb(buf, x, y);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  console.log("=== NILAI DI PUNCAK (x=700) ===");
  console.log("     y    asli RGB          svg RGB           asli lum  svg lum");
  for (let y = 100; y <= 200; y += 10) {
    const o = rgb(orig.data, 700, y), m = rgb(mine.data, 700, y);
    const ol = lum(orig.data, 700, y), ml = lum(mine.data, 700, y);
    console.log(
      `  ${String(y).padStart(4)}  ${o.map((v) => String(v).padStart(3)).join(",")}` +
      `   ${m.map((v) => String(v).padStart(3)).join(",")}` +
      `   ${ol.toFixed(0).padStart(6)}  ${ml.toFixed(0).padStart(6)}`,
    );
  }

  // How wide is the blown-out region (lum > 230)?
  const countBlown = (buf) => {
    let n = 0, minX = 1e9, maxX = -1, minY = 1e9, maxY = -1;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (lum(buf, x, y) > 230) {
          n++;
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
    }
    return { n, w: maxX - minX, h: maxY - minY, minX, maxX, minY, maxY };
  };

  const ob = countBlown(orig.data), mb = countBlown(mine.data);
  console.log("\n=== AREA PUTIH (lum > 230) ===");
  console.log(`  asli: ${ob.n} px  (x ${ob.minX}-${ob.maxX} = ${ob.w}px lebar, y ${ob.minY}-${ob.maxY} = ${ob.h}px tinggi)`);
  console.log(`  svg : ${mb.n} px  (x ${mb.minX}-${mb.maxX} = ${mb.w}px lebar, y ${mb.minY}-${mb.maxY} = ${mb.h}px tinggi)`);
  console.log(`  rasio: ${(mb.n / ob.n).toFixed(3)}  ${mb.n < ob.n ? "(svg KURANG putih)" : "(svg LEBIH putih)"}`);

  // The brightest pixel of each.
  let obv = -1, obp = null, mbv = -1, mbp = null;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ol = lum(orig.data, x, y), ml = lum(mine.data, x, y);
    if (ol > obv) { obv = ol; obp = { x, y }; }
    if (ml > mbv) { mbv = ml; mbp = { x, y }; }
  }
  console.log(`\n=== PIXEL TERTERANG ===`);
  console.log(`  asli: lum ${obv.toFixed(0)} di (${obp.x}, ${obp.y})  rgb ${rgb(orig.data, obp.x, obp.y).join(",")}`);
  console.log(`  svg : lum ${mbv.toFixed(0)} di (${mbp.x}, ${mbp.y})  rgb ${rgb(mine.data, mbp.x, mbp.y).join(",")}`);
})();
