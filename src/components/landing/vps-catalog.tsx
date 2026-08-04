"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Cpu, Database, Gauge, HardDrive, MapPin, MemoryStick, Search, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { contactUrl, type Locale } from "@/lib/site";
import { dummyVpsPlans, type VpsPlanType } from "@/lib/dummy-vps-plans";

const USD_TO_IDR = 16_500;

const typeLabels: Record<VpsPlanType, { id: string; en: string }> = {
  general: { id: "General Purpose", en: "General Purpose" },
  compute: { id: "Optimasi Compute", en: "Compute Optimized" },
  memory: { id: "Optimasi Memori", en: "Memory Optimized" },
  gpu: { id: "GPU", en: "GPU" },
};

function formatPrice(amount: number, currency: "IDR" | "USD") {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(currency === "IDR" ? amount : amount / USD_TO_IDR);
}

export function VpsCatalog({ locale }: { locale: Locale }) {
  const isId = locale === "id";
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | VpsPlanType>("all");
  const [currency, setCurrency] = useState<"IDR" | "USD">("IDR");

  const filteredPlans = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return dummyVpsPlans.filter((plan) => {
      const matchesType = type === "all" || plan.type === type;
      const searchable = `${plan.name} ${typeLabels[plan.type][locale]} ${plan.region} ${plan.vcpu} vCPU ${plan.ramGb} GB`;
      return matchesType && (!needle || searchable.toLowerCase().includes(needle));
    });
  }, [locale, query, type]);

  return (
    <section className="section-shell">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">{isId ? "Katalog VPS" : "VPS Catalog"}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{isId ? "Server cepat untuk setiap workload." : "Fast servers for every workload."}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {isId ? "Pilih resource, lokasi, dan tipe server yang sesuai. Semua paket menggunakan NVMe dan dilindungi anti-DDoS." : "Choose the resources, location, and server type you need. Every plan includes NVMe storage and DDoS protection."}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 rounded-xl border bg-background/70 p-3 backdrop-blur sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <span className="sr-only">{isId ? "Cari paket VPS" : "Search VPS plans"}</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isId ? "Cari paket, region, atau spesifikasi..." : "Search plans, regions, or specifications..."} className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </label>
          <select value={type} onChange={(event) => setType(event.target.value as "all" | VpsPlanType)} className="h-10 rounded-lg border bg-background px-3 text-sm" aria-label={isId ? "Filter tipe VPS" : "Filter VPS type"}>
            <option value="all">{isId ? "Semua tipe" : "All types"}</option>
            {(Object.keys(typeLabels) as VpsPlanType[]).map((item) => <option key={item} value={item}>{typeLabels[item][locale]}</option>)}
          </select>
          <div className="flex rounded-lg border bg-background p-1">
            {(["IDR", "USD"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setCurrency(item)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${currency === item ? "bg-foreground text-background" : "text-muted-foreground"}`}>{item}</button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
          <p>{filteredPlans.length} {isId ? "paket tersedia" : "plans available"}</p>
          <p>{isId ? "Harga per bulan" : "Monthly pricing"}</p>
        </div>

        {filteredPlans.length === 0 ? (
          <Card className="mt-8"><CardContent className="py-12 text-center text-muted-foreground">{isId ? "Tidak ada paket yang sesuai dengan pencarian." : "No plans match your search."}</CardContent></Card>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className={cn("glass-card relative", plan.featured && "ring-1 ring-primary/60")}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Server className="size-5" /></span>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{typeLabels[plan.type][locale]}</p>
                        <CardTitle className="mt-1 text-lg">{plan.name}</CardTitle>
                      </div>
                    </div>
                    {plan.featured && <Badge>{isId ? "Populer" : "Popular"}</Badge>}
                  </div>
                  <p className="mt-3 min-h-10 text-sm text-muted-foreground">{plan.description[locale]}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-5 flex items-end gap-1 border-b pb-5">
                    <span className="text-3xl font-bold tracking-tight">{formatPrice(plan.monthlyIdr, currency)}</span>
                    <span className="pb-1 text-xs text-muted-foreground">/{isId ? "bulan" : "month"}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-sm">
                    <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-2.5"><Cpu className="size-4 text-primary" /><span><strong>{plan.vcpu}</strong> vCPU</span></div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-2.5"><MemoryStick className="size-4 text-primary" /><span><strong>{plan.ramGb} GB</strong> RAM</span></div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-2.5"><HardDrive className="size-4 text-primary" /><span><strong>{plan.storageGb} GB</strong> NVMe</span></div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-2.5"><Gauge className="size-4 text-primary" /><span><strong>{plan.bandwidthTb} TB</strong> traffic</span></div>
                  </div>

                  <div className="mt-4 space-y-2 border-t pt-4 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><MapPin className="size-4" />{plan.region}</p>
                    <p className="flex items-center gap-2"><Database className="size-4" />{plan.networkGbps} Gbps network</p>
                    <p className="flex items-start gap-2"><Check className="mt-0.5 size-4 text-emerald-500" /><span>{plan.os.join(", ")}</span></p>
                  </div>

                  <Link href={contactUrl} className={cn(buttonVariants({ variant: plan.featured ? "default" : "outline", size: "lg" }), "mt-5 w-full")}>
                    {isId ? "Pilih paket" : "Choose plan"}<ArrowRight className="size-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
