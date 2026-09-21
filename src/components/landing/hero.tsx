import ResponsiveHeroBanner from "@/components/ui/responsive-hero-banner";
import {
  copy,
  localizedPath,
  navbarItems,
  otherLocalePath,
  portalUrl,
  type Locale,
  type ResolvedNavItem,
} from "@/lib/site";
import type { AppSettings, MenuItem } from "@/types/landing";

/** Fallback only: used when the CMS has no navbar menu configured at all. */
const DEFAULT_PATHS = ["", "/vps", "/models", "/pricing", "/docs"] as const;

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

  // The homepage used to hardcode its navigation, so editing the menus in the CMS
  // changed every inner page and left the homepage untouched. It now renders the
  // same managed list `Navbar` does, keeping one source of truth for the landing
  // site's navigation.
  const managed: ResolvedNavItem[] = navbarItems(menuItems, locale);
  const defaultLabels = [t.nav.home, t.nav.vps, t.nav.models, t.nav.pricing, t.nav.docs];
  const navLinks = managed.length
    ? managed.map((item) => ({ label: item.label, href: item.href }))
    : DEFAULT_PATHS.map((path, index) => ({
        label: defaultLabels[index],
        href: localizedPath(locale, path),
      }));

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
      navLinks={navLinks}
    />
  );
}
