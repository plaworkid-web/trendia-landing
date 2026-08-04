import ResponsiveHeroBanner from "@/components/ui/responsive-hero-banner";
import { copy, localizedPath, otherLocalePath, portalUrl, type Locale } from "@/lib/site";
import type { AppSettings } from "@/types/landing";

export function Hero({ locale, appSettings }: { locale: Locale; appSettings: AppSettings | null }) {
  const t = copy[locale];
  const brandName = appSettings?.app_name || "Trendia";
  return (
    <ResponsiveHeroBanner
      logoUrl={appSettings?.logo_dark_url || appSettings?.logo_light_url || undefined}
      brandName={brandName}
      badgeLabel={brandName}
      badgeText={t.hero.badge}
      title={t.hero.title}
      titleLine2={t.hero.titleLine2}
      description={t.hero.description}
      primaryButtonText={t.hero.primary}
      primaryButtonHref={localizedPath(locale, "/vps")}
      secondaryButtonText={t.hero.secondary}
      secondaryButtonHref={localizedPath(locale, "/models")}
      ctaButtonText={t.nav.start}
      ctaButtonHref={`${portalUrl}/register`}
      languageHref={otherLocalePath(locale)}
      languageLabel={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      navLinks={[
        { label: t.nav.home, href: localizedPath(locale) },
        { label: t.nav.vps, href: localizedPath(locale, "/vps") },
        { label: t.nav.models, href: localizedPath(locale, "/models") },
        { label: t.nav.pricing, href: localizedPath(locale, "/pricing") },
        { label: t.nav.docs, href: localizedPath(locale, "/docs") },
      ]}
    />
  );
}
