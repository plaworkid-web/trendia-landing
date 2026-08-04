import type { Metadata } from "next";
import { ModelsPage } from "@/components/landing/models-page";

export const metadata: Metadata = {
  title: "AI Model Catalog | Trendia",
  description: "Explore AI models, capabilities, context windows, and Trendia sell pricing.",
  alternates: { canonical: "/en/models", languages: { "id-ID": "/models", "en-US": "/en/models" } },
};

export default function Page() { return <ModelsPage locale="en" />; }
