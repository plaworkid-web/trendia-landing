import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  light?: boolean;
}

export function SectionHeader({
  label,
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
      {label && (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.2em]",
            light ? "text-white/60" : "text-primary"
          )}
        >
          {label}
        </p>
      )}
      <h2
        className={cn(
          "font-heading text-3xl font-semibold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-base leading-relaxed sm:text-lg",
            light ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
