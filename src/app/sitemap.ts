import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  return [
    "",
    "/vps",
    "/models",
    "/pricing",
    "/docs",
    "/en",
    "/en/vps",
    "/en/models",
    "/en/pricing",
    "/en/docs",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path.includes("docs") ? "monthly" : "daily",
    priority: path === "" || path === "/en" ? 1 : 0.8,
  }));
}
