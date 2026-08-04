import type { Metadata } from "next";
import { PricingPage } from "@/components/landing/pricing-page";

export const metadata: Metadata = {
  title: "VPS & AI Pricing | Trendia",
  description: "Compare Trendia VPS packages and AI access plans.",
  alternates: { canonical: "/en/pricing", languages: { "id-ID": "/pricing", "en-US": "/en/pricing" } },
};

export default function Page() { return <PricingPage locale="en" />; }
