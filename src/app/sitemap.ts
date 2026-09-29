import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { fetchAppSettings } from "@/lib/api";
import { vpsVisible } from "@/lib/site";

/**
 * The sitemap follows the launch gate.
 *
 * A gated page that stays in the sitemap is worse than useless: it asks Google to index a URL that
 * redirects, so the indexed result is either an error or a page for a product that is not on sale.
 * The list is therefore built from the same `vpsVisible()` check the page itself uses.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl;
  const settings = await fetchAppSettings();

  const paths = [
    "",
    ...(vpsVisible(settings) ? ["/vps"] : []),
    "/models",
    "/pricing",
    "/docs",
    "/blog",
    "/en",
    ...(vpsVisible(settings) ? ["/en/vps"] : []),
    "/en/models",
    "/en/pricing",
    "/en/docs",
    "/en/blog",
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path.includes("docs") ? ("monthly" as const) : ("daily" as const),
    priority: path === "" || path === "/en" ? 1 : 0.8,
  }));
}
