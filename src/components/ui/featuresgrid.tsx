import { Database, Network, ShieldCheck, Terminal } from "lucide-react";
import { PlanetCard } from "@/components/ui/planet-card";
import type { Locale } from "@/lib/site";
import { aiApiBaseUrl } from "@/lib/site";

/**
 * Homepage capability cards, lit like the rest of the site.
 *
 * This section sits ON the hero artwork that backs the page, so it is deliberately
 * translucent rather than a black plate: `bg-black` here painted over the background and
 * made this section read as a different page from the one above it.
 *
 * Everything is a theme token (`text-foreground`, `bg-background/60`) rather than
 * `text-white` / `bg-[#050505]`, because a light background needs dark text and the
 * section appears in both themes.
 */
const cardClass =
  "group flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-foreground/[0.08] bg-background/60 backdrop-blur-md transition-colors hover:border-foreground/[0.15]";

interface FeatureContentProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function FeatureContent({ icon: Icon, title, description }: FeatureContentProps) {
  return (
    <div className="border-t border-foreground/[0.04] bg-foreground/[0.01] p-6">
      <div className="mb-2 flex items-center gap-2 text-foreground">
        <Icon className="size-4" />
        <h4 className="type-h4">{title}</h4>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function Component({ locale = "id" }: { locale?: Locale }) {
  const isId = locale === "id";
  return (
    <section
      id="features"
      className="relative w-full py-24 font-sans text-foreground selection:bg-foreground selection:text-background sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="type-display mb-4 max-w-3xl text-balance text-foreground">
            {isId ? "Semua yang Anda butuhkan." : "Everything you need."} <br className="hidden sm:block" />
            <span className="text-muted-foreground/60">{isId ? "Tanpa kompleksitas berlebih." : "Nothing you don&apos;t."}</span>
          </h2>
          <p className="type-lead max-w-2xl text-balance text-muted-foreground">
            {isId ? "Infrastruktur untuk deployment cepat, workload aman, dan kendali penuh tanpa kompleksitas yang tidak perlu." : "Purpose-built infrastructure for fast deployment, secure workloads, and complete control without unnecessary complexity."}
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
          <PlanetCard className="h-full md:col-span-2" shape="rounded-xl">
            <div className={`${cardClass} h-full`}>
            <div className="relative flex flex-1 items-center justify-center p-8">
              <div className="w-full max-w-md overflow-hidden rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                <div className="flex border-b border-foreground/[0.08] px-4 py-2">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((dot) => (
                      <div key={dot} className="size-2 rounded-full bg-foreground/[0.15]" />
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between">
                    <span className="text-foreground">latency_check --region global</span>
                    <span>[OK]</span>
                  </div>
                  <div className="mt-2 flex justify-between text-muted-foreground">
                    <span>resolving edge nodes...</span>
                    <span>12ms</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>authenticating request...</span>
                    <span>8ms</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>establishing connection...</span>
                    <span>14ms</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-foreground/[0.08] pt-4 text-foreground">
                    <span className="size-1.5 animate-pulse rounded-full bg-foreground" />
                    Global deployment active (34ms total)
                  </div>
                </div>
              </div>
            </div>
            <FeatureContent
              icon={Terminal}
              title={isId ? "Eksekusi Responsif" : "Responsive Execution"}
              description={isId ? "Jalankan aplikasi pada infrastruktur cepat agar tetap responsif bagi pengguna Anda." : "Run applications on fast infrastructure so they stay responsive for your users."}
            />
            </div>
          </PlanetCard>

          <PlanetCard className="h-full" shape="rounded-xl">
            <div className={`${cardClass} h-full`}>
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="flex w-full flex-col gap-2">
                {[0, 1, 2].map((row) => (
                  <div
                    key={row}
                    className="flex h-8 w-full items-center justify-between rounded border border-foreground/[0.04] bg-foreground/[0.02] px-3"
                  >
                    <div className="h-1 w-12 rounded bg-foreground/[0.2]" />
                    <div className="h-1 w-4 rounded bg-foreground/[0.1]" />
                  </div>
                ))}
              </div>
            </div>
            <FeatureContent
              icon={Database}
              title={isId ? "Penyimpanan NVMe" : "NVMe Storage"}
              description={isId ? "Storage cepat untuk aplikasi, database, dan workload produksi." : "Fast storage for applications, databases, and production workloads."}
            />
            </div>
          </PlanetCard>

          <PlanetCard className="h-full" shape="rounded-xl">
            <div className={`${cardClass} h-full`}>
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="w-full max-w-[200px] break-all font-mono text-[10px] leading-tight text-muted-foreground/70">
                <span className="text-foreground">tr_live_</span>
                51MkxXXXXXXXXXXXXXXXXXXXXX
                <div className="my-4 h-px w-full bg-foreground/[0.08]" />
                AES-256-GCM / SHA-384
              </div>
            </div>
            <FeatureContent
              icon={ShieldCheck}
              title={isId ? "Keamanan Berlapis" : "Layered Security"}
              description={isId ? "Secret terenkripsi, isolasi workload, dan proteksi jaringan untuk setiap layanan." : "Encrypted secrets, workload isolation, and network protection for every service."}
            />
            </div>
          </PlanetCard>

          <PlanetCard className="h-full md:col-span-2" shape="rounded-xl">
            <div className={`${cardClass} h-full`}>
            <div className="relative flex flex-1 items-center justify-center p-8">
              <div className="flex w-full max-w-sm flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 items-center rounded border border-foreground/[0.08] bg-foreground/[0.03] px-3 font-mono text-xs text-foreground">
                    POST
                  </div>
                  <div className="min-w-0 flex-1 break-all rounded border border-foreground/[0.08] bg-foreground/[0.03] px-3 py-2 font-mono text-xs text-muted-foreground">
                    {aiApiBaseUrl.replace(/^https?:\/\//, "")}/chat/completions
                  </div>
                </div>
                <div className="pl-[60px]">
                  <div className="h-6 border-l border-foreground/[0.12]" />
                </div>
                <div className="flex items-center justify-between rounded border border-foreground/[0.08] bg-foreground/[0.02] p-3 font-mono text-xs text-muted-foreground">
                  <span>{'{ "status": "success", "nodes": 24 }'}</span>
                  <span className="text-foreground">200 OK</span>
                </div>
              </div>
            </div>
            <FeatureContent
              icon={Network}
              title={isId ? "API Kompatibel OpenAI" : "OpenAI-Compatible API"}
              description={isId ? "Hubungkan aplikasi ke berbagai model AI dengan mengganti satu base URL." : "Connect applications to multiple AI models by changing one base URL."}
            />
            </div>
          </PlanetCard>
        </div>
      </div>
    </section>
  );
}
