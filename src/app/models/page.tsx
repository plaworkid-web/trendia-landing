import type { Metadata } from "next";
import { ModelsPage } from "@/components/landing/models-page";

export const metadata: Metadata = {
  title: "Katalog Model AI | Trendia",
  description: "Jelajahi model AI, kapabilitas, context window, dan harga jual Trendia.",
  alternates: { canonical: "/models", languages: { "id-ID": "/models", "en-US": "/en/models" } },
};

export default function Page() { return <ModelsPage locale="id" />; }
