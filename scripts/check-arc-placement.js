/**
 * Where does the arc actually land on the RENDERED page?
 *
 * `measure-hero-arc.js` finds the arc in the source image; this checks the end
 * result. The distinction matters: the source position can be correct while the
 * page still hides the arc, because the sticky nav sits on top of it and
 * `object-cover` decides how much of the image is cropped away.
 *
 * Finds the brightest row of the screenshot (the arc) and compares it against the
 * nav's bottom edge. If the arc is above the nav, it is hidden behind it — which is
 * what happened on mobile when the arc was placed at a guessed position.
 *
 * Usage: node scripts/check-arc-placement.js <screenshot.png> [nav-bottom-px]
 */
const sharp = require("sharp");
const path = require("path");

const file = process.argv[2];
const navBottom = process.argv[3] ? Number(process.argv[3]) : null;

if (!file) {
  console.error("usage: node scripts/check-arc-placement.js <screenshot.png> [nav-bottom-px]");
  process.exit(1);
}

(async () => {
  const { data, info } = await sharp(path.resolve(file))
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const rows = [];
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let x = 0; x < width; x++) sum += data[(y * width + x) * channels];
    rows.push(sum / width);
  }

  // Smooth over a small window: a single bright row of antialiased text would
  // otherwise win over the arc, which is a broad glow.
  const win = Math.max(2, Math.round(height / 200));
  const smooth = rows.map((_, i) => {
    const a = Math.max(0, i - win), b = Math.min(rows.length, i + win + 1);
    return rows.slice(a, b).reduce((s, v) => s + v, 0) / (b - a);
  });

  // Only look in the upper half: the arc is a top-of-page feature, and looking at
  // the whole page would just find whatever section happens to be brightest.
  const limit = Math.floor(height / 2);
  const upper = smooth.slice(0, limit);
  const peak = upper.indexOf(Math.max(...upper));

  console.log(`gambar   : ${width}x${height}`);
  console.log(`puncak   : y=${peak}  (${((peak / height) * 100).toFixed(1)}% dari tinggi)`);
  console.log(`luminansi: ${upper[peak].toFixed(1)}  (latar ${Math.min(...upper).toFixed(1)})`);

  if (navBottom !== null) {
    console.log(`nav bawah: y=${navBottom}`);
    const clear = peak - navBottom;
    console.log(
      clear > 0
        ? `  -> arc ${clear}px DI BAWAH nav: terlihat`
        : `  -> arc ${-clear}px DI ATAS nav: TERTUTUP NAV`,
    );
  }
})();
