import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  return (
    <div className={cn("mt-16", className)}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">{label}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        {description && <p className="mt-4 text-muted-foreground">{description}</p>}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ Icon, title: featureTitle, description: featureDescription }) => (
          <Card key={featureTitle} className="glass-card h-full">
            <CardContent className="p-5">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold tracking-tight">{featureTitle}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{featureDescription}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
