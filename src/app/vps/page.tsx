import type { Metadata } from "next";
import { VpsPage } from "@/components/landing/vps-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    title: `Katalog VPS | ${brand}`,
    description: `Jelajahi paket VPS ${brand} berdasarkan resource, lokasi server, dan kebutuhan workload.`,
    alternates: { canonical: "/vps", languages: { "id-ID": "/vps", "en-US": "/en/vps" } },
  };
}

export default function Page() { return <VpsPage locale="id" />; }
