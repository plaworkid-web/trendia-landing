import ResponsiveHeroBanner from "@/components/ui/responsive-hero-banner";
import { copy, localizedPath, type Locale } from "@/lib/site";
import type { AppSettings, MenuItem } from "@/types/landing";

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
  const brandName = appSettings?.app_name || "Trendia";

  return (
    <ResponsiveHeroBanner
      locale={locale}
      appSettings={appSettings}
      menuItems={menuItems}
      badgeLabel={brandName}
      badgeText={t.hero.badge}
      title={t.hero.title}
      titleLine2={t.hero.titleLine2}
      description={t.hero.description}
      primaryButtonText={t.hero.primary}
      primaryButtonHref={localizedPath(locale, "/vps")}
      secondaryButtonText={t.hero.secondary}
      secondaryButtonHref={localizedPath(locale, "/models")}
    />
  );
}
