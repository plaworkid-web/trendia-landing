import { PublicShell } from "@/components/landing/public-shell";
import { copy, type Locale } from "@/lib/site";

export interface LegalSection {
  heading: string;
  /** Paragraphs. A leading "- " marks a list item. */
  body: string[];
}

/**
 * Shared shell for the legal pages (privacy, terms).
 *
 * The text is a starting draft, not legal advice: it describes what this platform
 * actually does — including that prompts are forwarded to third-party model
 * providers — and marks the details only the operator can supply (registered
 * address, contact mailbox, governing jurisdiction) with a visible placeholder
 * rather than inventing them.
 */
export function LegalPage({
  locale,
  title,
  eyebrow,
  updated,
  intro,
  sections,
}: {
  locale: Locale;
  title: string;
  eyebrow: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  const t = copy[locale].legal;
  return (
    <PublicShell locale={locale}>
      <section className="section-shell">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="type-eyebrow">{eyebrow}</p>
            <h1 className="type-display mt-2">{title}</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              {t.updated}: {updated}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-8">
            {/* Say plainly that this is a draft. Presenting placeholder text as an
                executed agreement would be worse than having no page at all. */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
              {t.draftNotice}
            </div>

            <p className="text-muted-foreground">{intro}</p>

            {sections.map((section) => (
              <div key={section.heading} className="space-y-3">
                <h2 className="type-h3">{section.heading}</h2>
                {section.body.map((paragraph) =>
                  paragraph.startsWith("- ") ? (
                    <p key={paragraph} className="flex gap-2 pl-1 text-sm text-muted-foreground">
                      <span aria-hidden className="text-primary">
                        •
                      </span>
                      <span>{paragraph.slice(2)}</span>
                    </p>
                  ) : (
                    <p key={paragraph} className="text-sm text-muted-foreground">
                      {paragraph}
                    </p>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
