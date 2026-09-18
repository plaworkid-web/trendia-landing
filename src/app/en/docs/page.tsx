import type { Metadata } from "next";
import { DocsPage } from "@/components/landing/docs-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    title: `AI API & VPS Documentation | ${brand}`,
    description: `${brand} AI API quickstart and VPS getting-started guidance.`,
    alternates: { canonical: "/en/docs", languages: { "id-ID": "/docs", "en-US": "/en/docs" } },
  };
}

export default function Page() { return <DocsPage locale="en" />; }
