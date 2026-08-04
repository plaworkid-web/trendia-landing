import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import * as PricingCard from "@/components/ui/pricing-card";
import {
  CheckCircle2,
  Server,
  Rocket,
  Building,
  Settings,
} from "lucide-react";
import { contactUrl, type Locale } from "@/lib/site";

interface VpsPlan {
  icon: React.ReactNode;
  name: string;
  description: string;
  price: string;
  original?: string;
  period: string;
  features: string[];
  lockedFeatures: string[];
  badge?: string;
  variant: "default" | "outline";
  ctaHref: string;
  ctaText: string;
}

const plans: VpsPlan[] = [
  {
    icon: <Server />,
    name: "Starter VPS",
    description: "Perfect for personal projects and small applications.",
    price: "Rp 50.000",
    period: "/month",
    variant: "outline",
    ctaHref: "/register",
    ctaText: "Get Started",
    features: [
      "1 vCPU Core",
      "1 GB RAM",
      "20 GB NVMe SSD",
      "1 TB Bandwidth",
      "1 IPv4 Address",
      "Basic DDoS Protection",
      "24/7 Monitoring",
    ],
    lockedFeatures: ["Daily Auto Backup", "Dedicated Support", "GPU Support"],
  },
  {
    icon: <Rocket />,
    name: "Business VPS",
    description: "Ideal for growing businesses and production apps.",
    price: "Rp 150.000",
    original: "Rp 200.000",
    period: "/month",
    badge: "Popular",
    variant: "default",
    ctaHref: "/register",
    ctaText: "Get Started",
    features: [
      "2 vCPU Cores",
      "4 GB RAM",
      "80 GB NVMe SSD",
      "4 TB Bandwidth",
      "1 IPv4 Address",
      "Advanced DDoS Protection",
      "Priority Support",
      "Auto Backup Daily",
    ],
    lockedFeatures: ["Dedicated Support", "GPU Support"],
  },
  {
    icon: <Building />,
    name: "Enterprise VPS",
    description: "For demanding workloads and mission-critical apps.",
    price: "Rp 350.000",
    original: "Rp 450.000",
    period: "/month",
    variant: "outline",
    ctaHref: "/register",
    ctaText: "Get Started",
    features: [
      "4 vCPU Cores",
      "8 GB RAM",
      "160 GB NVMe SSD",
      "8 TB Bandwidth",
      "2 IPv4 Addresses",
      "Premium DDoS Protection",
      "Dedicated Support",
      "Auto Backup + Snapshot",
      "Pre-installed AI Tools",
    ],
    lockedFeatures: ["Dedicated GPU", "Personal Account Manager"],
  },
  {
    icon: <Settings />,
    name: "Custom VPS",
    description: "Tailored solutions for enterprise needs.",
    price: "Custom",
    period: "",
    variant: "outline",
    ctaHref: "/contact",
    ctaText: "Contact Sales",
    features: [
      "Fully Customizable Specs",
      "Dedicated Resources",
      "Custom Networking",
      "SLA Guarantee",
      "Personal Account Manager",
      "GPU Support Available",
    ],
    lockedFeatures: [],
  },
];

export function VpsPlanCards({ locale = "id" }: { locale?: Locale }) {
  const isId = locale === "id";
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <PricingCard.Card
              className={cn(
                "md:min-w-[220px]",
                plan.badge && "border-orange-500/50 shadow-[0_20px_60px_rgba(249,115,22,0.12)]"
              )}
              key={plan.name}
            >
              <PricingCard.Header>
                <PricingCard.Plan>
                  <PricingCard.PlanName>
                    {plan.icon}
                    <span className="text-muted-foreground">{plan.name}</span>
                  </PricingCard.PlanName>
                  {plan.badge && (
                    <PricingCard.Badge>{plan.badge}</PricingCard.Badge>
                  )}
                </PricingCard.Plan>
                <PricingCard.Price>
                  <PricingCard.MainPrice>{plan.price}</PricingCard.MainPrice>
                  <PricingCard.Period>{plan.period}</PricingCard.Period>
                  {plan.original && (
                    <PricingCard.OriginalPrice className="ml-auto">
                      {plan.original}
                    </PricingCard.OriginalPrice>
                  )}
                </PricingCard.Price>
                <Link
                  href={contactUrl}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/80"
                  )}
                >
                    {isId ? "Hubungi Sales" : plan.ctaText}
                </Link>
              </PricingCard.Header>

              <PricingCard.Body>
                <PricingCard.Description>
                  {plan.description}
                </PricingCard.Description>
                <PricingCard.Separator>Included</PricingCard.Separator>
                <PricingCard.List>
                  {plan.features.map((item) => (
                    <PricingCard.ListItem key={item}>
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </PricingCard.ListItem>
                  ))}
                </PricingCard.List>
                {plan.lockedFeatures.length > 0 && (
                  <>
                    <PricingCard.Separator>Higher-tier features</PricingCard.Separator>
                    <PricingCard.List>
                      {plan.lockedFeatures.map((item) => (
                        <PricingCard.ListItem className="opacity-60" key={item}>
                          <span className="mt-0.5 size-4 shrink-0 text-center text-destructive">
                            ×
                          </span>
                          <span>{item}</span>
                        </PricingCard.ListItem>
                      ))}
                    </PricingCard.List>
                  </>
                )}
              </PricingCard.Body>
            </PricingCard.Card>
          ))}
    </div>
  );
}
