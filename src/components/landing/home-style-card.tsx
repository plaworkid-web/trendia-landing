import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Feature card matching the homepage's capability cards.
 *
 * The homepage card is a dark shell with a visual area on top and a text block below,
 * separated by a hairline. That shell is hardcoded black because its section is always
 * black — the homepage's `#features` section sets `bg-black` regardless of theme, while
 * the rest of the site follows light/dark. Copying it verbatim onto /ai and /vps would
 * paint a black card on a light page.
 *
 * So the same shape is built from theme tokens: `bg-card`, `ring-foreground/10`,
 * `text-foreground`, `text-muted-foreground`. In dark mode it reads as the homepage
 * card; in light mode it stays legible instead of turning into a black rectangle.
 *
 * The visual area holds a small illustration per card. It is optional: a card with no
 * artwork renders its icon larger instead of leaving a hole.
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
}: {
  feature: HomeStyleFeature;
  className?: string;
}) {
  const { Icon, title, description, visual } = feature;

  return (
    <div
      className={cn(
        "group flex h-full min-h-[280px] flex-col overflow-hidden rounded-xl border border-foreground/10 bg-card transition-colors hover:border-foreground/20",
        className,
      )}
    >
      {/* Visual area. `flex-1` lets it absorb the extra height in a tall bento slot,
          so the text block stays pinned to the bottom of every card in a row. */}
      <div className="flex flex-1 items-center justify-center p-6">
        {visual ?? (
          <span className="flex size-14 items-center justify-center rounded-xl bg-foreground/[0.06] text-foreground/70">
            <Icon className="size-7" />
          </span>
        )}
      </div>

      {/* Text block, separated by the same hairline the homepage uses. */}
      <div className="border-t border-foreground/[0.06] bg-foreground/[0.01] p-6">
        <div className="mb-2 flex items-center gap-2">
          <Icon className="size-4 shrink-0 text-primary" />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
