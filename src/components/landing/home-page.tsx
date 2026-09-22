import { fetchAiModels, fetchAiPlans, fetchAppSettings, fetchLandingData } from "@/lib/api";
import { Hero } from "@/components/landing/hero";
import { Component } from "@/components/ui/featuresgrid";
import { IntegrationsSection } from "@/components/landing/integrations";
import { ProductShowcase } from "@/components/landing/product-showcase";
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
  // `fetchVpsPlans` is gone with the pricing table: the homepage no longer lists
  // prices, so fetching the plans would be a request whose result nothing reads.
  const [landingData, aiPlans, appSettings, aiModels] = await Promise.all([
    fetchLandingData(),
    fetchAiPlans(),
    fetchAppSettings(),
    fetchAiModels(),
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
        {/* Pricing moved off the homepage: each product has its own page now
            (/vps and /ai) that carries the feature list next to the price list, so a
            visitor compares one product at a time instead of skimming a tabbed table
            that showed neither in full. */}
        <ProductShowcase locale={locale} />
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
