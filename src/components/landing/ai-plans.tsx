import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import * as PricingCard from "@/components/ui/pricing-card";
import {
  CheckCircle2,
  Sparkles,
  Zap,
  Building,
  FlaskConical,
} from "lucide-react";
import type { AiPlan } from "@/types/landing";
import { portalUrl, type Locale } from "@/lib/site";

interface AiPlansProps {
  plans: AiPlan[];
  locale?: Locale;
}

function formatNumber(num: number | null | undefined): string {
  if (num == null) return "Unlimited";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toString();
}

function creditsLabel(plan: AiPlan, isId: boolean): string {
  if (plan.plan_type === "unlimited") {
    return isId ? "Kredit tak terbatas" : "Unlimited credits";
  }
  // Pay-as-you-go has no monthly allowance: the customer tops up and the credits
  // stay until spent, so quoting a "/month" quota would misdescribe it.
  if (plan.plan_type === "pay_as_you_go") {
    const start = plan.credit_quota ?? 0;
    if (start > 0) {
      return isId
        ? `${formatNumber(start)} kredit awal · top-up kapan saja`
        : `${formatNumber(start)} starting credits · top up any time`;
    }
    return isId ? "Top-up kapan saja" : "Top up any time";
  }
  const quota = plan.credit_quota ?? 0;
  if (quota <= 0) {
    return isId ? "Kuota sesuai permintaan" : "Custom quota";
  }
  const suffix = plan.duration_days === 30 ? (isId ? "/bulan" : "/month") : "";
  return `${formatNumber(quota)} credits${suffix}`;
}

