import type { ReactNode } from "react";
import { fetchAppSettings, fetchLandingData } from "@/lib/api";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/ui/footer-section";
import { LocaleDocument } from "@/components/providers/locale-document";
import type { Locale } from "@/lib/site";

export async function PublicShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [settings, landing] = await Promise.all([fetchAppSettings(), fetchLandingData()]);

  return (
    <>
      <LocaleDocument locale={locale} />
      <Navbar locale={locale} appSettings={settings} menuItems={landing?.menu_items ?? []} />
      <main className="page-ambient min-h-[70vh] flex-1">{children}</main>
      <Footer locale={locale} appSettings={settings} />
    </>
  );
}
