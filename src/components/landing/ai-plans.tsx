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

interface AiPlansProps {
  plans: AiPlan[];
}

function formatNumber(num: number | null | undefined): string {
  if (num == null) return "Unlimited";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toString();
}

function formatPrice(plan: AiPlan): {
  price: string;
  original?: string;
  period: string;
} {
  const idrPrice = plan.prices.find((p) => p.currency_code === "IDR");
  const usdPrice = plan.prices.find((p) => p.currency_code === "USD");
  const firstPrice = plan.prices[0];
  const target = idrPrice ?? usdPrice ?? firstPrice;

  if (!target) return { price: plan.is_trial ? "Free" : "Custom", period: "" };
  if (target.price === 0 && plan.is_trial)
    return { price: "Free", period: "" };

  const formatted = new Intl.NumberFormat(
    target.currency_code === "IDR" ? "id-ID" : "en-US",
    {
      style: "currency",
      currency: target.currency_code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  ).format(target.price);

  return {
    price: formatted,
    period: plan.duration_days === 30 ? "/month" : `/${plan.duration_days}d`,
  };
}

const planIcons: Record<number, React.ReactNode> = {
  0: <FlaskConical />,
  1: <Zap />,
  2: <Sparkles />,
  3: <Building />,
};

const fallbackPlans: AiPlan[] = [
  {
    id: "1",
    name: "Free Trial",
    slug: "free-trial",
    description: "Try our AI API with free credits. No credit card required.",
    plan_type: "trial",
    token_quota: null,
    credit_quota: 100,
    trial_credits: 100,
    duration_days: 30,
    rate_limit_rpm: 10,
    rate_limit_tpm: 10000,
    max_concurrent_requests: 2,
    overage_policy: "block",
    is_featured: false,
    is_trial: true,
    trial_duration_days: 14,
    sort_order: 0,
    features: [
      "100 free credits",
      "Access to all models",
      "10 requests/min",
      "Community support",
    ],
    prices: [],
  },
  {
    id: "2",
    name: "Developer",
    slug: "developer",
    description: "For individual developers and small projects.",
    plan_type: "subscription",
    token_quota: null,
    credit_quota: 5000,
    trial_credits: null,
    duration_days: 30,
    rate_limit_rpm: 60,
    rate_limit_tpm: 100000,
    max_concurrent_requests: 5,
    overage_policy: "block",
    is_featured: false,
    is_trial: false,
    trial_duration_days: null,
    sort_order: 1,
    features: [
      "5,000 credits/month",
      "All AI models",
      "60 requests/min",
      "Email support",
      "Usage analytics",
    ],
    prices: [
      {
        id: "p1",
        currency_code: "IDR",
        price: 99000,
        setup_fee: 0,
        overage_price_per_1m: null,
      },
    ],
  },
  {
    id: "3",
    name: "Business",
    slug: "business",
    description: "For teams and growing businesses.",
    plan_type: "subscription",
    token_quota: null,
    credit_quota: 50000,
    trial_credits: null,
    duration_days: 30,
    rate_limit_rpm: 300,
    rate_limit_tpm: 1000000,
    max_concurrent_requests: 20,
    overage_policy: "charge",
    is_featured: true,
    is_trial: false,
    trial_duration_days: null,
    sort_order: 2,
    features: [
      "50,000 credits/month",
      "All AI models",
      "300 requests/min",
      "Priority support",
      "Advanced analytics",
      "Overage billing",
    ],
    prices: [
      {
        id: "p2",
        currency_code: "IDR",
        price: 499000,
        setup_fee: 0,
        overage_price_per_1m: null,
      },
    ],
  },
  {
    id: "4",
    name: "Enterprise",
    slug: "enterprise",
    description: "Custom solutions for large-scale operations.",
    plan_type: "enterprise",
    token_quota: null,
    credit_quota: null,
    trial_credits: null,
    duration_days: 30,
    rate_limit_rpm: 1000,
    rate_limit_tpm: 10000000,
    max_concurrent_requests: 100,
    overage_policy: "charge",
    is_featured: false,
    is_trial: false,
    trial_duration_days: null,
    sort_order: 3,
    features: [
      "Unlimited credits",
      "All AI models",
      "Custom rate limits",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
    ],
    prices: [],
  },
];

export function AiPlans({ plans }: AiPlansProps) {
  const items = plans.length > 0 ? plans : fallbackPlans;

  return (
    <section id="ai-plans" className="relative overflow-hidden py-20 sm:py-28">
      {/* Subtle dotted grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(128,128,128,0.08) 0.8px, transparent 0.8px)",
          backgroundSize: "14px 14px",
          maskImage:
            "radial-gradient(circle at 50% 90%, rgba(0,0,0,1), rgba(0,0,0,0.2) 40%, rgba(0,0,0,0) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            AI API Platform
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Access World-Class AI Models via API
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            One API key, multiple models. Pay only for what you use with flexible
            credit-based pricing.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((plan, idx) => {
            const { price, original, period } = formatPrice(plan);
            const badgeText = plan.is_featured
              ? "Recommended"
              : plan.is_trial
              ? "Free Trial"
              : undefined;
            const variant = plan.is_featured ? "default" : "outline";
            const ctaLabel = plan.is_trial
              ? "Start Free Trial"
              : plan.prices.length === 0
              ? "Contact Sales"
              : "Get Started";

            return (
              <PricingCard.Card className="md:min-w-[220px]" key={plan.id}>
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
                  <PricingCard.Price>
                    <PricingCard.MainPrice>{price}</PricingCard.MainPrice>
                    <PricingCard.Period>{period}</PricingCard.Period>
                    {original && (
                      <PricingCard.OriginalPrice className="ml-auto">
                        {original}
                      </PricingCard.OriginalPrice>
                    )}
                  </PricingCard.Price>

                  {/* Credits & Rate info */}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>
                      {plan.credit_quota != null
                        ? `${formatNumber(plan.credit_quota)} credits${plan.duration_days === 30 ? "/month" : ""}`
                        : "Unlimited credits"}
                    </div>
                    <div>{plan.rate_limit_rpm} requests/min</div>
                  </div>

                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({ variant }),
                      "w-full font-semibold"
                    )}
                  >
                    {ctaLabel}
                  </Link>
                </PricingCard.Header>

                <PricingCard.Body>
                  <PricingCard.Description>
                    {plan.description}
                  </PricingCard.Description>
                  {plan.features && plan.features.length > 0 && (
                    <PricingCard.List>
                      {plan.features.map((feature, fidx) => (
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
                  )}
                </PricingCard.Body>
              </PricingCard.Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
