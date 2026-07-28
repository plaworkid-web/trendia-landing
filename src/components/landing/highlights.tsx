import Image from "next/image";
import {
  Server,
  Shield,
  Zap,
  Globe,
  Brain,
  CreditCard,
  Check,
} from "lucide-react";
import type { Highlight } from "@/types/landing";

interface HighlightsProps {
  highlights: Highlight[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  server: Server,
  shield: Shield,
  zap: Zap,
  globe: Globe,
  brain: Brain,
  creditcard: CreditCard,
  check: Check,
};

const fallbackHighlights: Highlight[] = [
  {
    id: "1",
    title: "Lightning-Fast VPS",
    subtitle: "Enterprise-grade virtual servers powered by NVMe SSD storage",
    body_text:
      "Get dedicated resources with guaranteed performance. Our infrastructure runs on the latest AMD EPYC processors with NVMe storage for maximum throughput.",
    image_url: null,
    image_position: "right",
    points: [
      {
        icon: "zap",
        title: "NVMe SSD Storage",
        description: "Up to 7GB/s read speeds for your applications",
      },
      {
        icon: "shield",
        title: "DDoS Protection",
        description: "Enterprise-grade protection included with every plan",
      },
      {
        icon: "globe",
        title: "Global Network",
        description: "Low-latency connectivity across multiple regions",
      },
    ],
    sort_order: 0,
  },
  {
    id: "2",
    title: "Unified AI API Platform",
    subtitle: "Access world-class AI models through a single API endpoint",
    body_text:
      "One API key for GPT-4, Claude, Gemini, Llama, and more. Credit-based pricing with no minimum commitment.",
    image_url: null,
    image_position: "left",
    points: [
      {
        icon: "brain",
        title: "Multiple Models",
        description: "GPT-4, Claude, Gemini, Llama, Mistral, and more",
      },
      {
        icon: "creditcard",
        title: "Pay Per Use",
        description: "Flexible credit-based pricing, start free",
      },
      {
        icon: "zap",
        title: "Real-time Analytics",
        description: "Monitor usage, costs, and performance live",
      },
    ],
    sort_order: 1,
  },
  {
    id: "3",
    title: "AI-Optimized VPS",
    subtitle: "Pre-configured virtual servers ready for AI workloads",
    body_text:
      "Deploy VPS instances pre-installed with PyTorch, TensorFlow, Ollama, and popular AI frameworks. GPU support available on request.",
    image_url: null,
    image_position: "right",
    points: [
      {
        icon: "server",
        title: "Pre-installed Frameworks",
        description: "PyTorch, TensorFlow, Ollama ready to go",
      },
      {
        icon: "zap",
        title: "GPU Support",
        description: "NVIDIA GPU acceleration available on request",
      },
      {
        icon: "shield",
        title: "Managed Updates",
        description: "Automatic security patches and framework updates",
      },
    ],
    sort_order: 2,
  },
];

export function Highlights({ highlights }: HighlightsProps) {
  const items = highlights.length > 0 ? highlights : fallbackHighlights;

  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Why Choose Us
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Build, Deploy, and Scale
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From raw compute power to intelligent AI endpoints — all managed from
            one dashboard.
          </p>
        </div>

        {/* Highlights */}
        <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-28">
          {items.map((highlight, idx) => (
            <div
              key={highlight.id}
              className={`flex flex-col items-center gap-10 lg:flex-row lg:gap-16 ${
                highlight.image_position === "left" ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Text content */}
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {highlight.title}
                  </h3>
                  {highlight.subtitle && (
                    <p className="mt-2 text-lg text-muted-foreground">
                      {highlight.subtitle}
                    </p>
                  )}
                </div>
                {highlight.body_text && (
                  <p className="text-muted-foreground leading-relaxed">
                    {highlight.body_text}
                  </p>
                )}
                {highlight.points && highlight.points.length > 0 && (
                  <ul className="space-y-4">
                    {highlight.points.map((point, pidx) => {
                      const IconComponent =
                        iconMap[point.icon.toLowerCase()] || Check;
                      return (
                        <li key={pidx} className="flex gap-3">
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <IconComponent className="size-3.5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{point.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {point.description}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Image or placeholder */}
              <div className="flex-1">
                {highlight.image_url ? (
                  <Image
                    src={highlight.image_url}
                    alt={highlight.title}
                    width={600}
                    height={400}
                    className="rounded-xl border border-border shadow-lg"
                  />
                ) : (
                  <div className="flex aspect-[3/2] items-center justify-center rounded-xl border border-border bg-muted/50">
                    <div className="text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                        {idx === 0 && <Server className="size-8 text-primary" />}
                        {idx === 1 && <Brain className="size-8 text-primary" />}
                        {idx === 2 && <Zap className="size-8 text-primary" />}
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground">
                        {highlight.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
