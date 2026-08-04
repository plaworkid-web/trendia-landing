"use client";

import {
  Battery,
  BrainCircuit,
  Cloud,
  Cpu,
  Database,
  HardDrive,
  ShieldCheck,
  Signal,
  Wifi,
} from "lucide-react";
import { PreviewSwitchHero } from "@/components/ui/preview-switch-hero";
import { contactUrl, portalUrl, type Locale } from "@/lib/site";

function ProductPanel({
  brandName,
  eyebrow,
  title,
  subtitle,
  stats,
}: {
  brandName: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  stats: [string, string][];
}) {
  return (
    <div className="relative mx-auto w-full max-w-[440px] px-2 [mask-image:linear-gradient(to_bottom,black_82%,transparent)]">
      <div className="overflow-hidden rounded-t-[2.5rem] bg-background/75 px-2 pt-2 shadow-2xl shadow-black/10 ring-1 ring-foreground/10">
        <div className="h-[360px] overflow-hidden rounded-t-[2rem] bg-foreground/[0.03] px-6 ring-1 ring-foreground/10 dark:bg-black">
          <div className="flex items-center justify-between py-3 text-xs">
            <span className="font-semibold">{brandName} Cloud</span>
            <div className="flex items-end gap-1">
              <Signal className="size-4" />
              <Wifi className="size-[18px]" />
              <Battery className="-mb-px size-5" />
            </div>
          </div>
          <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-foreground/15" />
          <div className="px-2 pt-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
              {eyebrow}
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground/85">
              {title}
            </p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-2">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-xl border bg-background/70 p-3 text-left">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 font-mono text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getPanels(brandName: string) {
 return [
  {
    id: "vps",
    label: "VPS",
    media: (
      <ProductPanel
        brandName={brandName}
        eyebrow="Compute"
        title="Deploy in seconds"
        subtitle="NVMe-powered virtual servers ready for production workloads."
        stats={[["Uptime", "99.9%"], ["Deploy", "< 60 sec"], ["Storage", "NVMe SSD"], ["Network", "Global"]]}
      />
    ),
  },
  {
    id: "ai",
    label: "AI API",
    media: (
      <ProductPanel
        brandName={brandName}
        eyebrow="Intelligence"
        title="One key, every model"
        subtitle="Connect to leading AI models through one compatible API."
        stats={[["Models", "Multi-model"], ["Response", "Streaming"], ["Billing", "Per usage"], ["API", "Unified"]]}
      />
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    media: (
      <ProductPanel
        brandName={brandName}
        eyebrow="Visibility"
        title="Know every request"
        subtitle="Monitor usage, cost, latency, and infrastructure health live."
        stats={[["Metrics", "Real-time"], ["Logs", "Searchable"], ["Alerts", "Instant"], ["Export", "Available"]]}
      />
    ),
  },
  {
    id: "security",
    label: "Security",
    media: (
      <ProductPanel
        brandName={brandName}
        eyebrow="Protection"
        title="Secure by default"
        subtitle="DDoS protection, encrypted secrets, and isolated workloads."
        stats={[["Encryption", "AES-256"], ["DDoS", "Active"], ["Isolation", "Dedicated"], ["Backups", "Automated"]]}
      />
    ),
  },
 ];
}

const logoClass =
  "inline-flex items-center gap-1.5 text-base font-semibold tracking-tight text-muted-foreground";

const logos = [
  { name: "Compute", Icon: Cpu },
  { name: "Cloud", Icon: Cloud },
  { name: "Storage", Icon: HardDrive },
  { name: "AI", Icon: BrainCircuit },
  { name: "Data", Icon: Database },
  { name: "Secure", Icon: ShieldCheck },
].map(({ name, Icon }) => ({
  name,
  logo: (
    <span className={logoClass}>
      <Icon className="size-5" />
      {name}
    </span>
  ),
}));

export function CtaSection({ locale, brandName = "Trendia" }: { locale: Locale; brandName?: string }) {
  const isId = locale === "id";
  const panels = getPanels(brandName);
  return (
    <PreviewSwitchHero
      badge={{ tag: brandName, label: isId ? "VPS dan AI dalam satu platform" : "VPS and AI in one platform" }}
      title={isId ? "Bangun lebih cepat tanpa infrastruktur yang terpisah-pisah" : "Build faster without fragmented infrastructure"}
      description={isId ? `Deploy VPS berperforma tinggi, gunakan berbagai model AI, dan pantau semuanya dari satu workspace ${brandName}.` : `Deploy high-performance VPS, access leading AI models, and monitor everything from one ${brandName} workspace.`}
      ratings={[
        { source: "deployment", score: "<60s" },
        { source: "uptime", score: "99.9%" },
        { source: "support", score: "24/7" },
      ]}
      showEmail={false}
      primaryCta={{ label: isId ? "Mulai sekarang" : "Get started", href: `${portalUrl}/register` }}
      secondaryCta={{ label: isId ? "Hubungi sales" : "Talk to sales", href: contactUrl }}
      avatars={[
        { initials: "AK" },
        { initials: "DP" },
        { initials: "RN" },
        { initials: "SL" },
        { initials: "TM" },
        { initials: "EV" },
      ]}
      socialProof={isId ? "dipercaya developer dan tim yang terus berkembang" : "trusted by developers and growing teams"}
      tabs={panels}
      logos={logos}
    />
  );
}