function formatPrice(plan: AiPlan, isId: boolean): {
  price: string;
  original?: string;
  period: string;
  discountLabel?: string;
} {
  const idrPrice = plan.prices.find((p) => p.currency_code === "IDR");
  const usdPrice = plan.prices.find((p) => p.currency_code === "USD");
  const firstPrice = plan.prices[0];
  const target = idrPrice ?? usdPrice ?? firstPrice;

  if (!target) return { price: plan.is_trial ? "Free" : "Custom", period: "" };
  if (target.price === 0 && plan.is_trial)
    return { price: "Free", period: "" };

  // Pay-as-you-go is not bought up front: the customer tops up later, so the
  // monthly figure would read as "Rp 0 /0d". Say what it actually costs.
  if (plan.plan_type === "pay_as_you_go") {
    return { price: isId ? "Gratis" : "Free", period: "" };
  }

  const money = (amount: number) =>
    new Intl.NumberFormat(target.currency_code === "IDR" ? "id-ID" : "en-US", {
      style: "currency",
      currency: target.currency_code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  // A plan with an active automatic discount is charged less than the list
  // price. Showing only the list price hid the promotion — and showing only the
  // discounted price would hide the saving — so both are returned.
  const period = plan.duration_days === 30 ? "/month" : `/${plan.duration_days}d`;

  if (plan.effective_price != null && plan.effective_price < target.price) {
    return {
      price: money(plan.effective_price),
      original: money(target.price),
      period,
      discountLabel: plan.discount_label
        ? // The rule's own name may already carry the percentage — the live rule is
          // named "Promo Starter 20%", and appending the figure again rendered
          // "Promo Starter 20% −20%", which reads as a typo. Only add it when the name
          // does not already state it.
          /%/.test(plan.discount_label)
          ? plan.discount_label
          : `${plan.discount_label} −${plan.discount_percent ?? 0}%`
        : `−${plan.discount_percent ?? 0}%`,
    };
  }

  return { price: money(target.price), period };
}

const planIcons: Record<number, React.ReactNode> = {
  0: <FlaskConical />,
  1: <Zap />,
  2: <Sparkles />,
  3: <Building />,
};

export function AiPlanCards({ plans, locale = "id" }: AiPlansProps) {
  const isId = locale === "id";

  // No hardcoded fallback. This component used to fall back to an invented
  // catalogue ("Developer" at Rp 99,000, "Business" at Rp 499,000) when the API
  // failed, so a blip showed plans that cannot be bought at prices three times
  // below the real ones. Better to say the prices are unavailable.
  if (plans.length === 0) {
    return (
      <div className="rounded-xl border bg-background/70 p-12 text-center text-muted-foreground">
        {isId
          ? "Harga paket sedang tidak dapat dimuat. Silakan muat ulang halaman."
          : "Plan pricing is temporarily unavailable. Please reload the page."}
      </div>
    );
  }

  return (
    // Three per row, deliberately. The column count used to follow the number of
    // plans (five across for six plans), which put five cards in one row and the
    // sixth stranded alone below — and made each card too narrow to read its feature
    // list. Three keeps the rows even at six and eight plans and gives each card room.
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, idx) => {
            const { price, original, period, discountLabel } = formatPrice(plan, isId);
            // Locale-specific copy. `description` is Indonesian and
            // `description_en` English (the split `vps_plans` uses); falling
            // back to the other keeps a card readable when one is missing.
            const description = isId
              ? plan.description ?? plan.description_en ?? ""
              : plan.description_en ?? plan.description ?? "";
            const featureList = isId
              ? plan.features ?? plan.features_en ?? []
              : plan.features_en ?? plan.features ?? [];
            const badgeText = plan.is_featured
              ? isId ? "Rekomendasi" : "Recommended"
              : plan.is_trial
              ? isId ? "Uji Coba" : "Free Trial"
              : undefined;
            const ctaLabel = plan.is_trial
              ? isId ? "Mulai Uji Coba" : "Start Free Trial"
              : plan.prices.length === 0
              ? isId ? "Hubungi Sales" : "Contact Sales"
              : isId ? "Mulai" : "Get Started";

            // ── The figure a buyer compares ───────────────────────────────────────
            // This card listed six technical limits (rpm, tpm, concurrency, model
            // count, overage behaviour, validity) and never stated the price per
            // token — the one number that makes two plans comparable. The allowance
            // and the rate now lead; the limits move below.
            const idr = plan.prices.find((p) => p.currency_code === "IDR") ?? plan.prices[0];
            const planPrice = idr?.price ?? 0;
            const allowance =
              plan.plan_type === "unlimited" ? null : plan.token_quota ?? 0;
            const perMillion =
              allowance && allowance > 0 && planPrice > 0
                ? (planPrice / allowance) * 1_000_000
                : null;
            const money = (amount: number) =>
              new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: idr?.currency_code ?? "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(amount);

            return (
              <PricingCard.Card
                className={cn(
                  "md:min-w-[220px]",
                  plan.is_featured &&
                    "border-orange-500/50 shadow-[0_20px_60px_rgba(249,115,22,0.12)]"
                )}
                key={plan.id}
              >
                <PricingCard.Header>
                  <PricingCard.Plan>
                    <PricingCard.PlanName>
                      {planIcons[idx] || <Zap />}
                      <span className="text-muted-foreground">{plan.name}</span>
                    </PricingCard.PlanName>
                    {badgeText && (
                      <PricingCard.Badge>{badgeText}</PricingCard.Badge>
                    )}
                  </PricingCard.Plan>
                  <PricingCard.Price className="flex-wrap">
                    {/* The price and the period share a line that can run out of
                        room in a five-column grid, which clipped the last digit
                        of "Rp 1.500.000". Letting the row wrap keeps the figure
                        whole, and the size steps down at narrow widths. */}
                    <PricingCard.MainPrice className="text-2xl sm:text-3xl lg:text-[26px] xl:text-3xl whitespace-nowrap">
                      {price}
                    </PricingCard.MainPrice>
                    <PricingCard.Period className="whitespace-nowrap">{period}</PricingCard.Period>
                    {original && (
                      <PricingCard.OriginalPrice className="ml-auto whitespace-nowrap">
                        {original}
                      </PricingCard.OriginalPrice>
                    )}
                  </PricingCard.Price>

                  {/* Active promotion, so the saving is visible rather than
                      discovered at checkout.

                      The slot is reserved even when there is no promotion. Only a
                      discounted plan has this line, and without the reservation every
                      card below it shifts: measured, the "Rincian teknis" link sat 32px
                      lower on the one discounted card than on the other five — the exact
                      misalignment a row of comparable cards must not have. */}
                  <div className="flex min-h-[20px] items-center">
                    {discountLabel && (
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {discountLabel}
                      </p>
                    )}
                  </div>

                  {/* ── What one million tokens costs ─────────────────────────────
                      The one figure that makes two plans comparable, and it was
                      missing entirely while six rate limits were listed.

                      The slot is reserved even when a plan has no rate (Free, PAYG,
                      Enterprise), because otherwise everything below it shifts: measured,
                      the "Rincian teknis" link sat at 132px on the cards without a rate
                      and 212px on the one with it, so the row could not be scanned down
                      a column. A fixed-height slot costs nothing and lines them up. */}
                  <div className="mt-2 flex min-h-[26px] items-center">
                    {perMillion !== null && (
                      <p className="inline-flex w-fit items-center rounded-md bg-muted px-2 py-1 text-xs font-medium tabular-nums">
                        {money(perMillion)}{" "}
                        {isId ? "per 1 juta token" : "per 1M tokens"}
                      </p>
                    )}
                  </div>

                  {/* ── Reference detail, folded away ─────────────────────────────
                      Real and sometimes needed, but six of them above the fold is
                      what made these cards hard to compare. A native <details>
                      keeps them one click away with no state and no JavaScript. */}
                  <details className="mt-3 text-xs text-muted-foreground [&_summary]:cursor-pointer">
                    <summary className="hover:text-foreground">
                      {isId ? "Rincian teknis" : "Technical details"}
                    </summary>
                    <div className="mt-2 space-y-1">
                      <div>{creditsLabel(plan, isId)}</div>
                      <div>
                        {plan.rate_limit_rpm} {isId ? "req/menit" : "req/min"} ·{" "}
                        {plan.rate_limit_tpm >= 1_000_000
                          ? `${(plan.rate_limit_tpm / 1_000_000).toFixed(1)}M`
                          : `${Math.round(plan.rate_limit_tpm / 1000)}K`}{" "}
                        {isId ? "token/menit" : "tokens/min"}
                      </div>
                      <div>
                        {isId
                          ? `${plan.max_concurrent_requests} permintaan bersamaan`
                          : `${plan.max_concurrent_requests} concurrent requests`}
                      </div>
                      <div>
                        {plan.allowed_models_count != null
                          ? isId
                            ? `${plan.allowed_models_count} model tersedia`
                            : `${plan.allowed_models_count} models included`
                          : isId
                            ? "Semua model"
                            : "All models"}
                      </div>
                      <div>
                        {plan.overage_policy === "block"
                          ? isId
                            ? "Berhenti saat kuota habis"
                            : "Stops at quota"
                          : isId
                            ? "Lanjut, kelebihan ditagih"
                            : "Continues, overage billed"}
                      </div>
                      {plan.is_trial && plan.trial_duration_days ? (
                        <div>
                          {isId
                            ? `Berlaku ${plan.trial_duration_days} hari`
                            : `Valid ${plan.trial_duration_days} days`}
                        </div>
                      ) : null}
                    </div>
                  </details>

                  <Link
                    href={`${portalUrl}/register?plan=${encodeURIComponent(plan.slug)}`}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/80"
                    )}
                  >
                    {ctaLabel}
                  </Link>
                </PricingCard.Header>

                <PricingCard.Body>
                  <PricingCard.Description>{description}</PricingCard.Description>
                  {/* The separator only makes sense with a list under it;
                      rendering it unconditionally left every card ending in a
                      bare "Plan features" heading. */}
                  {featureList.length > 0 && (
                    <>
                      <PricingCard.Separator>
                        {isId ? "Fitur paket" : "Plan features"}
                      </PricingCard.Separator>
                      <PricingCard.List>
                        {featureList.map((feature, fidx) => (
                          <PricingCard.ListItem key={fidx}>
                            <CheckCircle2
                              className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                              aria-hidden="true"
                            />
                            <span>
                              {typeof feature === "string"
                                ? feature
                                : String(feature)}
                            </span>
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
