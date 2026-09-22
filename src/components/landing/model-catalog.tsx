"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { copy, type Locale } from "@/lib/site";
import type { AiModel } from "@/types/landing";

function formatPrice(amount: number, currency: "IDR" | "USD") {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 4,
  }).format(amount);
}

function formatContext(tokens: number | null) {
  if (!tokens) return "-";
  if (tokens >= 1_000_000) return `${Math.round(tokens / 1_000_000)}M`;
  return `${Math.round(tokens / 1000)}K`;
}

/** Price with the list price struck through when a promotion applies.
 *
 * The stored price is the LIST price — billing starts from it and subtracts the
 * discount (`quote_discount(...).final_amount`). So the struck-through figure is
 * `amount` and the price the customer pays is `amount * (1 - off/100)`. Getting
 * this backwards would advertise a price higher than the one charged.
 */
function PriceCell({
  amount,
  currency,
  discountPercent,
}: {
  amount: number;
  currency: "IDR" | "USD";
  discountPercent: number;
}) {
  if (discountPercent <= 0) {
    return <span className="tabular-nums font-medium">{formatPrice(amount, currency)}</span>;
  }
  const final = amount * (1 - discountPercent / 100);
  return (
    <span className="flex flex-col items-end gap-0.5">
      <span className="text-[11px] text-muted-foreground line-through tabular-nums">
        {formatPrice(amount, currency)}
      </span>
      <span className="tabular-nums font-semibold text-emerald-600">
        {formatPrice(final, currency)}
      </span>
    </span>
  );
}

export function ModelCatalog({ models, locale, unavailable = false }: { models: AiModel[]; locale: Locale; unavailable?: boolean }) {
  const t = copy[locale].models;
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const [currency, setCurrency] = useState<"IDR" | "USD">("IDR");
  const [copied, setCopied] = useState<string | null>(null);

  // Group by brand family (Claude, DeepSeek, ...), which is what a price list does
  // and what the customer recognises. The upstream supplier never appears here.
  const families = useMemo(() => {
    const seen = new Map<string, string>();
    for (const model of models) {
      const slug = model.family_slug ?? "other";
      if (!seen.has(slug)) seen.set(slug, model.family_label ?? slug);
    }
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [models]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return models.filter((model) => {
      const matchesFamily = family === "all" || (model.family_slug ?? "other") === family;
      const matchesQuery = !needle || `${model.display_name} ${model.model_id}`.toLowerCase().includes(needle);
      return matchesFamily && matchesQuery;
    });
  }, [models, family, query]);

  // Keep the family groups together and in a stable order, so a table sorted by
  // price does not scatter one brand across the page.
  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; items: AiModel[] }>();
    for (const model of filtered) {
      const slug = model.family_slug ?? "other";
      if (!map.has(slug)) map.set(slug, { label: model.family_label ?? slug, items: [] });
      map.get(slug)!.items.push(model);
    }
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [filtered]);

  async function copyModel(modelId: string) {
    await navigator.clipboard.writeText(modelId);
    setCopied(modelId);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <section className="section-shell">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">{t.eyebrow}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{t.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t.description}</p>
        </div>

        <div className="mt-10 flex flex-col gap-3 rounded-xl border bg-background/70 p-3 backdrop-blur sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <span className="sr-only">{t.search}</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </label>
          <select value={family} onChange={(event) => setFamily(event.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm">
            <option value="all">{t.all}</option>
            {families.map(([slug, label]) => <option key={slug} value={slug}>{label}</option>)}
          </select>
          <div className="flex rounded-lg border bg-background p-1">
            {(["IDR", "USD"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setCurrency(item)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${currency === item ? "bg-foreground text-background" : "text-muted-foreground"}`}>{item}</button>
            ))}
          </div>
        </div>

        {unavailable ? (
          <Card className="mt-8"><CardContent className="py-12 text-center text-muted-foreground">{t.unavailable}</CardContent></Card>
        ) : filtered.length === 0 ? (
          <Card className="mt-8"><CardContent className="py-12 text-center text-muted-foreground">{t.empty}</CardContent></Card>
        ) : (
          <div className="mt-8 space-y-6">
            {grouped.map((group) => (
              <div key={group.label} className="overflow-hidden rounded-xl border">
                <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-4 py-2.5">
                  <h2 className="text-sm font-semibold">{group.label}</h2>
                  <span className="text-xs text-muted-foreground">{group.items.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-2 font-medium">{t.model}</th>
                        <th className="px-3 py-2 text-right font-medium">{t.context}</th>
                        <th className="px-3 py-2 text-right font-medium">{t.input}</th>
                        <th className="px-4 py-2 text-right font-medium">{t.output}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((model) => {
                        const price = model.prices.find((item) => item.currency_code === currency);
                        const off = model.discount_percent ?? 0;
                        return (
                          <tr key={model.id} className="border-b last:border-0 align-top hover:bg-muted/30">
                            <td className="px-4 py-3">
                              <div className="flex items-start gap-2">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="font-medium">{model.display_name}</span>
                                    {off > 0 && (
                                      <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                                        {Math.round(off)}% {t.off}
                                      </Badge>
                                    )}
                                    {model.is_featured && <Badge variant="secondary">{locale === "id" ? "Unggulan" : "Featured"}</Badge>}
                                    {model.status === "deprecated" && <Badge variant="outline">{locale === "id" ? "Usang" : "Deprecated"}</Badge>}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => copyModel(model.model_id)}
                                    className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground"
                                    aria-label={t.copy}
                                  >
                                    <span className="truncate">{model.model_id}</span>
                                    {copied === model.model_id ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3 shrink-0" />}
                                  </button>
                                  <div className="mt-1.5 flex flex-wrap gap-1">
                                    {model.supports_streaming && <Badge variant="outline" className="text-[10px]">streaming</Badge>}
                                    {model.supports_vision && <Badge variant="outline" className="text-[10px]">vision</Badge>}
                                    {model.supports_function_calling && <Badge variant="outline" className="text-[10px]">tools</Badge>}
                                    {model.supports_json_mode && <Badge variant="outline" className="text-[10px]">JSON</Badge>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{formatContext(model.context_window)}</td>
                            <td className="px-3 py-3 text-right">
                              {price ? <PriceCell amount={price.input_price_per_1m} currency={currency} discountPercent={off} /> : "-"}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {price ? <PriceCell amount={price.output_price_per_1m} currency={currency} discountPercent={off} /> : "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            {/* Say so when the figure is a conversion, not a stored price: a USD
                number derived from IDR moves with the exchange rate. */}
            {currency === "USD" && filtered.some((m) => m.prices.find((p) => p.currency_code === "USD")?.converted) && (
              <p className="text-xs text-muted-foreground">
                {locale === "id" ? "Perkiraan, dikonversi dari harga IDR" : "Approximate, converted from the IDR price"}
              </p>
            )}
            <p className="text-xs text-muted-foreground">{t.priceNote}</p>
          </div>
        )}
      </div>
    </section>
  );
}
