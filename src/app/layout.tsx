import type { Metadata } from "next";
import { Inter, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { HeroBackground } from "@/components/ui/hero-background";
import { fetchAppSettings, fetchAppearance } from "@/lib/api";
import "./globals.css";

/**
 * Inter, matching the reference this landing is styled after.
 *
 * Loaded as a VARIABLE font (no `weight` array) because the scale uses fractional
 * weights — 510 for headings, 590 for emphasis. Those are only available from a
 * variable axis (`wght` 100–900); a static instance would snap them to 500/600 and
 * the headings would look heavier than intended.
 *
 * `opsz` is a real axis on Inter (14–32) and is left to the browser, which picks a
 * value from the rendered size — that is what makes 64px headings look tighter than
 * 15px body text at the same tracking.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  return {
    title: settings?.app_name ?? "VPS & AI Platform",
    description:
      settings?.meta_description ??
      "High-performance VPS hosting and AI API platform for modern developers.",
    keywords: settings?.meta_keywords ?? "VPS, AI, API, cloud, hosting",
    icons: settings?.favicon_url ? { icon: settings.favicon_url } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appearance = await fetchAppearance();
  return (
    <html
      lang="id"
      className={`${inter.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        {/*
          The hero artwork as the page background, so every section sits on the same scene
          rather than on flat black. Fixed, so it stays behind the content while scrolling,
          and `z-0` with the content wrapper at `z-10` keeps it behind everything.

          `bottomFade={false}`: that fade exists to blend the hero band into the section
          below it, and a fixed layer has no section below it — its bottom edge only meets
          the viewport bottom on a page shorter than the screen, where it would read as a
          stray dark band.

          `aria-hidden` and `pointer-events-none` because it is decoration; the cursor
          light inside it still works, since it listens on its own container.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <HeroBackground className="absolute inset-0" />
        </div>

        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <ThemeProvider appearance={appearance}>{children}</ThemeProvider>
        </div>
      </body>
    </html>
  );
}
