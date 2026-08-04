import type { Metadata } from "next";
import { DocsPage } from "@/components/landing/docs-page";

export const metadata: Metadata = {
  title: "AI API & VPS Documentation | Trendia",
  description: "Trendia AI API quickstart and VPS getting-started guidance.",
  alternates: { canonical: "/en/docs", languages: { "id-ID": "/docs", "en-US": "/en/docs" } },
};

export default function Page() { return <DocsPage locale="en" />; }
