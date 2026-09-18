import type { Metadata } from "next";
import { VpsPage } from "@/components/landing/vps-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    title: `VPS Catalog | ${brand}`,
    description: `Explore ${brand} VPS plans by resources, server location, and workload requirements.`,
    alternates: { canonical: "/en/vps", languages: { "id-ID": "/vps", "en-US": "/en/vps" } },
  };
}

export default function Page() { return <VpsPage locale="en" />; }
