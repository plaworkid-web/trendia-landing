"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/types/landing";
import { copy, type Locale } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Most questions the section will show.
 *
 * The list is curated in the CMS, and it had drifted to twelve rows - long enough that
 * the section stopped being read. The cap keeps a future addition from silently undoing
 * that; the CMS still lists every row, so an operator can see what is stored.
 */
const MAX_FAQS = 6;

export function FaqSection({
  faqs,
  locale,
  /**
   * Renders without the outer `<section>` and its padding, for placing inside a grid
   * beside another block. The wrapper owns the section and the spacing then.
   */
  embedded = false,
}: {
  faqs: Faq[];
  locale: Locale;
  embedded?: boolean;
}) {
  // Sorted by the order the CMS assigns, then capped. `sort_order` is already applied by
  // the API; sorting again here keeps the component correct if it is handed raw rows.
  const shown = [...faqs].sort((a, b) => a.sort_order - b.sort_order).slice(0, MAX_FAQS);
  const [open, setOpen] = useState<string | null>(shown[0]?.id ?? null);
  const t = copy[locale].faq;
  if (shown.length === 0) return null;

  const body = (
    <>
      <div className={cn("text-center", !embedded && "mx-auto max-w-2xl")}>
        <h2 className="type-h2">{t.title}</h2>
        <p className="mt-4 text-lg text-muted-foreground">{t.description}</p>
      </div>

        <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-2xl border bg-background/60 backdrop-blur">
          {shown.map((faq) => {
            const isOpen = open === faq.id;
            return (
              <div key={faq.id}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={cn("size-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 type-body-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
    </>
  );

  // Embedded, the caller already provides the section and its container.
  if (embedded) return <div id="faq">{body}</div>;

  return (
    <section id="faq" className="section-shell">
      <div className="section-container">{body}</div>
    </section>
  );
}
