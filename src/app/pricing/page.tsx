import type { Metadata } from "next";
import { PricingPage } from "@/components/landing/pricing-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    title: `Harga VPS & AI | ${brand}`,
    description: `Bandingkan paket VPS dan akses AI ${brand}.`,
    alternates: { canonical: "/pricing", languages: { "id-ID": "/pricing", "en-US": "/en/pricing" } },
  };
}

export default function Page() { return <PricingPage locale="id" />; }
