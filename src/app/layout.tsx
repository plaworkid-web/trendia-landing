import type { Metadata } from "next";
import { Inter, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { fetchAppSettings, fetchAppearance } from "@/lib/api";
import { BRAND, BRAND_ASSETS, resolveBrandValue } from "@/lib/brand";
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
    title: resolveBrandValue(settings?.app_name, BRAND.name),
    description: resolveBrandValue(settings?.meta_description, BRAND.description),
    keywords: resolveBrandValue(settings?.meta_keywords, BRAND.keywords),
    /*
      Both icons are declared, deliberately.
      `icons.icon` emits the CMS png; the `.ico` below is the file every browser requests by
      convention (`/favicon.ico`) regardless of what this tag says. Leaving that file to Next.js
      means it serves the scaffold icon — which is exactly what was happening: the served
      /favicon.ico was byte-identical to `src/app/favicon.ico`.
      `apple` covers iOS home-screen bookmarks, which ignore the plain `icon` entry.
    */
    icons: {
      icon: [
        { url: resolveBrandValue(settings?.favicon_url, BRAND_ASSETS.favicon), type: "image/png" },
        { url: BRAND_ASSETS.faviconIco, sizes: "any" },
      ],
      apple: BRAND_ASSETS.favicon,
    },
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
        <ThemeProvider appearance={appearance}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
