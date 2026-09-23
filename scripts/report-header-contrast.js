/**
 * Convert the header's computed colours into the values a person actually sees.
 *
 * `getComputedStyle` returns `oklab(... / 0.05)` for a 5%-alpha background, which says
 * nothing about visibility. What matters is the composited sRGB value and its distance
 * from the page background. This prints both, plus the WCAG contrast ratio for text.
 *
 * Usage: node scripts/report-header-contrast.js
 */
const { chromium } = require("playwright");

const BASE = "https://plapod.web.id";
const PAGES = ["/", "/vps", "/ai", "/pricing"];

/** Parse `oklab(L a b / A)` or `rgba(r,g,b,a)` into {rgb:[r,g,b], a}. */
function parseColour(str) {
  if (!str) return null;
  const oklab = str.match(/oklab\(([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.]+))?\)/);
  if (oklab) {
    const [L, a, b] = [oklab[1], oklab[2], oklab[3]].map(Number);
    const alpha = oklab[4] === undefined ? 1 : Number(oklab[4]);
    // OKLab -> linear sRGB -> sRGB
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
    const lin = [
      +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    ];
    const enc = (c) => {
      const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055;
      return Math.round(Math.min(1, Math.max(0, v)) * 255);
    };
    return { rgb: lin.map(enc), a: alpha };
  }
  const lab = str.match(/lab\(([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.]+))?\)/);
  if (lab) {
    // Approximate: lab() here comes from a neutral scale, so treat L as lightness.
    const L = Number(lab[1]);
    const alpha = lab[4] === undefined ? 1 : Number(lab[4]);
    const v = Math.round(Math.min(255, Math.max(0, (L / 100) * 255)));
    return { rgb: [v, v, v], a: alpha };
  }
  const rgba = str.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
  if (rgba) {
    return {
      rgb: [rgba[1], rgba[2], rgba[3]].map((v) => Math.round(Number(v))),
      a: rgba[4] === undefined ? 1 : Number(rgba[4]),
    };
  }
  return null;
}

/** Composite a foreground with alpha over a solid background. */
function over(fg, bg) {
  if (!fg) return null;
  return fg.rgb.map((c, i) => Math.round(c * fg.a + bg[i] * (1 - fg.a)));
}

const lum = ([r, g, b]) => {
  const f = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1512, height: 900 } });

  for (const path of PAGES) {
    await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2200);

    const raw = await page.evaluate(() => {
      const hdr = document.querySelector("[data-landing-header]");
      const nav = hdr?.querySelector("nav");
      const pill = nav?.querySelector("div.rounded-full");
      const active = nav?.querySelector('a[aria-current="page"]');
      const idle = nav
        ? [...nav.querySelectorAll("a")].find(
            (a) => !a.getAttribute("aria-current") && a.innerText.trim() && !a.querySelector("svg"),
          )
        : null;
      /**
       * Target the icons by their accessible name, not by width.
       *
       * A width filter also matches short nav links ("AI" is 38px wide), which is how an
       * earlier version of this script reported the icons as rgb(0,0,0) - it was reading
       * a nav link and calling it an icon.
       */
      const icon = nav?.querySelector('[aria-label="Ganti tema"], [aria-label="Toggle theme"]');
      return {
        pageBg: getComputedStyle(document.body).backgroundColor,
        pillBg: pill ? getComputedStyle(pill).backgroundColor : null,
        iconBg: icon ? getComputedStyle(icon).backgroundColor : null,
        activeBg: active ? getComputedStyle(active).backgroundColor : null,
        activeColor: active ? getComputedStyle(active).color : null,
        idleColor: idle ? getComputedStyle(idle).color : null,
      };
    });

    const bg = parseColour(raw.pageBg)?.rgb ?? [0, 0, 0];
    const pill = over(parseColour(raw.pillBg), bg);
    const icon = over(parseColour(raw.iconBg), bg);

    /**
     * The active chip sits INSIDE the pill, so it must be composited over the pill, not
     * over the page. Compositing it over the page reported rgb(24,25,25) - the same value
     * as the pill - which made it look like the chip was invisible when it is not.
     */
    const activeBg = over(parseColour(raw.activeBg), pill ?? bg);
    const activeFg = over(parseColour(raw.activeColor), activeBg);
    const idleFg = over(parseColour(raw.idleColor), pill ?? bg);

    console.log(`=== ${path} ===`);
    console.log(`  latar halaman     : rgb(${bg.join(",")})`);
    console.log(`  pill              : rgb(${pill?.join(",")})  -> selisih ${Math.abs(pill[0] - bg[0])}/255 dari latar`);
    console.log(`  ikon              : rgb(${icon?.join(",")})  -> selisih ${Math.abs(icon[0] - bg[0])}/255 dari latar`);
    console.log(`  chip aktif        : rgb(${activeBg?.join(",")})  -> selisih ${Math.abs(activeBg[0] - pill[0])}/255 dari pill`);
    console.log(`  teks aktif vs idle: rasio kontras ${ratio(activeFg, idleFg).toFixed(2)}:1`);
    console.log(`  teks idle vs pill : rasio kontras ${ratio(idleFg, pill).toFixed(2)}:1`);
    console.log();
  }

  await browser.close();
})();
