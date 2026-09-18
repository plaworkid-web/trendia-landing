import type { Metadata } from "next";
import { BlogPage } from "@/components/landing/blog-page";
import { fetchAppSettings, fetchLandingData } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    title: `Blog | ${brand}`,
    description: `Panduan, pengumuman produk, dan praktik terbaik seputar AI API dan VPS dari ${brand}.`,
    alternates: { canonical: "/blog", languages: { "id-ID": "/blog", "en-US": "/en/blog" } },
  };
}

export default async function Page() {
  // Reuses the same payload the home page already loads, so the listing cannot
  // drift from the section that links here.
  const data = await fetchLandingData();
  return <BlogPage posts={data?.blog_posts ?? []} locale="id" />;
}
