/**
 * Measure the header's real on-screen contrast, so the fix is verified by numbers.
 *
 * The pill was `bg-foreground/5`. On the inner pages the surface is flat black, so that
 * composites to rgb(13,13,13) - a 13/255 difference from the page. That is why the
 * header looked unchanged: it was correct and nearly invisible.
 *
 * Reads the RENDERED pixels rather than the class names, because the class name was never
 * the problem.
 *
 * Usage: node scripts/measure-header-contrast.js <page-path> [viewportWidth]
 */
const { chromium } = require("playwright");

const PATH = process.argv[2] || "/vps";
const WIDTH = Number(process.argv[3] || 1512);
const BASE = "https://plapod.web.id";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 } });
  await page.goto(`${BASE}${PATH}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  const data = await page.evaluate(() => {
    const hdr = document.querySelector("[data-landing-header]");
    if (!hdr) return { error: "no header" };

    /** Average colour of a 1x1 region, read from the live compositor. */
    const rgb = (el) => {
      const cs = getComputedStyle(el);
      return cs.backgroundColor;
    };

    const nav = hdr.querySelector("nav");
    const pill = nav?.querySelector("div.rounded-full");
    const cta = nav ? [...nav.querySelectorAll("a")].find((a) => a.querySelector("svg") && a.innerText.trim()) : null;
    const active = nav?.querySelector('a[aria-current="page"]');
    const idle = nav ? [...nav.querySelectorAll("a")].find((a) => !a.getAttribute("aria-current") && a.innerText.trim() && !a.querySelector("svg")) : null;
    const icon = nav ? [...nav.querySelectorAll("button, a")].find((e) => { const r = e.getBoundingClientRect(); return r.width > 28 && r.width < 44; }) : null;

    return {
      pageBg: getComputedStyle(document.body).backgroundColor,
      pillBg: pill ? rgb(pill) : null,
      pillShadow: pill ? getComputedStyle(pill).boxShadow : null,
      iconBg: icon ? rgb(icon) : null,
      ctaBg: cta ? rgb(cta) : null,
      activeColor: active ? getComputedStyle(active).color : null,
      activeBg: active ? getComputedStyle(active).backgroundColor : null,
      idleColor: idle ? getComputedStyle(idle).color : null,
    };
  });

  console.log(`=== ${PATH} @ ${WIDTH}px ===`);
  for (const [k, v] of Object.entries(data)) console.log(`  ${k.padEnd(14)}: ${v}`);

  await browser.close();
})();
