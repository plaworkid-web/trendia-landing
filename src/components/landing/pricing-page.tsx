import { fetchAiPlans } from "@/lib/api";
import { PricingSection } from "@/components/landing/pricing-section";
import { PublicShell } from "@/components/landing/public-shell";
import type { Locale } from "@/lib/site";

export async function PricingPage({ locale }: { locale: Locale }) {
  const plans = await fetchAiPlans();
  return (
    <PublicShell locale={locale}>
      <PricingSection aiPlans={plans} locale={locale} asPage />
    </PublicShell>
  );
}
