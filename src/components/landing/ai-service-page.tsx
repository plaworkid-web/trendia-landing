import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Coins,
  Gauge,
  Layers,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AiPlanCards } from "@/components/landing/ai-plans";
import { ModelCatalog } from "@/components/landing/model-catalog";
import { ProductFeatures, type ProductFeature } from "@/components/landing/product-features";
import { PublicShell } from "@/components/landing/public-shell";
import { cn } from "@/lib/utils";
import { localizedPath, type Locale } from "@/lib/site";
import type { AiModel, AiPlan } from "@/types/landing";

/**
 * The AI service page: advantages, then the price list, then the model catalogue.
 *
 * The order is deliberate. A visitor arriving at "/ai" does not yet know whether
 * this is for them, so the advantages come first, the plans second (what they would
 * buy), and the catalogue last (what they would call). Putting the model table first
 * buried the commercial decision under a technical one.
 */
export function AiServicePage({
  locale,
  plans,
  models,
}: {
  locale: Locale;
  plans: AiPlan[];
  models: AiModel[];
}) {
  const isId = locale === "id";

  // Each claim maps to something the page or the platform actually does: one
  // endpoint, an OpenAI-compatible path, per-model pricing shown in the catalogue
  // below, pay-as-you-go plans, and failover between upstream providers.
  const features: ProductFeature[] = [
    {
      Icon: Layers,
      title: isId ? "Satu endpoint, banyak model" : "One endpoint, many models",
      description: isId
        ? "Ganti model cukup dengan mengubah satu nama di kode Anda — tidak perlu integrasi baru per penyedia."
        : "Switch models by changing one name in your code — no new integration per provider.",
    },
    {
      Icon: Sparkles,
      title: isId ? "Kompatibel dengan OpenAI" : "OpenAI-compatible",
      description: isId
        ? "Pakai SDK OpenAI yang sudah Anda gunakan. Cukup arahkan base URL ke endpoint kami."
        : "Use the OpenAI SDK you already have. Point the base URL at our endpoint.",
    },
    {
      Icon: Coins,
      title: isId ? "Harga per model terlihat" : "Per-model pricing in the open",
      description: isId
        ? "Harga input dan output tiap model tercantum di katalog — termasuk perbedaan model murah dan mahal."
        : "Every model's input and output price is listed — including how a cheap and an expensive model differ.",
    },
    {
      Icon: Wallet,
      title: isId ? "Paket bulanan atau sesuai pemakaian" : "Monthly plan or pay as you go",
      description: isId
        ? "Pilih jatah kredit bulanan, atau bayar hanya untuk yang Anda pakai tanpa biaya tetap."
        : "Choose a monthly credit allowance, or pay only for what you use with no fixed fee.",
    },
    {
      Icon: ShieldCheck,
      title: isId ? "Failover antar penyedia" : "Failover between providers",
      description: isId
        ? "Jika satu penyedia model bermasalah, permintaan Anda otomatis dicoba ke penyedia cadangan."
        : "If one model provider has trouble, your request is automatically retried elsewhere.",
    },
    {
      Icon: BookOpen,
      title: isId ? "Dokumentasi siap pakai" : "Ready documentation",
      description: isId
        ? "Contoh curl, Node.js, dan Python — serta daftar kode error, supaya integrasi tidak menebak."
        : "curl, Node.js, and Python examples — plus the error codes, so integration is not guesswork.",
    },
  ];

  return (
    <PublicShell locale={locale}>
      <section className="section-shell">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {isId ? "Layanan AI" : "AI Service"}
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              {isId ? "Akses model AI lewat satu API." : "AI models through one API."}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {isId
                ? "Berbagai model AI terdepan melalui endpoint yang kompatibel dengan OpenAI. Bayar sesuai pemakaian, atau pilih paket bulanan."
                : "Leading AI models through an OpenAI-compatible endpoint. Pay as you go, or choose a monthly plan."}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={localizedPath(locale, "/docs")}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                {isId ? "Baca dokumentasi" : "Read the docs"}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={localizedPath(locale, "/models")}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                {isId ? "Lihat katalog model" : "Browse the model catalog"}
              </Link>
            </div>
          </div>

          <ProductFeatures
            label={isId ? "Keunggulan" : "Advantages"}
            title={isId ? "Kenapa memakai AI API kami." : "Why use our AI API."}
            description={
              isId
                ? "Yang Anda dapatkan di setiap paket, sebelum melihat harga."
                : "What you get on every plan, before you look at prices."
            }
            features={features}
          />

          <div className="mt-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {isId ? "Daftar Harga" : "Pricing"}
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {isId ? "Paket Layanan AI" : "AI service plans"}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {isId
                  ? "Semua paket memakai endpoint dan model yang sama — yang berbeda hanya jatah kredit dan cara pembayarannya."
                  : "Every plan uses the same endpoint and models — only the credit allowance and payment method differ."}
              </p>
            </div>
            <div className="mt-10">
              <AiPlanCards plans={plans} locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* The catalogue renders its own heading and section shell ("Katalog AI /
          Semua model, satu endpoint"), so a heading here duplicated it and left a
          gap of empty space between the two — which read as a section that failed to
          load. The wrapper above closes before this, so the catalogue's own heading is
          the only one. */}
      <ModelCatalog locale={locale} models={models} unavailable={models.length === 0} />
    </PublicShell>
  );
}
