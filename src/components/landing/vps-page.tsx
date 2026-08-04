import { PublicShell } from "@/components/landing/public-shell";
import { VpsCatalog } from "@/components/landing/vps-catalog";
import type { Locale } from "@/lib/site";

export function VpsPage({ locale }: { locale: Locale }) {
  return <PublicShell locale={locale}><VpsCatalog locale={locale} /></PublicShell>;
}
