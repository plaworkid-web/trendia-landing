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

interface VpsPlan {
  icon: React.ReactNode;
  name: string;
  description: string;
  price: string;
  original?: string;
  period: string;
  features: string[];
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
  },
];

export function VpsPlans() {
  return (
    <section id="vps-plans" className="relative overflow-hidden bg-muted/30 py-20 sm:py-28">
      {/* Subtle dotted grid */}
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            VPS Hosting
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Virtual Private Servers Built for Speed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Enterprise-grade infrastructure with NVMe SSD, dedicated resources, and
            99.9% uptime guarantee.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <PricingCard.Card className="md:min-w-[220px]" key={plan.name}>
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
                  href={plan.ctaHref}
                  className={cn(
                    buttonVariants({ variant: plan.variant }),
                    "w-full font-semibold"
                  )}
                >
                  {plan.ctaText}
                </Link>
              </PricingCard.Header>

              <PricingCard.Body>
                <PricingCard.Description>
                  {plan.description}
                </PricingCard.Description>
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
              </PricingCard.Body>
            </PricingCard.Card>
          ))}
        </div>
      </div>
    </section>
  );
}
