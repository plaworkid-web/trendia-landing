import Link from "next/link";
import { ArrowRight, BrainCircuit, Check, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlanetCard } from "@/components/ui/planet-card";
import { SectionHeader } from "@/components/landing/section-header";
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
 */
export function ProductShowcase({ locale }: { locale: Locale }) {
  const isId = locale === "id";

  const products = [
    {
      key: "vps",
      href: localizedPath(locale, "/vps"),
      Icon: Server,
      eyebrow: isId ? "Infrastruktur" : "Infrastructure",
      title: isId ? "VPS Hosting" : "VPS Hosting",
      description: isId
        ? "Server virtual dengan NVMe, proteksi anti-DDoS, dan pilihan lokasi. Dari paket kecil untuk pengembangan sampai GPU untuk komputasi berat."
        : "Virtual servers with NVMe storage, DDoS protection, and multiple regions. From a small development box to a GPU for heavy compute.",
      points: isId
        ? ["NVMe storage di semua paket", "Proteksi anti-DDoS", "Pilihan tipe: umum, compute, memori, GPU", "Pilihan sistem operasi"]
        : ["NVMe storage on every plan", "DDoS protection", "Types: general, compute, memory, GPU", "Choice of operating system"],
      cta: isId ? "Lihat paket VPS" : "See VPS plans",
    },
    {
      key: "ai",
      href: localizedPath(locale, "/ai"),
      Icon: BrainCircuit,
      eyebrow: isId ? "Kecerdasan Buatan" : "Artificial Intelligence",
      title: isId ? "AI API" : "AI API",
      description: isId
        ? "Akses banyak model AI melalui satu endpoint yang kompatibel dengan OpenAI. Bayar sesuai pemakaian, atau pilih paket bulanan dengan jatah kredit."
        : "Access many AI models through one OpenAI-compatible endpoint. Pay as you go, or choose a monthly plan with a credit allowance.",
      points: isId
        ? ["Satu endpoint untuk semua model", "Kompatibel dengan SDK OpenAI", "Bayar sesuai pemakaian atau paket bulanan", "Harga per model terlihat jelas"]
        : ["One endpoint for every model", "Works with the OpenAI SDK", "Pay-as-you-go or monthly plans", "Per-model pricing in the open"],
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
          {products.map(({ key, href, Icon, eyebrow, title, description, points, cta }) => (
            <PlanetCard key={key} className="h-full" shape="rounded-xl" surface="bg-background" radius={520}>
              <Card className="glass-card flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col p-6">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </span>
                <Badge variant="outline" className="mt-4 w-fit text-[10px] uppercase tracking-wider">
                  {eyebrow}
                </Badge>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>

                <ul className="mt-5 space-y-2 text-sm">
                  {points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={href}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-6 w-full")}
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
