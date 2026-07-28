"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Menu, Sun, Moon, Monitor } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import type { MenuItem, AppSettings } from "@/types/landing";

interface NavbarProps {
  menuItems: MenuItem[];
  appSettings: AppSettings | null;
}

export function Navbar({ menuItems, appSettings }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = menuItems.filter((item) => item.show_in_navbar && !item.parent_id);
  const brandName = appSettings?.app_name ?? "Trendia";

  const getHref = (item: MenuItem) => {
    if (item.menu_type === "external" && item.url) return item.url;
    if (item.menu_type === "internal" && item.route_path) return item.route_path;
    return "#";
  };

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const ThemeIcon = () => {
    if (!mounted) return <Monitor className="size-4" />;
    if (theme === "dark") return <Moon className="size-4" />;
    if (theme === "light") return <Sun className="size-4" />;
    return <Monitor className="size-4" />;
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {appSettings?.logo_dark_url && (
            <Image
              src={appSettings.logo_dark_url}
              alt={brandName}
              width={120}
              height={32}
              className="hidden h-8 w-auto dark:block"
            />
          )}
          {appSettings?.logo_light_url && (
            <Image
              src={appSettings.logo_light_url}
              alt={brandName}
              width={120}
              height={32}
              className="block h-8 w-auto dark:hidden"
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
              key={item.id}
              href={getHref(item)}
              target={item.open_in_new_tab ? "_blank" : undefined}
              rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Google Translate container */}
          <div
            id="google_translate_element"
            className="hidden sm:block [&_.goog-te-gadget]:!font-sans [&_.goog-te-gadget-simple]:!border-border [&_.goog-te-gadget-simple]:!bg-transparent [&_.goog-te-gadget-simple]:!rounded-lg [&_.goog-te-gadget-simple]:!py-1 [&_.goog-te-gadget-simple]:!px-2 [&_.goog-te-gadget-simple]:!text-sm"
          />

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            aria-label="Toggle theme"
          >
            <ThemeIcon />
          </Button>

          {/* CTA */}
          <Link
            href="/login"
            className={buttonVariants({ variant: "default", className: "hidden sm:inline-flex" })}
          >
            Get Started
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
                    key={item.id}
                    href={getHref(item)}
                    target={item.open_in_new_tab ? "_blank" : undefined}
                    rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="mt-4 border-t border-border pt-4">
                  <Link
                    href="/login"
                    className={buttonVariants({ variant: "default", className: "w-full" })}
                  >
                    Get Started
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
