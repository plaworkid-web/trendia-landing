"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/theme-provider";
import { Globe, Menu, Sun, Moon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import type { MenuItem, AppSettings } from "@/types/landing";
import { copy, localizedPath, portalUrl, type Locale } from "@/lib/site";

interface NavbarProps {
  menuItems: MenuItem[];
  appSettings: AppSettings | null;
  locale?: Locale;
}

export function Navbar({ appSettings, locale = "id" }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const t = copy[locale].nav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const brandName = appSettings?.app_name ?? "Trendia";
  const routePath = locale === "en" ? pathname.replace(/^\/en/, "") || "/" : pathname;
  const languageHref = locale === "id"
    ? `/en${routePath === "/" ? "" : routePath}`
    : routePath;
  const navItems = [
    { label: t.home, href: localizedPath(locale) },
    { label: t.vps, href: localizedPath(locale, "/vps") },
    { label: t.models, href: localizedPath(locale, "/models") },
    { label: t.pricing, href: localizedPath(locale, "/pricing") },
    { label: t.docs, href: localizedPath(locale, "/docs") },
  ];

  const cycleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={localizedPath(locale)} className="flex items-center gap-2">
          {appSettings?.logo_dark_url && (
            <Image
              src={appSettings.logo_dark_url}
              alt={brandName}
              width={210}
              height={56}
              style={{ width: "auto" }}
              className="hidden h-14 w-auto dark:block"
            />
          )}
          {appSettings?.logo_light_url && (
            <Image
              src={appSettings.logo_light_url}
              alt={brandName}
              width={210}
              height={56}
              style={{ width: "auto" }}
              className="block h-14 w-auto dark:hidden"
            />
          )}
          {!appSettings?.logo_light_url && !appSettings?.logo_dark_url && (
            <span className="text-xl font-bold tracking-tight">{brandName}</span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Link
            href={languageHref}
            className={buttonVariants({ variant: "ghost", className: "size-8 px-0" })}
            aria-label={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
            title={locale === "id" ? "English" : "Bahasa Indonesia"}
          >
            <Globe className="size-4" />
          </Link>
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>

          {/* CTA */}
          <Link
            href={`${portalUrl}/register`}
            className={buttonVariants({ variant: "default", className: "hidden sm:inline-flex" })}
          >
            {t.start}
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <SheetTitle className="text-lg font-bold">{brandName}</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 border-t border-border pt-4">
                  <Link
                    href={`${portalUrl}/register`}
                    className={buttonVariants({ variant: "default", className: "w-full" })}
                  >
                    {t.start}
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
