import type { Changelog } from "@/types/landing";
import { copy, type Locale } from "@/lib/site";

const TYPE_STYLES: Record<string, string> = {
  feature: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  improvement: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  bugfix: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  breaking: "bg-destructive/10 text-destructive",
};

const TYPE_LABELS: Record<string, { id: string; en: string }> = {
  feature: { id: "Fitur", en: "Feature" },
  improvement: { id: "Peningkatan", en: "Improvement" },
  bugfix: { id: "Perbaikan", en: "Bugfix" },
  breaking: { id: "Breaking", en: "Breaking" },
};

export function ChangelogSection({ changelogs, locale }: { changelogs: Changelog[]; locale: Locale }) {
  const t = copy[locale].changelog;
  if (changelogs.length === 0) return null;

  return (
    <section id="changelog" className="section-shell">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">{t.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{t.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t.description}</p>
        </div>

        <ol className="mx-auto mt-10 max-w-3xl space-y-4 border-l border-border pl-6">
          {changelogs.map((entry) => (
            <li key={entry.id} className="relative">
              <span className="absolute -left-[31px] top-1.5 size-3 rounded-full border-2 border-background bg-primary" />
              <div className="rounded-xl border bg-background/60 p-4 backdrop-blur">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold">{entry.version}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      TYPE_STYLES[entry.change_type] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {TYPE_LABELS[entry.change_type]?.[locale] ?? entry.change_type}
                  </span>
                  {entry.release_date && (
                    <span className="text-xs text-muted-foreground">{entry.release_date}</span>
                  )}
                </div>
                <h3 className="mt-2 text-base font-semibold">{entry.title}</h3>
                {entry.content && (
                  <p className="mt-1 text-sm text-muted-foreground">{entry.content}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
