import { fetchLandingData, fetchAiPlans, fetchAppSettings } from "@/lib/api";
import { Hero } from "@/components/landing/hero";
import { Partners } from "@/components/landing/partners";
import { Highlights } from "@/components/landing/highlights";
import { IntegrationsSection } from "@/components/landing/integrations";
import { VpsPlans } from "@/components/landing/vps-plans";
import { AiPlans } from "@/components/landing/ai-plans";
import { Testimonials } from "@/components/landing/testimonials";
import { FaqSection } from "@/components/landing/faq";
import { BlogPreview } from "@/components/landing/blog-preview";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default async function Home() {
  const [landingData, aiPlans, appSettings] = await Promise.all([
    fetchLandingData(),
    fetchAiPlans(),
    fetchAppSettings(),
  ]);

  return (
    <>
      <main className="flex-1">
        <Hero />

        <Partners partners={landingData?.partners ?? []} />

        <Highlights highlights={landingData?.highlights ?? []} />

        <IntegrationsSection />

        <VpsPlans />

        <AiPlans plans={aiPlans} />

        <Testimonials testimonials={landingData?.testimonials ?? []} />

        <FaqSection faqs={landingData?.faqs ?? []} />

        <BlogPreview posts={landingData?.blog_posts ?? []} />

        <CtaSection />
      </main>

      <Footer
        menuItems={landingData?.menu_items ?? []}
        company={landingData?.company ?? null}
        appName={appSettings?.app_name ?? "Trendia"}
      />
    </>
  );
}
