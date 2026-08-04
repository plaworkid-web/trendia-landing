import {
  ClientsSection,
  type Stat,
  type Testimonial as CardTestimonial,
} from "@/components/ui/testimonial-card";
import type { Testimonial as BackendTestimonial } from "@/types/landing";
import { localizedPath, portalUrl, type Locale } from "@/lib/site";

interface TestimonialsProps {
  testimonials: BackendTestimonial[];
  locale: Locale;
  brandName?: string;
}

const statsData: Stat[] = [
  { value: "1,000+", label: "Happy clients" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.9", label: "Average Rating" },
];

const fallbackTestimonials: CardTestimonial[] = [
  {
    name: "Ahmad Rizki",
    title: "CTO at TechStartup.id",
    quote:
      "The VPS performance is incredible. We migrated from another provider and saw 3x improvement in response times. The AI API integration was a game-changer for our product.",
    avatarFallback: "AR",
    rating: 5.0,
  },
  {
    name: "Sarah Chen",
    title: "Lead Developer at DataFlow AI",
    quote:
      "Having access to multiple AI models through a single API is exactly what we needed. The credit-based pricing is transparent and the documentation is excellent.",
    avatarFallback: "SC",
    rating: 4.9,
  },
  {
    name: "Budi Santoso",
    title: "DevOps Engineer at CloudNine",
    quote:
      "99.9% uptime is not just a promise here. We've been running production workloads for 8 months without a single incident. The support team is also very responsive.",
    avatarFallback: "BS",
    rating: 5.0,
  },
];

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

export function Testimonials({ testimonials, locale, brandName = "Trendia" }: TestimonialsProps) {
  const isId = locale === "id";
  const cards =
    testimonials.length > 0
      ? mapBackendToCard(testimonials, brandName)
      : fallbackTestimonials;

  return (
    <ClientsSection
      tagLabel={isId ? "Testimoni" : "Testimonials"}
      title={isId ? "Dipercaya Developer & Tim" : "Trusted by Developers & Teams"}
      description={isId ? `Pengalaman pelanggan menggunakan VPS hosting dan AI API ${brandName}.` : `See what customers say about ${brandName} VPS hosting and AI API.`}
      stats={statsData}
      testimonials={cards}
      primaryActionLabel={isId ? "Mulai sekarang" : "Get started"}
      primaryActionHref={`${portalUrl}/register`}
      secondaryActionLabel={isId ? "Lihat Harga" : "View Pricing"}
      secondaryActionHref={localizedPath(locale, "/pricing")}
    />
  );
}
