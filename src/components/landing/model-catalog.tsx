"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { copy, type Locale } from "@/lib/site";
import type { AiModel } from "@/types/landing";

function formatPrice(amount: number, currency: "IDR" | "USD") {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 4,
  }).format(amount);
}

export function ModelCatalog({ models, locale, unavailable = false }: { models: AiModel[]; locale: Locale; unavailable?: boolean }) {
  const t = copy[locale].models;
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState("all");
  const [currency, setCurrency] = useState<"IDR" | "USD">("IDR");
  const [copied, setCopied] = useState<string | null>(null);
  const providers = useMemo(() => [...new Set(models.map((model) => model.provider_name))].sort(), [models]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return models.filter((model) => {
      const matchesProvider = provider === "all" || model.provider_name === provider;
      const matchesQuery = !needle || `${model.display_name} ${model.model_id} ${model.provider_name}`.toLowerCase().includes(needle);
      return matchesProvider && matchesQuery;
    });
  }, [models, provider, query]);

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
          <select value={provider} onChange={(event) => setProvider(event.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm">
            <option value="all">{t.all}</option>
            {providers.map((item) => <option key={item} value={item}>{item}</option>)}
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
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((model) => {
              const price = model.prices.find((item) => item.currency_code === currency);
              return (
                <Card key={model.id} className="glass-card">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{model.provider_name}</p>
                        <CardTitle className="mt-1">{model.display_name}</CardTitle>
                      </div>
                      {model.is_featured && <Badge>{locale === "id" ? "Unggulan" : "Featured"}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <button type="button" onClick={() => copyModel(model.model_id)} className="flex w-full items-center justify-between gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-left font-mono text-xs hover:bg-muted" aria-label={t.copy}>
                      <span className="truncate">{model.model_id}</span>
                      {copied === model.model_id ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4 shrink-0" />}
                    </button>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline">{model.category}</Badge>
                      {model.supports_streaming && <Badge variant="secondary">streaming</Badge>}
                      {model.supports_vision && <Badge variant="secondary">vision</Badge>}
                      {model.supports_function_calling && <Badge variant="secondary">tools</Badge>}
                      {model.supports_json_mode && <Badge variant="secondary">JSON</Badge>}
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-t pt-4 text-xs">
                      <div><p className="text-muted-foreground">{t.context}</p><p className="mt-1 font-semibold">{model.context_window ? `${Math.round(model.context_window / 1000)}K` : "-"}</p></div>
                      <div><p className="text-muted-foreground">{t.input}</p><p className="mt-1 font-semibold">{price ? formatPrice(price.input_price_per_1m, currency) : "-"}</p></div>
                      <div><p className="text-muted-foreground">{t.output}</p><p className="mt-1 font-semibold">{price ? formatPrice(price.output_price_per_1m, currency) : "-"}</p></div>
                    </div>
                    {/* Say so when the figure is a conversion, not a stored price:
                        a USD number derived from IDR moves with the exchange rate
                        and should not read as a fixed list price. */}
                    {price?.converted && (
                      <p className="text-[11px] text-muted-foreground">
                        {locale === "id"
                          ? "Perkiraan, dikonversi dari harga IDR"
                          : "Approximate, converted from the IDR price"}
                      </p>
                    )}
                    {model.status === "deprecated" && <p className="text-xs text-amber-600">{model.deprecation_notice || "Deprecated"}</p>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
