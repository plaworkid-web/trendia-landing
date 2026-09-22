import type { LucideIcon } from "lucide-react";
import { PlanetCard } from "@/components/ui/planet-card";
import { cn } from "@/lib/utils";

/**
 * Feature card matching the homepage's capability cards, lit like a planet.
 *
 * The homepage card is a dark shell with a visual area on top and a text block below,
 * separated by a hairline. That shell is hardcoded black because its section is always
 * black — the homepage's `#features` section sets `bg-black` regardless of theme, while
 * the rest of the site follows light/dark. Copying it verbatim onto /ai and /vps would
 * paint a black card on a light page.
 *
 * The card's background is `bg-background` (opaque) with a `bg-card` tint on top,
 * rather than `bg-card` alone. `--card` is 45% transparent in dark mode and 55% in
 * light, so a halo behind the card would shine straight through the middle and wash
 * out the text. The tint keeps the glass look while the opaque layer underneath keeps
 * the light outside, where it belongs.
 */
export interface HomeStyleFeature {
  Icon: LucideIcon;
  title: string;
  description: string;
  /** Optional artwork for the upper area. */
  visual?: React.ReactNode;
}

export function HomeStyleCard({
  feature,
  className,
  radius,
}: {
  feature: HomeStyleFeature;
  className?: string;
  /** Halo size; a tall card gets a larger light source than a small one. */
  radius?: number;
}) {
  const { Icon, title, description, visual } = feature;

  return (
    <PlanetCard className={cn("h-full", className)} radius={radius}>
      <div className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-xl border border-foreground/10 bg-background transition-colors duration-300 group-hover/planet:border-foreground/20">
        {/* Glass tint over the opaque base. Decorative only. */}
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-card" />

        <div className="relative flex flex-1 items-center justify-center p-6">
          {visual ?? (
            <span className="flex size-14 items-center justify-center rounded-xl bg-foreground/[0.06] text-foreground/70">
              <Icon className="size-7" />
            </span>
          )}
        </div>

        {/* Text block, separated by the same hairline the homepage uses. */}
        <div className="relative border-t border-foreground/[0.06] bg-foreground/[0.01] p-6">
          <div className="mb-2 flex items-center gap-2">
            <Icon className="size-4 shrink-0 text-primary" />
            <h4 className="type-h4">{title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </PlanetCard>
  );
}
