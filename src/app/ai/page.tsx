import type { Metadata } from "next";
import { AiPage } from "@/components/landing/ai-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Plapod";
  return {
    title: `Layanan AI | ${brand}`,
    description: `Akses berbagai model AI lewat satu API kompatibel OpenAI. Lihat keunggulan, harga paket, dan katalog model ${brand}.`,
    alternates: { canonical: "/ai", languages: { "id-ID": "/ai", "en-US": "/en/ai" } },
  };
}

export default function Page() {
  return <AiPage locale="id" />;
}
