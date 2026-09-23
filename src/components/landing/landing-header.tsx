"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Globe, Menu, Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/providers/theme-provider";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  copy,
  localizedPath,
  navbarItems,
  portalUrl,
  type Locale,
  type ResolvedNavItem,
} from "@/lib/site";
import type { MenuItem, AppSettings } from "@/types/landing";
/**
 * The landing site's header, in one place.
 *
 * WHY THIS EXISTS
 * There were two headers. The homepage's was written inline inside
 * `responsive-hero-banner.tsx`; every other page used `navbar.tsx`. They drifted, and
 * the measured result was visible: the homepage had its nav links inside a translucent
 * pill, round icon buttons and a white CTA with an arrow, while /vps, /ai and /pricing
 * had bare text links, ghost icon buttons and a purple CTA. Those three read as
 * unstyled fallbacks next to the homepage.
 *
 * Keeping them separate guaranteed the drift would happen again, so the markup lives
 * here once and the two surfaces differ only by the `variant` prop.
 *
 * THE TWO VARIANTS ARE NOT COSMETIC
 * `hero` sits on the artwork: a dark, always-dark surface, so its colours are
 * hardcoded white and its container is transparent. `page` sits on `bg-background`,
 * which is light in the light theme, so it uses theme tokens. Forcing one palette on
 * both would make either the hero unreadable or the inner pages unreadable in light
 * mode - that difference is deliberate and load-bearing.
 */

/** Fallback only: used when the CMS has no navbar menu configured at all. */
const DEFAULT_PATHS = ["", "/vps", "/models", "/pricing", "/docs"] as const;

type Variant = "hero" | "page";

