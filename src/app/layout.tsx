import type { Metadata } from "next";
import { Inter, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
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
        <ThemeProvider appearance={appearance}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
