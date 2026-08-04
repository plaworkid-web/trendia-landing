"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface PreviewTab {
  id: string;
  label: string;
  media: ReactNode;
}

interface ClientLogo {
  name: string;
  logo: ReactNode;
}

interface PreviewSwitchHeroProps {
  badge?: { tag: string; label: string };
  title: string;
  description: string;
  ratings?: { source: string; score: string }[];
  showEmail?: boolean;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  avatars?: { initials: string }[];
  socialProof?: string;
  tabs: PreviewTab[];
  logos?: ClientLogo[];
}

export function PreviewSwitchHero({
  badge,
  title,
  description,
  ratings = [],
  primaryCta,
  secondaryCta,
  avatars = [],
  socialProof,
  tabs,
  logos = [],
}: PreviewSwitchHeroProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const activeMedia = tabs.find((tab) => tab.id === activeTab)?.media;

  return (
    <section className="relative overflow-hidden border-y bg-background py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(rgba(128,128,128,0.13) 0.8px, transparent 0.8px)",
          backgroundSize: "14px 14px",
          maskImage:
            "radial-gradient(circle at 50% 30%, black, transparent 72%)",
        }}
      />
      <div className="pointer-events-none absolute -top-1/2 left-1/2 size-[100vmin] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
        <div>
          {badge && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 p-1 pr-3 text-sm shadow-sm backdrop-blur">
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                {badge.tag}
              </span>
              <span className="text-muted-foreground">{badge.label}</span>
            </div>
          )}

          <h2 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryCta.href}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 bg-primary px-6 font-semibold text-primary-foreground shadow-[0_10px_25px_rgba(71,8,217,0.3)] hover:bg-primary/80"
              )}
            >
              {primaryCta.label}
              <ArrowRight className="size-4" />
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/80"
                )}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>

          {(avatars.length > 0 || socialProof) && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {avatars.map((avatar, index) => (
                  <span
                    key={`${avatar.initials}-${index}`}
                    className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold"
                  >
                    {avatar.initials}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 text-orange-500">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="size-3.5 fill-current" />
                  ))}
                </div>
                {socialProof && (
                  <p className="mt-1 text-xs text-muted-foreground">{socialProof}</p>
                )}
              </div>
            </div>
          )}

          {ratings.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t pt-5">
              {ratings.map((rating) => (
                <div key={rating.source} className="text-sm">
                  <span className="font-semibold">{rating.score}</span>{" "}
                  <span className="text-muted-foreground">{rating.source}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="mx-auto flex w-full max-w-full justify-start gap-1 overflow-x-auto rounded-full border bg-muted/60 p-1 sm:w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-7 min-h-[360px]">{activeMedia}</div>
        </div>
      </div>

      {logos.length > 0 && (
        <div className="relative mx-auto mt-16 max-w-7xl border-t px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {logos.map((logo) => (
              <div key={logo.name} aria-label={logo.name}>
                {logo.logo}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
