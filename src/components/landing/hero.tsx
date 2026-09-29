import ResponsiveHeroBanner from "@/components/ui/responsive-hero-banner";
import { copy, localizedPath, vpsVisible, type Locale } from "@/lib/site";
import type { AppSettings, MenuItem } from "@/types/landing";
import { BRAND, resolveBrandValue } from "@/lib/brand";

/**
 * The homepage hero.
 *
 * The header is no longer built here. It is `LandingHeader variant="hero"`, rendered by
 * `ResponsiveHeroBanner`, so the homepage and the inner pages share one header
 * implementation and differ only by variant. This file previously assembled its own nav
 * links and passed them down, which is how the two headers drifted apart.
 */
export function Hero({
  locale,
  appSettings,
  menuItems = [],
}: {
  locale: Locale;
  appSettings: AppSettings | null;
  menuItems?: MenuItem[];
}) {
  const t = copy[locale];
  const brandName = resolveBrandValue(appSettings?.app_name, BRAND.name);

  // One switch decides the whole hero: while VPS is gated off, the copy must not promise it, so the
  // aiOnly strings replace the badge, title, description and CTA text together. Mixing (e.g. the VPS
  // title with an AI button) reads as a mistake.
  const showVps = vpsVisible(appSettings);
  const h = showVps ? t.hero : t.hero.aiOnly;

  return (
    <ResponsiveHeroBanner
      locale={locale}
      appSettings={appSettings}
      menuItems={menuItems}
      badgeLabel={brandName}
      badgeText={h.badge}
      title={h.title}
      titleLine2={h.titleLine2}
      description={h.description}
      primaryButtonText={h.primary}
      primaryButtonHref={localizedPath(locale, showVps ? "/vps" : "/ai")}
      secondaryButtonText={h.secondary}
      secondaryButtonHref={localizedPath(locale, "/models")}
    />
  );
}
