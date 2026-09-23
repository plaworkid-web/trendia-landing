"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/providers/theme-provider';
import { Globe, Moon, Sun } from 'lucide-react';
import { HeroBackground } from '@/components/ui/hero-background';
import OrbitingCirclesGlobe from '@/components/ui/orbiting-circles-02';

interface NavLink {
    label: string;
    href: string;
    isActive?: boolean;
}

interface ResponsiveHeroBannerProps {
    logoUrl?: string;
    brandName?: string;
    navLinks?: NavLink[];
    ctaButtonText?: string;
    ctaButtonHref?: string;
    badgeText?: string;
    badgeLabel?: string;
    title?: string;
    titleLine2?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    languageHref?: string;
    languageLabel?: string;
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
    logoUrl = "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/febf2421-4a9a-42d6-871d-ff4f9518021c_1600w.png",
    brandName = "Trendia",
    navLinks = [
        { label: "Home", href: "#", isActive: true },
        { label: "Missions", href: "#" },
        { label: "Destinations", href: "#" },
        { label: "Technology", href: "#" },
        { label: "Book Flight", href: "#" }
    ],
    ctaButtonText = "Reserve Seat",
    ctaButtonHref = "#",
    badgeLabel = "New",
    badgeText = "First Commercial Flight to Mars 2026",
    title = "Journey Beyond Earth",
    titleLine2 = "Into the Cosmos",
    description = "Experience the cosmos like never before. Our advanced spacecraft and cutting-edge technology make interplanetary travel accessible, safe, and unforgettable.",
    primaryButtonText = "Book Your Journey",
    primaryButtonHref = "#",
    secondaryButtonText = "Watch Launch",
    secondaryButtonHref = "#",
    languageHref = "/en",
    languageLabel = "English"
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    const cycleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <section className="w-full isolate min-h-screen overflow-hidden relative">
            <HeroBackground className="absolute inset-0 z-0" />
            <OrbitingCirclesGlobe />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-black/30" />

            <header className="z-10 xl:top-4 relative">
                <div className="mx-6">
                    <div className="flex items-center justify-between pt-4">
                            <Link
                                href="/"
                                aria-label={brandName}
                                className="inline-flex h-[56px] w-[180px] items-center justify-center rounded bg-contain bg-center bg-no-repeat sm:h-[64px] sm:w-[210px]"
                                style={{ backgroundImage: `url(${logoUrl})` }}
                            />

                        <nav className="hidden md:flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
                                {navLinks.map((link, index) => (
                                    <Link
                                        key={`${link.href}-${index}`}
                                        href={link.href}
                                        className={`px-3 py-2 text-sm font-medium hover:text-white font-sans transition-colors ${link.isActive ? 'text-white/90' : 'text-white/80'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <a
                                    href={ctaButtonHref}
                                    className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90 font-sans transition-colors"
                                >
                                    {ctaButtonText}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                        <path d="M7 7h10v10" />
                                        <path d="M7 17 17 7" />
                                    </svg>
                                </a>
                            </div>
                            {/* Theme toggle */}
                            <button
                                onClick={cycleTheme}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur hover:bg-white/10 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {resolvedTheme === 'dark' ? <Moon className="size-4 text-white/80" /> : <Sun className="size-4 text-white/80" />}
                            </button>
                            <a
                                href={languageHref}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-white/10"
                                aria-label={languageLabel}
                                title={languageLabel}
                            >
                                <Globe className="size-4 text-white/80" />
                            </a>
                        </nav>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur"
                            aria-expanded={mobileMenuOpen}
                            aria-label="Toggle menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white/90">
                                <path d="M4 5h16" />
                                <path d="M4 12h16" />
                                <path d="M4 19h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {mobileMenuOpen && (
                <div className="absolute inset-x-6 top-20 z-30 rounded-2xl bg-black/70 p-4 ring-1 ring-white/15 backdrop-blur-xl md:hidden">
                    <nav className="flex flex-col gap-1">
                        {navLinks.map((link, index) => (
                            <Link
                                key={`${link.href}-${index}`}
                                href={link.href}
                                className="rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/10"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-2 flex items-center gap-2 border-t border-white/10 pt-3">
                            <a href={languageHref} className="inline-flex size-9 items-center justify-center rounded-full bg-white/10" aria-label={languageLabel}>
                                <Globe className="size-4 text-white/80" />
                            </a>
                            <a href={ctaButtonHref} className="flex-1 rounded-full bg-white px-4 py-2 text-center text-sm font-medium text-neutral-900">
                                {ctaButtonText}
                            </a>
                        </div>
                    </nav>
                </div>
            )}

            <div className="z-10 relative">
                <div className="sm:pt-28 md:pt-32 lg:pt-40 max-w-7xl mx-auto pt-28 px-6 pb-16">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-2.5 py-2 ring-1 ring-white/15 backdrop-blur animate-fade-slide-in-1">
                            <span className="inline-flex items-center text-xs font-medium text-neutral-900 bg-white/90 rounded-full py-0.5 px-2 font-sans">
                                {badgeLabel}
                            </span>
                            <span className="text-sm font-medium text-white/90 font-sans">
                                {badgeText}
                            </span>
                        </div>

                        <h1 className="type-display text-white animate-fade-slide-in-2">
                            {/* The space is explicit because the <br> is hidden below sm:
                                with only the <br> separating the two lines, mobile rendered
                                "PlatformUntuk" as one word. A trailing space before a line
                                break collapses, so this is inert on desktop. */}
                            {title}{" "}
                            <br className="hidden sm:block" />
                            {titleLine2}
                        </h1>

                        <p className="sm:text-lg animate-fade-slide-in-3 text-base text-white/80 max-w-2xl mt-6 mx-auto">
                            {description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:gap-4 mt-10 gap-3 items-center justify-center animate-fade-slide-in-4">
                            <a
                                href={primaryButtonHref}
                                className="inline-flex items-center gap-2 hover:bg-white/15 text-sm font-medium text-white bg-white/10 ring-white/15 ring-1 rounded-full py-3 px-5 font-sans transition-colors"
                            >
                                {primaryButtonText}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </a>
                            <a
                                href={secondaryButtonHref}
                                className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-3 text-sm font-medium text-white/90 hover:text-white font-sans transition-colors"
                            >
                                {secondaryButtonText}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ResponsiveHeroBanner;
