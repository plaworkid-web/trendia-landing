import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VpsPage } from "@/components/landing/vps-page";
import { fetchAppSettings } from "@/lib/api";
import { vpsVisible } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    title: `VPS Catalog | ${brand}`,
    description: `Explore ${brand} VPS plans by resource, server location, and workload needs.`,
    alternates: { canonical: "/en/vps", languages: { "id-ID": "/vps", "en-US": "/en/vps" } },
  };
}

/**
 * The English counterpart of the gated /vps page. Both locales must be gated: leaving one open
 * would keep the product publicly reachable through /en.
 */
export default async function Page() {
  const settings = await fetchAppSettings();
  if (!vpsVisible(settings)) {
    redirect("/en");
  }
  return <VpsPage locale="en" />;
}
