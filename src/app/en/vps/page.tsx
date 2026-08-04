import type { Metadata } from "next";
import { VpsPage } from "@/components/landing/vps-page";

export const metadata: Metadata = {
  title: "VPS Catalog | Trendia",
  description: "Explore Trendia VPS plans by resources, server location, and workload requirements.",
  alternates: { canonical: "/en/vps", languages: { "id-ID": "/vps", "en-US": "/en/vps" } },
};

export default function Page() { return <VpsPage locale="en" />; }