export function LandingHeader({
  locale = "id",
  appSettings,
  menuItems = [],
  variant,
}: {
  locale?: Locale;
  appSettings: AppSettings | null;
  menuItems?: MenuItem[];
  variant: Variant;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();
  const t = copy[locale].nav;

  const brandName = appSettings?.app_name || "Trendia";

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The route without the locale prefix, so both /vps and /en/vps mark the same item.
  const routePath = locale === "en" ? pathname.replace(/^\/en/, "") || "/" : pathname;

  const languageHref =
    locale === "id" ? `/en${routePath === "/" ? "" : routePath}` : routePath;

  // One source of truth for the items: the CMS menu, with a static fallback.
  const managed = navbarItems(menuItems, locale);
  const defaultLabels = [t.home, t.vps, t.models, t.pricing, t.docs];
  const navItems: ResolvedNavItem[] = managed.length
    ? managed
    : DEFAULT_PATHS.map((path, index) => ({
        id: path || "home",
        label: defaultLabels[index],
        href: localizedPath(locale, path),
        external: false,
        openInNewTab: false,
        children: [],
      }));

  /** Is this item the page currently being viewed? */
  const isActive = (href: string) => {
    const target = href.split("?")[0].replace(/\/$/, "") || "/";
    const here = routePath.replace(/\/$/, "") || "/";
    return target === here;
  };

  const isHero = variant === "hero";

  /**
   * Colour sets, per variant. Grouped so a change cannot be applied to one element and
   * missed on another - the drift between the two old headers was exactly that.
   */
  const c = isHero
    ? {
        surface: "",
        logo: "text-white",
        linkIdle: "text-white/80 hover:text-white",
        linkActive: "text-white/90",
        pill: "bg-white/5 ring-1 ring-white/10 backdrop-blur",
        iconBtn: "bg-white/5 ring-1 ring-white/10 backdrop-blur hover:bg-white/10 text-white/80",
        cta: "bg-white text-neutral-900 hover:bg-white/90",
        mobileToggle: "bg-white/10 ring-1 ring-white/15 backdrop-blur text-white/90",
        mobilePanel: "bg-black/70 ring-1 ring-white/15 backdrop-blur-xl",
        mobileLink: "text-white/85 hover:bg-white/10",
        mobileBorder: "border-white/10",
        mobileIcon: "bg-white/10 text-white/80",
      }
    : {
        surface: scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-lg"
          : "bg-transparent",
        logo: "text-foreground",
        linkIdle: "text-muted-foreground hover:text-foreground",
        linkActive: "text-foreground",
        pill: "bg-foreground/5 ring-1 ring-foreground/10 backdrop-blur",
        iconBtn:
          "bg-foreground/5 ring-1 ring-foreground/10 backdrop-blur hover:bg-foreground/10 text-muted-foreground",
        cta: "bg-foreground text-background hover:bg-foreground/90",
        mobileToggle: "bg-foreground/5 ring-1 ring-foreground/10 backdrop-blur text-foreground",
        mobilePanel: "bg-background/95 ring-1 ring-border backdrop-blur-xl",
        mobileLink: "text-muted-foreground hover:bg-muted hover:text-foreground",
        mobileBorder: "border-border",
        mobileIcon: "bg-foreground/5 text-muted-foreground",
      };

  const Logo = () => (
    <Link href={localizedPath(locale)} className="flex shrink-0 items-center" aria-label={brandName}>
      {appSettings?.logo_dark_url || appSettings?.logo_light_url ? (
        <Image
          src={(isHero ? appSettings?.logo_dark_url || appSettings?.logo_light_url : appSettings?.logo_light_url || appSettings?.logo_dark_url)!}
          alt={brandName}
          width={210}
          height={56}
          style={{ width: "auto" }}
          className={isHero ? "h-14 w-auto" : "h-14 w-auto dark:hidden"}
          priority
        />
      ) : (
        <span className={`type-h3 ${c.logo}`}>{brandName}</span>
      )}
      {!isHero && appSettings?.logo_dark_url && (
        <Image
          src={appSettings.logo_dark_url}
          alt={brandName}
          width={210}
          height={56}
          style={{ width: "auto" }}
          className="hidden h-14 w-auto dark:block"
          priority
        />
      )}
    </Link>
  );

  return (
    <header
      data-landing-header={variant}
      className={`z-50 w-full ${isHero ? "relative" : "sticky top-0"} ${c.surface}`}
    >
      <div className={isHero ? "mx-6" : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"}>
        <div className={`flex items-center justify-between ${isHero ? "pt-4" : "h-20"}`}>
          <Logo />

          {/* Desktop navigation. The pill wraps the links AND the CTA, which is what
              makes the group read as one object rather than loose text. */}
          <nav className="hidden items-center gap-2 md:flex">
            <div className={`flex items-center gap-1 rounded-full px-1 py-1 ${c.pill}`}>
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`px-3 py-2 font-sans text-sm font-medium transition-colors ${
                    isActive(item.href) ? c.linkActive : c.linkIdle
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={`${portalUrl}/register`}
                className={`ml-1 inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-sans text-sm font-medium transition-colors ${c.cta}`}
              >
                {t.start}
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </Link>
            </div>

            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${c.iconBtn}`}
              aria-label={locale === "id" ? "Ganti tema" : "Toggle theme"}
            >
              {resolvedTheme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </button>

            <Link
              href={languageHref}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${c.iconBtn}`}
              aria-label={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
              title={locale === "id" ? "English" : "Bahasa Indonesia"}
            >
              <Globe className="size-4" />
            </Link>
          </nav>

          {/* Mobile menu */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${c.iconBtn}`}
              aria-label={locale === "id" ? "Ganti tema" : "Toggle theme"}
            >
              {resolvedTheme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <button
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${c.mobileToggle}`}
                    aria-label={locale === "id" ? "Buka menu" : "Open menu"}
                  >
                    <Menu className="size-5" />
                  </button>
                }
              />
              <SheetContent side="right" className="w-72">
                <SheetTitle className="type-h3">{brandName}</SheetTitle>
                <nav className="mt-6 flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${c.mobileLink}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className={`mt-4 flex items-center gap-2 border-t pt-4 ${c.mobileBorder}`}>
                    <Link
                      href={languageHref}
                      className={`inline-flex size-9 items-center justify-center rounded-full ${c.mobileIcon}`}
                      aria-label={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
                    >
                      <Globe className="size-4" />
                    </Link>
                    <Link
                      href={`${portalUrl}/register`}
                      className={`flex-1 rounded-full px-4 py-2 text-center text-sm font-medium transition-colors ${c.cta}`}
                    >
                      {t.start}
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
