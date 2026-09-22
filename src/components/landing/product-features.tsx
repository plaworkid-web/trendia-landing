import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BentoGridShowcase } from "@/components/ui/bento-product-features";
import { cn } from "@/lib/utils";

export interface ProductFeature {
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
 * The layout is a bento grid — one tall card, a 2x2 block, one wide card — rather than
 * a row of equal boxes. Six identical cards read as a list to skim; the asymmetry
 * gives the first and last feature more weight, which is where the strongest points
 * belong. With fewer than six features it falls back to an even grid, because the bento
 * shape needs six slots to make sense.
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

      {features.length < 6 ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      ) : (
        <BentoGridShowcase
          className="mt-10"
          tall={<FeatureCard feature={features[0]} featured />}
          topLeft={<FeatureCard feature={features[1]} />}
          topRight={<FeatureCard feature={features[2]} />}
          bottomLeft={<FeatureCard feature={features[3]} />}
          bottomRight={<FeatureCard feature={features[4]} />}
          wide={<FeatureCard feature={features[5]} featured />}
        />
      )}
    </div>
  );
}

/**
 * One feature card.
 *
 * `featured` marks the tall and wide slots: a larger icon and title, and a subtle
 * primary tint so the two emphasised cards read as a deliberate pair rather than as
 * cards that happen to be bigger.
 */
function FeatureCard({
  feature,
  featured = false,
}: {
  feature: ProductFeature;
  featured?: boolean;
}) {
  const { Icon, title, description } = feature;
  return (
    <Card
      className={cn(
        "glass-card h-full",
        featured && "bg-primary/[0.04] ring-primary/20",
      )}
    >
      <CardContent className="flex h-full flex-col p-5">
        <span
          className={cn(
            "flex items-center justify-center rounded-lg bg-primary/10 text-primary",
            featured ? "size-12" : "size-10",
          )}
        >
          <Icon className={featured ? "size-6" : "size-5"} />
        </span>
        <h3
          className={cn(
            "mt-4 font-semibold tracking-tight",
            featured && "text-lg",
          )}
        >
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
