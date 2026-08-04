import { fetchAiPlans, fetchAppSettings, fetchLandingData } from "@/lib/api";
import { Hero } from "@/components/landing/hero";
import { Component } from "@/components/ui/featuresgrid";
import { IntegrationsSection } from "@/components/landing/integrations";
import { PricingSection } from "@/components/landing/pricing-section";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/ui/footer-section";
import { LocaleDocument } from "@/components/providers/locale-document";
import type { Locale } from "@/lib/site";

export async function HomePage({ locale }: { locale: Locale }) {
  const [landingData, aiPlans, appSettings] = await Promise.all([
    fetchLandingData(),
    fetchAiPlans(),
    fetchAppSettings(),
  ]);

  return (
    <>
      <LocaleDocument locale={locale} />
      <main className="flex-1">
        <Hero locale={locale} appSettings={appSettings} />
        <Component locale={locale} />
        <IntegrationsSection locale={locale} />
        <PricingSection aiPlans={aiPlans} locale={locale} />
        <Testimonials
          testimonials={landingData?.testimonials ?? []}
          locale={locale}
          brandName={appSettings?.app_name}
        />
        <CtaSection locale={locale} brandName={appSettings?.app_name} />
      </main>
      <Footer locale={locale} appSettings={appSettings} />
    </>
  );
}
