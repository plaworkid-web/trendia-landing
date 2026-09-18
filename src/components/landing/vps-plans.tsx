import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import * as PricingCard from "@/components/ui/pricing-card";
import { CheckCircle2, Server } from "lucide-react";
import { portalUrl, type Locale } from "@/lib/site";
import type { VpsPlan } from "@/types/landing";

function priceLabel(plan: VpsPlan, isId: boolean): { price: string; original?: string; period: string } {
  const target =
    plan.prices.find((p) => p.currency_code === "IDR") ??
    plan.prices.find((p) => p.billing_period === "monthly") ??
    plan.prices[0];

  if (!target) return { price: plan.cta_label || (isId ? "Custom" : "Custom"), period: "" };

  const formatted = new Intl.NumberFormat(
    target.currency_code === "IDR" ? "id-ID" : "en-US",
    { style: "currency", currency: target.currency_code, minimumFractionDigits: 0, maximumFractionDigits: 0 },
  ).format(target.price);

  const original =
    target.original_price != null && target.original_price > target.price
      ? new Intl.NumberFormat(
          target.currency_code === "IDR" ? "id-ID" : "en-US",
          { style: "currency", currency: target.currency_code, minimumFractionDigits: 0, maximumFractionDigits: 0 },
        ).format(target.original_price)
      : undefined;

  return {
    price: formatted,
    original,
    period: target.billing_period === "yearly" ? (isId ? "/tahun" : "/year") : isId ? "/bulan" : "/month",
  };
}

export function VpsPlanCards({ plans = [], locale = "id" }: { plans?: VpsPlan[]; locale?: Locale }) {
  const isId = locale === "id";

  if (plans.length === 0) {
    return (
      <PricingCard.Card className="mx-auto max-w-md">
        <PricingCard.Body>
          <PricingCard.Description>
            {isId ? "Paket VPS belum tersedia." : "VPS plans are not available yet."}
          </PricingCard.Description>
        </PricingCard.Body>
      </PricingCard.Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => {
        const { price, original, period } = priceLabel(plan, isId);
        const description = isId
          ? plan.description ?? plan.description_en ?? ""
          : plan.description_en ?? plan.description ?? "";
        const features = plan.features ?? [];
        const ctaHref = plan.cta_url || `${portalUrl}/dashboard/vps?plan=${encodeURIComponent(plan.slug)}`;
        return (
          <PricingCard.Card
            className={cn(
              "md:min-w-[220px]",
              plan.is_featured && "border-orange-500/50 shadow-[0_20px_60px_rgba(249,115,22,0.12)]"
            )}
            key={plan.id}
          >
            <PricingCard.Header>
              <PricingCard.Plan>
                <PricingCard.PlanName>
                  <Server />
                  <span className="text-muted-foreground">{plan.name}</span>
                </PricingCard.PlanName>
                {(plan.badge || plan.is_featured) && (
                  <PricingCard.Badge>{plan.badge || (isId ? "Populer" : "Popular")}</PricingCard.Badge>
                )}
              </PricingCard.Plan>
              <PricingCard.Price>
                <PricingCard.MainPrice>{price}</PricingCard.MainPrice>
                <PricingCard.Period>{period}</PricingCard.Period>
                {original && (
                  <PricingCard.OriginalPrice className="ml-auto">{original}</PricingCard.OriginalPrice>
                )}
              </PricingCard.Price>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>
                  {plan.vcpu} vCPU · {plan.ram_gb} GB RAM · {plan.storage_gb} GB {plan.storage_type}
                </div>
                <div>
                  {plan.bandwidth_tb} TB traffic · {plan.region}
                </div>
              </div>
              <Link
                href={ctaHref}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/80"
                )}
              >
                {plan.cta_label || (isId ? "Pilih paket" : "Choose plan")}
              </Link>
            </PricingCard.Header>

            <PricingCard.Body>
              {description && (
                <PricingCard.Description>{description}</PricingCard.Description>
              )}
              {features.length > 0 && (
                <>
                  <PricingCard.Separator>{isId ? "Termasuk" : "Included"}</PricingCard.Separator>
                  <PricingCard.List>
                    {features.map((item) => (
                      <PricingCard.ListItem key={item}>
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </PricingCard.ListItem>
                    ))}
                  </PricingCard.List>
                </>
              )}
            </PricingCard.Body>
          </PricingCard.Card>
        );
      })}
    </div>
  );
}
