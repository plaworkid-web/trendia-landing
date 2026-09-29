import type { Metadata } from "next";
import { PricingPage } from "@/components/landing/pricing-page";
import { fetchAppSettings } from "@/lib/api";
import { vpsVisible } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    // The page title is the first thing a search result shows, so it follows the same launch gate
    // as the page body: advertising VPS in the title while the page hides it would send visitors to
    // content that is not there.
    title: vpsVisible(settings) ? `Harga VPS & AI | ${brand}` : `Harga AI | ${brand}`,
    description: vpsVisible(settings)
      ? `Bandingkan paket VPS dan akses AI ${brand}.`
      : `Bandingkan paket akses AI ${brand}, dengan harga per model yang terbuka.`,
    alternates: { canonical: "/pricing", languages: { "id-ID": "/pricing", "en-US": "/en/pricing" } },
  };
}

export default function Page() { return <PricingPage locale="id" />; }
