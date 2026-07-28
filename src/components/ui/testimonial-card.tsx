"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3 && rating - full < 0.8;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < full
              ? "fill-yellow-400 text-yellow-400"
              : i === full && hasHalf
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-muted-foreground/30"
          )}
        />
      ))}
      <span className="ml-1.5 text-xs font-medium text-muted-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function TestimonialCardItem({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        {testimonial.avatarSrc ? (
          <Image
            src={testimonial.avatarSrc}
            alt={testimonial.name}
            width={44}
            height={44}
            className="size-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {testimonial.avatarFallback}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{testimonial.name}</div>
          <div className="truncate text-xs text-muted-foreground">
            {testimonial.title}
          </div>
        </div>
      </div>
      <StarRating rating={testimonial.rating} />
      <p className="text-sm leading-relaxed text-muted-foreground">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
    </article>
  );
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
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              {description && (
                <p className="max-w-md text-base text-muted-foreground sm:text-lg">
                  {description}
                </p>
              )}
            </div>

            {stats.length > 0 && (
              <div className="grid grid-cols-3 gap-4 border-y border-border py-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <div className="text-2xl font-bold tracking-tight sm:text-3xl">
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

          {/* Right column — testimonial cards grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {testimonials.map((t, i) => (
              <div
                key={`${t.name}-${i}`}
                className={cn(i === 1 && "sm:mt-8", i === 2 && "sm:col-span-2 sm:max-w-md sm:mx-auto")}
              >
                <TestimonialCardItem testimonial={t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
