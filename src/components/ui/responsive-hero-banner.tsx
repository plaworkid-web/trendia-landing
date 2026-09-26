"use client";

import React from 'react';
import { HeroBackground } from '@/components/ui/hero-background';
import { LandingHeader } from '@/components/landing/landing-header';
import type { AppSettings, MenuItem } from '@/types/landing';
import type { Locale } from '@/lib/site';

interface ResponsiveHeroBannerProps {
    /** Header data, passed straight through to the shared header. */
    locale?: Locale;
    appSettings?: AppSettings | null;
    menuItems?: MenuItem[];
    badgeText?: string;
    badgeLabel?: string;
    title?: string;
    titleLine2?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
    locale = "id",
    appSettings = null,
    menuItems = [],
    badgeLabel = "New",
    badgeText = "First Commercial Flight to Mars 2026",
    title = "Journey Beyond Earth",
    titleLine2 = "Into the Cosmos",
    description = "Experience the cosmos like never before. Our advanced spacecraft and cutting-edge technology make interplanetary travel accessible, safe, and unforgettable.",
    primaryButtonText = "Book Your Journey",
    primaryButtonHref = "#",
    secondaryButtonText = "Watch Launch",
    secondaryButtonHref = "#",
}) => {
    return (
        <section className="w-full isolate min-h-screen overflow-hidden relative flex flex-col">
            <HeroBackground className="absolute inset-0 z-0" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-black/30" />

            {/* The same header the inner pages use, in its `hero` variant: transparent
                over the artwork, hardcoded white because this surface is always dark.
                It was written inline here, which is how it drifted from `Navbar`. */}
            <LandingHeader
                variant="hero"
                locale={locale}
                appSettings={appSettings ?? null}
                menuItems={menuItems}
            />

            <div className="z-10 relative flex flex-1 items-center">
                <div className="max-w-7xl mx-auto px-6 pt-6 pb-12 sm:pt-16 sm:pb-16 lg:pt-28 lg:pb-14 w-full">
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
