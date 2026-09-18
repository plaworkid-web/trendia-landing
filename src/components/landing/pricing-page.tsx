import { fetchAiPlans, fetchVpsPlans } from "@/lib/api";
import { PricingSection } from "@/components/landing/pricing-section";
import { PublicShell } from "@/components/landing/public-shell";
import type { Locale } from "@/lib/site";

export async function PricingPage({ locale }: { locale: Locale }) {
  const [plans, vpsPlans] = await Promise.all([fetchAiPlans(), fetchVpsPlans()]);
  return (
    <PublicShell locale={locale}>
      <PricingSection aiPlans={plans} vpsPlans={vpsPlans} locale={locale} asPage />
    </PublicShell>
  );
}
