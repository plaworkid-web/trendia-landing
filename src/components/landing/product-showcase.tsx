import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlanetCard } from "@/components/ui/planet-card";
import { SectionHeader } from "@/components/landing/section-header";
import { ServiceIllustration, type ServiceKind } from "@/components/landing/service-illustration";
import { cn } from "@/lib/utils";
import { localizedPath, type Locale } from "@/lib/site";

/**
 * Two cards that route a visitor to the product they want.
 *
 * This replaces the tabbed pricing table on the homepage. A price list needs the
 * feature list beside it to mean anything, and a tab hid half of it: the visitor saw
 * either VPS prices or AI prices, never the reasoning for either. Each product now
 * has a page carrying both, and this section is the signpost.
 *
 * No prices here on purpose — a homepage price invites a comparison the visitor
 * cannot finish without leaving the page.
 *
 * The card is a figure, not a feature list: an illustration, a label, a title and
 * one sentence. The bullets were removed because each card sits next to the page it
 * links to, which lists the same features in full — so the card was previewing a
 * preview. The reference is Linear's homepage figure cards ("FIG 0.1" … "FIG 0.3").
 */
export function ProductShowcase({ locale }: { locale: Locale }) {
  const isId = locale === "id";

  const products = [
    {
      key: "vps",
      href: localizedPath(locale, "/vps"),
      kind: "vps" as ServiceKind,
      figure: "FIG 0.1",
      title: isId ? "VPS Hosting" : "VPS Hosting",
      description: isId
        ? "Server NVMe dengan proteksi anti-DDoS, siap pakai dalam hitungan menit."
        : "NVMe servers with DDoS protection, ready in minutes.",
      cta: isId ? "Lihat paket VPS" : "See VPS plans",
    },
    {
      key: "ai",
      href: localizedPath(locale, "/ai"),
      kind: "ai" as ServiceKind,
      figure: "FIG 0.2",
      title: isId ? "AI API" : "AI API",
      description: isId
        ? "Semua model AI lewat satu endpoint, dengan harga per model yang terbuka."
        : "Every AI model through one endpoint, with per-model pricing in the open.",
      cta: isId ? "Lihat layanan AI" : "See AI service",
    },
  ];

  return (
    <section className="section-shell">
      <div className="section-container">
        <SectionHeader
          label={isId ? "Dua Layanan" : "Two Services"}
          title={isId ? "Pilih yang Anda butuhkan." : "Pick what you need."}
          description={
            isId
              ? "Infrastruktur dan kecerdasan buatan dalam satu platform. Masing-masing punya halaman sendiri, lengkap dengan fitur dan harga."
              : "Infrastructure and artificial intelligence on one platform. Each has its own page, with features and pricing."
          }
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          {products.map(({ key, href, kind, figure, title, description, cta }) => (
            <PlanetCard key={key} className="h-full" shape="rounded-xl" surface="bg-background" radius={520}>
              <Card className="glass-card flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col p-6">
                  {/* Figure number, the way the reference labels its diagrams. It
                      says these two cards are a pair, and it is the only place the
                      numbering appears. */}
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {figure}
                  </span>

                  <ServiceIllustration kind={kind} className="my-4" />

                  <h3 className="type-h3">{title}</h3>
                  {/* The gap lives on the paragraph, not the button. `mt-auto` on the
                      button is what aligns the two cards' buttons, but it resolves to
                      0 whenever the content already fills the card — which is exactly
                      when the button ends up flush against the text. A margin here
                      survives in that case. */}
                  <p className="mt-2 mb-8 text-sm text-muted-foreground">{description}</p>

                  <Link
                    href={href}
                    className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-auto w-full")}
                  >
                    {cta}
                    <ArrowRight className="size-4" />
                  </Link>
                </CardContent>
              </Card>
            </PlanetCard>
          ))}
        </div>
      </div>
    </section>
  );
}
