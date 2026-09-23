import type { ReactNode } from "react";
import { fetchAppSettings, fetchLandingData } from "@/lib/api";
import { LandingHeader } from "@/components/landing/landing-header";
import { Footer } from "@/components/ui/footer-section";
import { LocaleDocument } from "@/components/providers/locale-document";
import type { Locale } from "@/lib/site";

/**
 * The shell every landing page except the homepage renders inside.
 *
 * The header is `LandingHeader variant="page"` - the same component the homepage's hero
 * uses with `variant="hero"`. It replaced `Navbar`, a separate implementation that had
 * drifted from the homepage's header: measured side by side, the homepage had its nav
 * links in a translucent pill with round icon buttons and a white CTA carrying an arrow,
 * while /vps, /ai and /pricing had bare text links, ghost icons and a purple CTA with no
 * arrow. Two components meant the drift would return; one component with a variant means
 * it cannot.
 */
export async function PublicShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [settings, landing] = await Promise.all([fetchAppSettings(), fetchLandingData()]);

  return (
    <>
      <LocaleDocument locale={locale} />
      <LandingHeader
        variant="page"
        locale={locale}
        appSettings={settings}
        menuItems={landing?.menu_items ?? []}
      />
      <main className="page-ambient min-h-[70vh] flex-1">{children}</main>
      <Footer
        locale={locale}
        appSettings={settings}
        menuItems={landing?.menu_items ?? []}
        company={landing?.company ?? null}
      />
    </>
  );
}
