"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Testimonials as a vertical orbit: one card per row, travelling top to bottom.
 *
 * The cards sit on an invisible vertical wheel. The active card faces the reader; the
 * ones above and below are rotated away from the viewer and pushed back, which is what
 * makes the column read as a ring seen from the side rather than a plain slide. Only one
 * card occupies the centre row at a time.
 *
 * The offset is wrapped to the shortest path around the ring. Without that, going from
 * the last card back to the first would scroll the whole list past the reader instead of
 * moving one position — with six cards that is five cards of movement for a one-step
 * change.
 *
 * Auto-advance stops on hover and on focus, so a reader who is mid-sentence is not
 * moved along, and it never runs at all under `prefers-reduced-motion`.
 */

export interface OrbitTestimonial {
  name: string;
  title: string;
  quote: string;
  avatarSrc?: string;
  avatarFallback: string;
  rating: number;
}

/** Vertical distance between neighbouring cards, in pixels. */
const STEP = 252;
/** Height of the window the wheel turns in. The cards above and below are partly in
 * view on purpose: a column that shows only the active card is a slideshow, not a ring. */
const WINDOW_H = 520;
/** Milliseconds between automatic advances. */
const AUTO_MS = 5200;
/** How long a card takes to travel one position. Long and eased, so the column drifts
 * rather than snaps: at 700ms the move reads as a step, at 1100ms as a turn. */
const SLIDE_MS = 1100;

/** Signed distance from `active`, wrapped to the shortest way around the ring. */
function signedOffset(index: number, active: number, total: number): number {
  let d = index - active;
  const half = total / 2;
  if (d > half) d -= total;
  if (d < -half) d += total;
  return d;
}

function Rating({ value }: { value: number }) {
  const full = Math.floor(value);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} dari 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < full ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}

function Card({ item, active }: { item: OrbitTestimonial; active: boolean }) {
  return (
    <article
      className={cn(
        "flex h-[236px] flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm",
        active && "shadow-md",
      )}
    >
      <div className="flex items-center gap-3">
        {item.avatarSrc ? (
          <Image
            src={item.avatarSrc}
            alt={item.name}
            width={44}
            height={44}
            className="size-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {item.avatarFallback}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{item.name}</div>
          <div className="truncate text-xs text-muted-foreground">{item.title}</div>
        </div>
        <Rating value={item.rating} />
      </div>
      <p className="line-clamp-6 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{item.quote}&rdquo;
      </p>
    </article>
  );
}

export function TestimonialOrbit({
  testimonials,
  className,
}: {
  testimonials: OrbitTestimonial[];
  className?: string;
}) {
  const total = testimonials.length;
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  /** Bumped on every manual move, to restart the auto-advance countdown. */
  const [restartKey, setRestartKey] = React.useState(0);

  const go = React.useCallback(
    (delta: number) => {
      setActive((current) => (current + delta + total) % total);
      // Without this the interval keeps its original schedule, so a reader who clicks
      // "next" can be moved again a moment later by the pending tick - two slides in
      // quick succession, the second one arriving before the first has settled.
      setRestartKey((k) => k + 1);
    },
    [total],
  );

  const jumpTo = React.useCallback((index: number) => {
    setActive(index);
    setRestartKey((k) => k + 1);
  }, []);

  // Auto-advance on a timeout rather than an interval, keyed to `restartKey`: every
  // manual move clears the pending tick and starts a fresh full delay.
  //
  // Skipped entirely when the reader asked for reduced motion: a column that reorders
  // itself on a timer is exactly the kind of movement that setting is for.
  React.useEffect(() => {
    if (total < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setActive((c) => (c + 1) % total), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [total, paused, restartKey, active]);

  if (total === 0) return null;

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Fixed height so the cards above and below can be seen entering and leaving.
          Clipped so they never spill into the sections around it. */}
      <div
        className="relative overflow-hidden"
        style={{ height: WINDOW_H, perspective: "1400px" }}
        aria-live="polite"
        aria-atomic="true"
      >
        {testimonials.map((item, index) => {
          const d = signedOffset(index, active, total);

          const isActive = d === 0;
          const distance = Math.abs(d);

          // Every card stays mounted, including the ones far out of view.
          //
          // Skipping the out-of-view cards (`if (distance > VISIBLE) return null`) is
          // the obvious optimisation and it is wrong: a card that unmounts and later
          // remounts on the far side of the ring appears at its new position instantly,
          // because a CSS transition does not run on an element that was just inserted.
          // The result is a card that jumps into place instead of travelling there.
          // Their opacity is already 0 out there, so the extra nodes cost nothing to
          // paint, and a testimonial list is small.
          return (
            <div
              key={`${item.name}-${index}`}
              className="absolute inset-x-0 top-1/2 motion-reduce:transition-none"
              style={{
                // Only `transform` and `opacity` are transitioned. `transition-all` also
                // catches `z-index`, which is not smoothly interpolable: the browser
                // repaints the whole stack on every frame of the move and the motion
                // stutters. z-index still changes, it just snaps instead of easing.
                transitionProperty: "transform, opacity",
                transitionDuration: `${SLIDE_MS}ms`,
                // Eased at both ends rather than `ease-out`: the wheel should gather pace
                // and settle, not lurch away and coast.
                transitionTimingFunction: "cubic-bezier(0.45, 0.05, 0.25, 1)",
                // `-50%` centres the card on the row; the rest walks it along the wheel.
                //
                // The offset is negated so the ring turns top-to-bottom: advancing brings
                // the next card down from above, rather than lifting it up from below.
                // `d` alone would run the column upward.
                transform: `translateY(calc(-50% + ${-d * STEP}px)) scale(${1 - distance * 0.13}) rotateX(${d * 11}deg)`,
                opacity: Math.max(0, 1 - distance * 0.55),
                zIndex: 20 - distance,
                pointerEvents: isActive ? "auto" : "none",
                // Promote to its own layer so the move is a composite, not a repaint of
                // the column on every frame. Only five cards are mounted, so the memory
                // cost is negligible.
                willChange: "transform, opacity",
              }}
              aria-hidden={!isActive}
            >
              <Card item={item} active={isActive} />
            </div>
          );
        })}
      </div>

      {/* Controls. Kept outside the clipped area so they are always reachable. */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Testimoni sebelumnya"
          className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronUp className="size-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {testimonials.map((item, index) => (
            <button
              key={`${item.name}-dot-${index}`}
              type="button"
              onClick={() => jumpTo(index)}
              aria-label={`Testimoni ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === active ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Testimoni berikutnya"
          className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDown className="size-4" />
        </button>
      </div>
    </div>
  );
}
