import { fetchAiPlans, fetchAppSettings, fetchVpsPlans } from "@/lib/api";
import { PricingSection } from "@/components/landing/pricing-section";
import { PublicShell } from "@/components/landing/public-shell";
import { vpsVisible, type Locale } from "@/lib/site";

export async function PricingPage({ locale }: { locale: Locale }) {
  // Settings are fetched alongside the plans because the VPS tab's presence depends on the launch
  // gate; without it the page cannot know whether to offer VPS.
  const [plans, vpsPlans, settings] = await Promise.all([
    fetchAiPlans(),
    fetchVpsPlans(),
    fetchAppSettings(),
  ]);
  return (
    <PublicShell locale={locale}>
      <PricingSection
        aiPlans={plans}
        vpsPlans={vpsPlans}
        locale={locale}
        asPage
        showVps={vpsVisible(settings)}
      />
    </PublicShell>
  );
}
