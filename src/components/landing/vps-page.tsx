import { fetchVpsPlans } from "@/lib/api";
import { PublicShell } from "@/components/landing/public-shell";
import { VpsCatalog } from "@/components/landing/vps-catalog";
import type { Locale } from "@/lib/site";

export async function VpsPage({ locale }: { locale: Locale }) {
  const plans = await fetchVpsPlans();
  return <PublicShell locale={locale}><VpsCatalog locale={locale} plans={plans} /></PublicShell>;
}
