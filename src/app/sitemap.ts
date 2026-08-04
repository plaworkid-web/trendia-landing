import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002").replace(/\/$/, "");
  return ["", "/models", "/pricing", "/docs", "/en", "/en/models", "/en/pricing", "/en/docs"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path.includes("docs") ? "monthly" : "daily",
    priority: path === "" || path === "/en" ? 1 : 0.8,
  }));
}
