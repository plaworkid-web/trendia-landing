import type { LucideIcon } from "lucide-react";
import { BentoGridShowcase } from "@/components/ui/bento-product-features";
import { HomeStyleCard, type HomeStyleFeature } from "@/components/landing/home-style-card";
import { cn } from "@/lib/utils";

export interface ProductFeature extends HomeStyleFeature {
  Icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * The "why this product" block that sits above a price list.
 *
 * A price list without the reasoning behind it is a number the visitor cannot judge:
 * "Rp 165.000" means nothing until they know what is included. Both product pages
 * render this above their plans so the features are read before the price.
 *
 * Cards use the homepage's shape (visual area, hairline, text block with icon) so the
 * whole site reads as one design rather than two.
 */
export function ProductFeatures({
  label,
  title,
  description,
  features,
  className,
}: {
  label: string;
  title: string;
  description?: string;
  features: ProductFeature[];
  className?: string;
}) {
  const heading = (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">{label}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-muted-foreground">{description}</p>}
    </div>
  );

  return (
    <div className={cn("mt-16", className)}>
      {heading}

      {/* Five features: tall on the left, 2x2 beside it. The wide bottom slot has no
          sixth feature to hold, so the tall card's row-span covers the height instead
          of a card that would have to repeat content to fill the space. */}
      {features.length === 5 ? (
        <BentoGridShowcase
          className="mt-10"
          tall={<HomeStyleCard feature={features[0]} className="h-full min-h-[420px]" radius={520} />}
          topLeft={<HomeStyleCard feature={features[1]} className="h-full" radius={360} />}
          topRight={<HomeStyleCard feature={features[2]} className="h-full" radius={360} />}
          bottomLeft={<HomeStyleCard feature={features[3]} className="h-full" radius={360} />}
          bottomRight={<HomeStyleCard feature={features[4]} className="h-full" radius={360} />}
        />
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <HomeStyleCard key={feature.title} feature={feature} />
          ))}
        </div>
      )}
    </div>
  );
}
