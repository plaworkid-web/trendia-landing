import { cn } from "@/lib/utils";

/**
 * The shared section header. Every section on the landing renders through this, so
 * its sizes ARE the h2 style — a component that overrides them is how the homepage
 * ended up with five different h2 treatments.
 *
 * Sizes come from the `type-*` classes in globals.css, never from local literals.
 */
interface SectionHeaderProps {
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  light?: boolean;
}

export function SectionHeader({
  title,
  description,
  align = "center",
  className,
  light = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-2xl space-y-3",
        align === "center" && "text-center",
        align === "left" && "mx-0 text-left",
        className
      )}
    >
      <h2 className={cn("type-h2", light && "text-white")}>{title}</h2>
      {description && (
        <p className={cn("type-lead", light && "text-white/70")}>{description}</p>
      )}
    </div>
  );
}
