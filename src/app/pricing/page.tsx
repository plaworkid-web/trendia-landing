import type { Metadata } from "next";
import { PricingPage } from "@/components/landing/pricing-page";

export const metadata: Metadata = {
  title: "Harga VPS & AI | Trendia",
  description: "Bandingkan paket VPS dan akses AI Trendia.",
  alternates: { canonical: "/pricing", languages: { "id-ID": "/pricing", "en-US": "/en/pricing" } },
};

export default function Page() { return <PricingPage locale="id" />; }
