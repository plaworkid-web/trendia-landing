import type { Metadata } from "next";
import { ModelsPage } from "@/components/landing/models-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    title: `AI Model Catalog | ${brand}`,
    description: `Explore AI models, capabilities, context windows, and ${brand} sell pricing.`,
    alternates: { canonical: "/en/models", languages: { "id-ID": "/models", "en-US": "/en/models" } },
  };
}

export default function Page() { return <ModelsPage locale="en" />; }
