import type { Metadata } from "next";
import { ModelsPage } from "@/components/landing/models-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    title: `Katalog Model AI | ${brand}`,
    description: `Jelajahi model AI, kapabilitas, context window, dan harga jual ${brand}.`,
    alternates: { canonical: "/models", languages: { "id-ID": "/models", "en-US": "/en/models" } },
  };
}

export default function Page() { return <ModelsPage locale="id" />; }
