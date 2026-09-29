import type { Metadata } from "next";
import { PricingPage } from "@/components/landing/pricing-page";
import { fetchAppSettings } from "@/lib/api";
import { vpsVisible } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    title: vpsVisible(settings) ? `VPS & AI Pricing | ${brand}` : `AI Pricing | ${brand}`,
    description: vpsVisible(settings)
      ? `Compare ${brand} VPS packages and AI access plans.`
      : `Compare ${brand} AI access plans, with per-model pricing in the open.`,
    alternates: { canonical: "/en/pricing", languages: { "id-ID": "/pricing", "en-US": "/en/pricing" } },
  };
}

export default function Page() { return <PricingPage locale="en" />; }
