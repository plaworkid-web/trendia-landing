"use client";

import { useState } from "react";
import { BrainCircuit, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import { VpsPlanCards } from "@/components/landing/vps-plans";
import { AiPlanCards } from "@/components/landing/ai-plans";
import type { AiPlan, VpsPlan } from "@/types/landing";
import { copy, type Locale } from "@/lib/site";

interface PricingSectionProps {
  aiPlans: AiPlan[];
  vpsPlans: VpsPlan[];
  locale: Locale;
  asPage?: boolean;
}

export function PricingSection({ aiPlans, vpsPlans, locale, asPage = false }: PricingSectionProps) {
  const [activeTab, setActiveTab] = useState<"vps" | "ai">("vps");
  const t = copy[locale].pricing;

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-muted/30 py-20 sm:py-28"
    >
      <span id="vps-plans" className="absolute top-0" aria-hidden="true" />
      <span id="ai-plans" className="absolute top-0" aria-hidden="true" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(128,128,128,0.08) 0.8px, transparent 0.8px)",
          backgroundSize: "14px 14px",
          maskImage:
            "radial-gradient(circle at 50% 10%, rgba(0,0,0,1), rgba(0,0,0,0.2) 40%, rgba(0,0,0,0) 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)] blur-[30px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="type-eyebrow">
            {t.eyebrow}
          </p>
          {asPage ? (
            <h1 className="type-display mt-2">{t.title}</h1>
          ) : (
            <h2 className="type-h2 mt-2">{t.title}</h2>
          )}
          <p className="mt-4 text-lg text-muted-foreground">
            {t.description}
          </p>
        </div>

        <div className="mx-auto mt-8 flex w-fit rounded-full border bg-background/70 p-1 shadow-sm backdrop-blur">
          <button
            type="button"
            onClick={() => setActiveTab("vps")}
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
              activeTab === "vps"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Server className="size-4" />
            {t.vps}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={cn(
              "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
              activeTab === "ai"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BrainCircuit className="size-4" />
            {t.ai}
          </button>
        </div>

        <div className="mt-12">
          {activeTab === "vps" ? <VpsPlanCards plans={vpsPlans} locale={locale} /> : <AiPlanCards plans={aiPlans} locale={locale} />}
        </div>
      </div>
    </section>
  );
}
