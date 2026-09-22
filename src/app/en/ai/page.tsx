import type { Metadata } from "next";
import { AiPage } from "@/components/landing/ai-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Plapod";
  return {
    title: `AI Service | ${brand}`,
    description: `Access many AI models through one OpenAI-compatible API. See the advantages, plan pricing, and the ${brand} model catalog.`,
    alternates: { canonical: "/en/ai", languages: { "id-ID": "/ai", "en-US": "/en/ai" } },
  };
}

export default function Page() {
  return <AiPage locale="en" />;
}
