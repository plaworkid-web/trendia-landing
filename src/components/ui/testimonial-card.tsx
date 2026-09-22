"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { TestimonialOrbit } from "@/components/ui/testimonial-orbit";

export interface Stat {
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  title: string;
  quote: string;
  avatarSrc?: string;
  avatarFallback: string;
  rating: number;
}

export interface ClientsSectionProps {
  tagLabel?: string;
  title?: string;
  description?: string;
  stats?: Stat[];
  testimonials?: Testimonial[];
  primaryActionLabel?: string;
  primaryActionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  className?: string;
}

export function ClientsSection({
  tagLabel = "Happy Clients",
  title = "Clients Love Me",
  description = "Trusted by happy clients worldwide.",
  stats = [],
  testimonials = [],
  primaryActionLabel = "Contact Now",
  primaryActionHref = "/contact",
  secondaryActionLabel = "See All Projects",
  secondaryActionHref = "#",
  className,
}: ClientsSectionProps) {
  return (
    <section
      id="testimonials"
      className={cn("relative overflow-hidden py-20 sm:py-28", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column — intro + stats + CTAs */}
          <div className="flex flex-col justify-center space-y-8 lg:sticky lg:top-24">
            <div className="space-y-4">
              {tagLabel && (
                <div className="inline-flex rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {tagLabel}
                </div>
              )}
              <h2 className="type-h2">
                {title}
              </h2>
              {description && (
                <p className="type-lead max-w-md">
                  {description}
                </p>
              )}
            </div>

            {stats.length > 0 && (
              <div className="grid grid-cols-3 gap-4 border-y border-border py-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <div className="type-h3">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {primaryActionLabel && (
                <Link
                  href={primaryActionHref}
                  className={buttonVariants({ variant: "default" })}
                >
                  {primaryActionLabel}
                </Link>
              )}
              {secondaryActionLabel && (
                <Link
                  href={secondaryActionHref}
                  className={buttonVariants({ variant: "outline" })}
                >
                  {secondaryActionLabel}
                </Link>
              )}
            </div>
          </div>

          {/* Vertical orbit: one card per row, travelling top to bottom. */}
          <TestimonialOrbit testimonials={testimonials} />
        </div>
      </div>
    </section>
  );
}
