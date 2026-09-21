import { fetchAiModels, fetchAiPlans, fetchAppSettings, fetchLandingData, fetchVpsPlans } from "@/lib/api";
import { Hero } from "@/components/landing/hero";
import { Component } from "@/components/ui/featuresgrid";
import { IntegrationsSection } from "@/components/landing/integrations";
import { PricingSection } from "@/components/landing/pricing-section";
import { Partners } from "@/components/landing/partners";
import { Testimonials } from "@/components/landing/testimonials";
import { FaqSection } from "@/components/landing/faq-section";
import { BlogSection } from "@/components/landing/blog-section";
import { ChangelogSection } from "@/components/landing/changelog-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/ui/footer-section";
import { LocaleDocument } from "@/components/providers/locale-document";
import type { Locale } from "@/lib/site";

export async function HomePage({ locale }: { locale: Locale }) {
  const [landingData, aiPlans, appSettings, aiModels, vpsPlans] = await Promise.all([
    fetchLandingData(),
    fetchAiPlans(),
    fetchAppSettings(),
    fetchAiModels(),
    fetchVpsPlans(),
  ]);

  return (
    <>
      <LocaleDocument locale={locale} />
      <main className="flex-1">
        <Hero
          locale={locale}
          appSettings={appSettings}
          menuItems={landingData?.menu_items ?? []}
        />
        <Component locale={locale} />
        <IntegrationsSection locale={locale} models={aiModels ?? []} />
        <PricingSection aiPlans={aiPlans} vpsPlans={vpsPlans} locale={locale} />
        <Partners partners={landingData?.partners ?? []} locale={locale} />
        <Testimonials
          testimonials={landingData?.testimonials ?? []}
          locale={locale}
          brandName={appSettings?.app_name}
          models={aiModels ?? []}
          plans={aiPlans}
        />
        <BlogSection posts={landingData?.blog_posts ?? []} locale={locale} />
        <ChangelogSection changelogs={landingData?.changelogs ?? []} locale={locale} />
        <FaqSection faqs={landingData?.faqs ?? []} locale={locale} />
        <CtaSection locale={locale} brandName={appSettings?.app_name} />
      </main>
      <Footer
        locale={locale}
        appSettings={appSettings}
        menuItems={landingData?.menu_items ?? []}
        company={landingData?.company ?? null}
      />
    </>
  );
}
