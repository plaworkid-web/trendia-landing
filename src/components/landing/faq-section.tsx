"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/types/landing";
import { copy, type Locale } from "@/lib/site";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  const t = copy[locale].faq;
  if (faqs.length === 0) return null;

  const body = (
    <>
      <div className={cn("text-center", !embedded && "mx-auto max-w-2xl")}>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">{t.eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{t.title}</h2>
        <p className="mt-4 text-lg text-muted-foreground">{t.description}</p>
      </div>

        <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-2xl border bg-background/60 backdrop-blur">
          {faqs.map((faq) => {
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
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
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
