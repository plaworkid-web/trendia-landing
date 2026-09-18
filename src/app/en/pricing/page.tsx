import type { Metadata } from "next";
import { PricingPage } from "@/components/landing/pricing-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    title: `VPS & AI Pricing | ${brand}`,
    description: `Compare ${brand} VPS packages and AI access plans.`,
    alternates: { canonical: "/en/pricing", languages: { "id-ID": "/pricing", "en-US": "/en/pricing" } },
  };
}

export default function Page() { return <PricingPage locale="en" />; }
