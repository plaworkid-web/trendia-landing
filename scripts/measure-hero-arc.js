/**
 * Find where the glowing arc actually sits in the source artwork.
 *
 * The build script needs this number to position each crop, and it was previously
 * hardcoded from a visual estimate (0.38). The rendered result showed the arc
 * clipped behind the sticky nav on mobile, which means the estimate was wrong — so
 * measure it instead of guessing.
 *
 * Method: average the luminance of every row. The arc is the brightest band in the
 * image, so the peak of that profile is where it sits. Also report the horizontal
 * profile, because a crest that is brighter in the middle than at the edges is a
 * curve, not a straight horizon — worth knowing before calling it an "arc".
 */
const sharp = require("sharp");
const path = require("path");

const SRC = path.join(__dirname, "..", "assets", "hero-source.png");

(async () => {
  const { data, info } = await sharp(SRC)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // Row luminance.
  const rows = [];
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let x = 0; x < width; x++) sum += data[(y * width + x) * channels];
    rows.push(sum / width);
  }

  // Column luminance.
  const cols = [];
  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let y = 0; y < height; y++) sum += data[(y * width + x) * channels];
    cols.push(sum / height);
  }

  const peakRow = rows.indexOf(Math.max(...rows));
  const peakCol = cols.indexOf(Math.max(...cols));
  const maxRow = Math.max(...rows);
  const minRow = Math.min(...rows);

  console.log("=== PROFIL LUMINANSI (0-255) ===");
  console.log(`  rentang: ${minRow.toFixed(1)} .. ${maxRow.toFixed(1)}`);
  console.log(`  baris paling terang : y=${peakRow}  -> ARC_Y = ${(peakRow / height).toFixed(3)}`);
  console.log(`  kolom paling terang : x=${peakCol}  -> ${(peakCol / width).toFixed(3)} dari lebar`);
  console.log(`  estimasi lama ARC_Y = 0.38  -> selisih ${((peakRow / height - 0.38) * 100).toFixed(1)} poin persen`);

  // Print a coarse profile so the shape is visible, not just the peak.
  console.log("\n=== PROFIL BARIS (tiap 5%) ===");
  for (let i = 0; i <= 20; i++) {
    const y = Math.min(height - 1, Math.round((i / 20) * height));
    const v = rows[y];
    const bar = "#".repeat(Math.max(0, Math.round(((v - minRow) / (maxRow - minRow)) * 50)));
    console.log(`  y=${String(y).padStart(4)} (${String(i * 5).padStart(3)}%)  ${v.toFixed(1).padStart(6)}  ${bar}`);
  }

  // Is the brightest row a curve? Compare its shape across the width.
  console.log("\n=== APAKAH MELENGKUNG? (luminansi baris puncak per sepertiga lebar) ===");
  const thirds = [0.17, 0.5, 0.83].map((f) => {
    const x0 = Math.floor(width * f);
    let sum = 0, n = 0;
    for (let x = Math.max(0, x0 - 20); x < Math.min(width, x0 + 20); x++) {
      sum += data[(peakRow * width + x) * channels];
      n++;
    }
    return sum / n;
  });
  console.log(`  kiri=${thirds[0].toFixed(1)}  tengah=${thirds[1].toFixed(1)}  kanan=${thirds[2].toFixed(1)}`);
  const curved = thirds[1] - (thirds[0] + thirds[2]) / 2;
  console.log(`  tengah - rata tepi = ${curved.toFixed(1)}  -> ${curved > 4 ? "MELENGKUNG (crest)" : "datar (horizon)"}`);
})();
