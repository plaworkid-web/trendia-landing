import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── Card ──────────────────────────────────────────────── */

function Card({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-card"
      className={cn(
        "relative min-w-0 max-w-full overflow-hidden flex flex-col rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-sm transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── Header ────────────────────────────────────────────── */

function Header({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-card-header"
      className={cn("flex flex-col gap-4 border-b border-border p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── Plan ──────────────────────────────────────────────── */

function Plan({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-card-plan"
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── PlanName ──────────────────────────────────────────── */

function PlanName({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-card-plan-name"
      className={cn(
        "flex items-center gap-2 text-lg font-semibold [&_svg]:size-5 [&_svg]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── Badge ─────────────────────────────────────────────── */

function Badge({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pricing-card-badge"
      className={cn(
        "inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/* ─── Price ──────────────────────────────────────────────── */

function Price({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-card-price"
        className={cn("flex min-w-0 flex-wrap items-baseline gap-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── MainPrice ─────────────────────────────────────────── */

function MainPrice({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pricing-card-main-price"
        className={cn("break-words text-4xl font-bold tracking-tight", className)}
      {...props}
    >
      {children}
    </span>
  );
}

/* ─── Period ────────────────────────────────────────────── */

function Period({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  if (!children) return null;
  return (
    <span
      data-slot="pricing-card-period"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </span>
  );
}

/* ─── OriginalPrice ─────────────────────────────────────── */

function OriginalPrice({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  if (!children) return null;
  return (
    <span
      data-slot="pricing-card-original-price"
      className={cn("text-sm text-muted-foreground line-through", className)}
      {...props}
    >
      {children}
    </span>
  );
}

/* ─── Body ──────────────────────────────────────────────── */

function Body({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-card-body"
      className={cn("flex flex-1 flex-col gap-4 p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── Description ───────────────────────────────────────── */

function Description({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="pricing-card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/* ─── List ──────────────────────────────────────────────── */

function List({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pricing-card-list"
      className={cn("flex flex-col gap-2.5", className)}
      {...props}
    >
      {children}
    </ul>
  );
}

/* ─── ListItem ──────────────────────────────────────────── */

function ListItem({
  className,
  children,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="pricing-card-list-item"
      className={cn("flex items-start gap-2 text-sm", className)}
      {...props}
    >
      {children}
    </li>
  );
}

/* ─── Separator ─────────────────────────────────────────── */

function Separator({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-card-separator"
      className={cn("flex items-center gap-3 text-xs text-muted-foreground", className)}
      {...props}
    >
      <span className="h-px flex-1 bg-border" />
      {children && <span>{children}</span>}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ─── Exports ───────────────────────────────────────────── */

export {
  Card,
  Header,
  Plan,
  PlanName,
  Badge,
  Price,
  MainPrice,
  Period,
  OriginalPrice,
  Body,
  Description,
  List,
  ListItem,
  Separator,
};
