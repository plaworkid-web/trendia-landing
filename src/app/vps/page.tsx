import type { Metadata } from "next";
import { VpsPage } from "@/components/landing/vps-page";

export const metadata: Metadata = {
  title: "Katalog VPS | Trendia",
  description: "Jelajahi paket VPS Trendia berdasarkan resource, lokasi server, dan kebutuhan workload.",
  alternates: { canonical: "/vps", languages: { "id-ID": "/vps", "en-US": "/en/vps" } },
};

export default function Page() { return <VpsPage locale="id" />; }
