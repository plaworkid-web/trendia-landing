import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VpsPage } from "@/components/landing/vps-page";
import { fetchAppSettings } from "@/lib/api";
import { vpsVisible } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  return {
    title: `Katalog VPS | ${brand}`,
    description: `Jelajahi paket VPS ${brand} berdasarkan resource, lokasi server, dan kebutuhan workload.`,
    alternates: { canonical: "/vps", languages: { "id-ID": "/vps", "en-US": "/en/vps" } },
  };
}

/**
 * VPS is behind a launch gate: while it is off, this page must not exist for a visitor.
 *
 * The plan list would render empty (the API returns no plans), and an empty catalogue reads as a
 * broken page rather than "not launched yet". A redirect to a page that IS on sale is the honest
 * answer, and it matches what the customer would have reached anyway: nothing links here while the
 * gate is off.
 *
 * Returning empty plans from the API is not enough on its own — the page fetches by URL, so a
 * bookmark or an old link would still land on it.
 */
export default async function Page() {
  const settings = await fetchAppSettings();
  if (!vpsVisible(settings)) {
    redirect("/");
  }
  return <VpsPage locale="id" />;
}
