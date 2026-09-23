import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { copy, localizedPath, type Locale } from "@/lib/site";
import type { AiModel } from "@/types/landing";

// --- SVG Icons for AI Model Integrations ---

const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

// --- Component ---

const IntegrationCard = ({
  children,
  className,
  isCenter = false,
}: {
  children: React.ReactNode;
  className?: string;
  isCenter?: boolean;
}) => {
  return (
    <div
      className={cn(
        "relative z-30 flex size-12 rounded-full border bg-white shadow-sm shadow-black/5 dark:bg-white/5 dark:backdrop-blur-md",
        className
      )}
    >
      <div className={cn("m-auto size-fit *:size-5", isCenter && "*:size-8")}>
        {children}
      </div>
    </div>
  );
};

export function IntegrationsSection({
  locale,
  models = [],
  /**
   * Renders without the outer `<section>` and its vertical padding, for placing inside a
   * grid beside another block. The caller owns the section and the spacing then.
   */
  embedded = false,
}: {
  locale: Locale;
  models?: AiModel[];
  embedded?: boolean;
}) {
  const t = copy[locale].integrations;
  const providers = React.useMemo(() => {
    const map = new Map<string, { name: string; slug: string; logo: string | null }>();
    for (const model of models) {
      // Skip unnamed upstreams. Their slug is null, and grouping by it would
      // collapse every provider into one anonymous entry — the section falls
      // back to the public brand list below instead.
      if (!model.provider_slug || !model.provider_name) continue;
      if (!map.has(model.provider_slug)) {
        map.set(model.provider_slug, {
          name: model.provider_name,
          slug: model.provider_slug,
          logo: model.provider_logo_url,
        });
      }
    }
    return [...map.values()].slice(0, 6);
  }, [models]);

  const fallback = [
    { name: "OpenAI", slug: "openai", logo: null },
    { name: "Anthropic", slug: "anthropic", logo: null },
    { name: "Google", slug: "google", logo: null },
    { name: "Meta", slug: "meta", logo: null },
    { name: "Mistral AI", slug: "mistral", logo: null },
  ];
  const items = providers.length >= 3 ? providers : fallback;
  const center = items[0];

  return (
    <section id="integrations">
      <div className={cn(embedded ? "" : "py-24 md:py-32")}>
        <div className={cn("mx-auto", embedded ? "" : "max-w-5xl px-6")}>
          <div className="aspect-16/10 group relative mx-auto flex max-w-[22rem] items-center justify-between sm:max-w-sm">
            <div
              role="presentation"
              className="bg-linear-to-b border-foreground/5 absolute inset-0 z-10 aspect-square animate-spin items-center justify-center rounded-full border-t from-lime-500/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100 dark:from-white/5"
            />
            <div
              role="presentation"
              className="bg-linear-to-b border-foreground/5 absolute inset-16 z-10 aspect-square scale-90 animate-spin items-center justify-center rounded-full border-t from-blue-500/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100"
            />
            <div className="bg-linear-to-b from-muted-foreground/15 absolute inset-0 flex aspect-square items-center justify-center rounded-full border-t to-transparent to-25%">
              {items.slice(1, 4).map((provider, index) => (
                <IntegrationCard
                  key={provider.slug}
                  className={cn(
                    index === 0 && "-translate-x-1/6 absolute left-0 top-1/4 -translate-y-1/4",
                    index === 1 && "absolute top-0 -translate-y-1/2",
                    index === 2 && "translate-x-1/6 absolute right-0 top-1/4 -translate-y-1/4"
                  )}
                >
                  <ProviderGlyph provider={provider} />
                </IntegrationCard>
              ))}
            </div>
            <div className="bg-linear-to-b from-muted-foreground/15 absolute inset-16 flex aspect-square scale-90 items-center justify-center rounded-full border-t to-transparent to-25%">
              {items.slice(4, 7).map((provider, index) => (
                <IntegrationCard
                  key={provider.slug}
                  className={cn(
                    index === 0 && "absolute top-0 -translate-y-1/2",
                    index === 1 && "absolute left-0 top-1/4 -translate-x-1/4 -translate-y-1/4",
                    index === 2 && "absolute right-0 top-1/4 -translate-y-1/4 translate-x-1/4"
                  )}
                >
                  <ProviderGlyph provider={provider} />
                </IntegrationCard>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 mx-auto my-2 flex w-fit justify-center gap-2">
              <div className="bg-muted relative z-20 rounded-full border p-1">
                <IntegrationCard
                  className="shadow-black-950/10 dark:bg-background size-16 border-black/20 shadow-xl dark:border-white/25 dark:shadow-white/15"
                  isCenter={true}
                >
                  {center?.logo ? (
                    <Image
                      src={center.logo}
                      alt={center.name}
                      width={32}
                      height={32}
                      className="size-8 object-contain"
                    />
                  ) : (
                    <LogoIcon className="text-primary" />
                  )}
                </IntegrationCard>
              </div>
            </div>
          </div>
          <div className="bg-linear-to-t from-background relative z-20 mx-auto mt-12 max-w-lg space-y-6 from-55% text-center">
            <h2 className="type-h2">
              {t.title}
            </h2>
            <p className="text-muted-foreground">
              {t.description}
            </p>
            <Link
              href={localizedPath(locale, "/models")}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {t.action}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProviderGlyph({ provider }: { provider: { name: string; logo: string | null } }) {
  if (provider.logo) {
    return (
      <Image
        src={provider.logo}
        alt={provider.name}
        width={20}
        height={20}
        className="size-5 object-contain"
      />
    );
  }
  const label = provider.name
    .split(/[\s.-]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return <span className="provider-glyph">{label}</span>;
}
