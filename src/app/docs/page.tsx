import type { Metadata } from "next";
import { DocsPage } from "@/components/landing/docs-page";

export const metadata: Metadata = {
  title: "Dokumentasi AI API & VPS | Trendia",
  description: "Quickstart AI API Trendia dan panduan awal VPS.",
  alternates: { canonical: "/docs", languages: { "id-ID": "/docs", "en-US": "/en/docs" } },
};

export default function Page() { return <DocsPage locale="id" />; }
