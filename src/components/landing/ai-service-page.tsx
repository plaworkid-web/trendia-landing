import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AiPlanCards } from "@/components/landing/ai-plans";
import { ModelCatalog } from "@/components/landing/model-catalog";
import { ProductFeatures, type ProductFeature } from "@/components/landing/product-features";
import { aiFeatureVisuals } from "@/components/landing/ai-feature-visuals";
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

  const features: ProductFeature[] = aiFeatureVisuals(isId);

  return (
    <PublicShell locale={locale}>
      <section className="section-shell">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="type-eyebrow">
              {isId ? "Layanan AI" : "AI Service"}
            </p>
            <h1 className="type-display mt-2">
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
              <p className="type-eyebrow">
                {isId ? "Daftar Harga" : "Pricing"}
              </p>
              <h2 className="type-h2 mt-2">
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
