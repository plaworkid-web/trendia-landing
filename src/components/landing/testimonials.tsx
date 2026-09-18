import {
  ClientsSection,
  type Stat,
  type Testimonial as CardTestimonial,
} from "@/components/ui/testimonial-card";
import type { Testimonial as BackendTestimonial, AiModel, AiPlan } from "@/types/landing";
import { copy, localizedPath, portalUrl, type Locale } from "@/lib/site";

interface TestimonialsProps {
  testimonials: BackendTestimonial[];
  locale: Locale;
  brandName?: string;
  models?: AiModel[];
  plans?: AiPlan[];
}

function buildStats(models: AiModel[], plans: AiPlan[], isId: boolean): Stat[] {
  const stats: Stat[] = [];
  if (models.length > 0) {
    const providers = new Set(models.map((model) => model.provider_name));
    stats.push({
      value: `${models.length}+`,
      label: isId ? "Model AI tersedia" : "AI models available",
    });
    stats.push({
      value: `${providers.size}`,
      label: isId ? "Provider terhubung" : "Connected providers",
    });
  }
  if (plans.length > 0) {
    stats.push({
      value: `${plans.length}`,
      label: isId ? "Paket fleksibel" : "Flexible plans",
    });
  }
  return stats;
}

const fallbackTestimonials: CardTestimonial[] = [];

function mapBackendToCard(
  items: BackendTestimonial[],
  brandName: string,
): CardTestimonial[] {
  return items.map((t) => ({
    name: t.name,
    title: [t.position, t.company].filter(Boolean).join(" at ") || t.company || "",
    quote: t.content.replace(/Trendia(?:\.id)?/gi, brandName),
    avatarSrc: t.avatar_url ?? undefined,
    avatarFallback: t.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    rating: typeof t.rating === "number" ? t.rating : 5,
  }));
}

export function Testimonials({
  testimonials,
  locale,
  brandName = "Trendia",
  models = [],
  plans = [],
}: TestimonialsProps) {
  const isId = locale === "id";
  const t = copy[locale].testimonials;
  const cards =
    testimonials.length > 0
      ? mapBackendToCard(testimonials, brandName)
      : fallbackTestimonials;
  const stats = buildStats(models, plans, isId);

  if (cards.length === 0) return null;

  return (
    <ClientsSection
      tagLabel={t.tag}
      title={t.title}
      description={isId ? `Pengalaman pelanggan menggunakan VPS hosting dan AI API ${brandName}.` : `See what customers say about ${brandName} VPS hosting and AI API.`}
      stats={stats}
      testimonials={cards}
      primaryActionLabel={t.primary}
      primaryActionHref={`${portalUrl}/register`}
      secondaryActionLabel={t.secondary}
      secondaryActionHref={localizedPath(locale, "/pricing")}
    />
  );
}
