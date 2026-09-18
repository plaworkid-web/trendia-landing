import type { Metadata } from "next";
import { BlogPage } from "@/components/landing/blog-page";
import { fetchAppSettings, fetchLandingData } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    title: `Blog | ${brand}`,
    description: `Guides, product announcements and best practices for AI API and VPS from ${brand}.`,
    alternates: { canonical: "/en/blog", languages: { "id-ID": "/blog", "en-US": "/en/blog" } },
  };
}

export default async function Page() {
  const data = await fetchLandingData();
  return <BlogPage posts={data?.blog_posts ?? []} locale="en" />;
}
