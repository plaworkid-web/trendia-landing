import type { Metadata } from "next";
import { DocsPage } from "@/components/landing/docs-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    title: `Dokumentasi AI API & VPS | ${brand}`,
    description: `Quickstart AI API ${brand} dan panduan awal VPS.`,
    alternates: { canonical: "/docs", languages: { "id-ID": "/docs", "en-US": "/en/docs" } },
  };
}

export default function Page() { return <DocsPage locale="id" />; }
