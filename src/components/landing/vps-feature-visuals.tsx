import { Network, Server, ShieldCheck, Timer, Zap } from "lucide-react";
import type { ProductFeature } from "@/components/landing/product-features";

/**
 * Artwork for the VPS page's feature cards.
 *
 * Each visual depicts the feature rather than decorating it — a storage bar for NVMe, a
 * blocked-attack line for DDoS, a region list for the network — matching the homepage's
 * capability cards, which show a small mockup of the thing they describe.
 */
export function vpsFeatureVisuals(isId: boolean): ProductFeature[] {
  const t = (id: string, en: string) => (isId ? id : en);

  return [
    {
      Icon: Zap,
      title: t("NVMe SSD di semua paket", "NVMe SSD on every plan"),
      description: t(
        "Penyimpanan NVMe berkecepatan tinggi, bukan disk putar. Semua paket di bawah memakainya.",
        "High-speed NVMe storage, not spinning disks. Every plan below uses it.",
      ),
      visual: (
        <div className="w-full max-w-[220px] space-y-2">
          {[
            ["NVMe SSD", "w-full"],
            ["HDD", "w-1/4"],
          ].map(([label, width]) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>{label}</span>
                <span className="text-foreground">{width === "w-full" ? "cepat" : "lambat"}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                <div className={`h-full rounded-full ${width} ${width === "w-full" ? "bg-primary" : "bg-foreground/25"}`} />
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      Icon: ShieldCheck,
      title: t("Proteksi anti-DDoS", "DDoS protection"),
      description: t(
        "Traffic serangan disaring di jaringan sebelum mencapai server Anda.",
        "Attack traffic is filtered at the network before it reaches your server.",
      ),
      visual: (
        <div className="w-full max-w-[220px] space-y-1.5 font-mono text-[10px]">
          <div className="flex items-center justify-between rounded border border-foreground/10 bg-foreground/[0.02] px-3 py-1.5">
            <span className="text-muted-foreground">traffic normal</span>
            <span className="text-emerald-500">lolos</span>
          </div>
          <div className="flex items-center justify-between rounded border border-foreground/10 bg-foreground/[0.02] px-3 py-1.5">
            <span className="text-muted-foreground">serangan 40 Gbps</span>
            <span className="text-red-500">disaring</span>
          </div>
        </div>
      ),
    },
    {
      Icon: Network,
      title: t("Jaringan cepat", "Fast network"),
      description: t(
        "Bandwidth jaringan hingga 10 Gbps, dengan jatah traffic bulanan yang jelas per paket.",
        "Network bandwidth up to 10 Gbps, with a clear monthly traffic allowance per plan.",
      ),
      visual: (
        <div className="w-full max-w-[220px] rounded-lg border border-foreground/10 bg-foreground/[0.03] p-3 font-mono text-[10px]">
          <div className="flex justify-between text-muted-foreground">
            <span>bandwidth</span>
            <span className="text-foreground">10 Gbps</span>
          </div>
          <div className="mt-2 flex items-end gap-0.5">
            {[30, 45, 38, 62, 55, 78, 70, 92, 85, 100].map((h, i) => (
              <span key={i} className="flex-1 rounded-sm bg-primary/70" style={{ height: `${h * 0.28}px` }} />
            ))}
          </div>
        </div>
      ),
    },
    {
      Icon: Server,
      title: t("Pilihan sistem operasi", "Choice of operating system"),
      description: t(
        "Ubuntu, Debian, AlmaLinux, Rocky Linux, dan lainnya — pilih saat pemesanan.",
        "Ubuntu, Debian, AlmaLinux, Rocky Linux, and more — chosen at order time.",
      ),
      visual: (
        <div className="flex w-full max-w-[220px] flex-wrap justify-center gap-1.5">
          {["Ubuntu", "Debian", "AlmaLinux", "Rocky", "+lainnya"].map((os) => (
            <span
              key={os}
              className="rounded-md border border-foreground/10 bg-foreground/[0.03] px-2 py-1 font-mono text-[10px] text-muted-foreground"
            >
              {os}
            </span>
          ))}
        </div>
      ),
    },
    {
      Icon: Timer,
      title: t("Aktif dalam hitungan menit", "Running in minutes"),
      description: t(
        "Provisioning otomatis setelah pembayaran terverifikasi, tanpa menunggu konfirmasi manual.",
        "Provisioned automatically once payment is verified, with no manual confirmation wait.",
      ),
      visual: (
        <div className="w-full max-w-[220px] space-y-1.5 font-mono text-[10px]">
          {[
            ["pembayaran terverifikasi", "OK"],
            ["provisioning", "OK"],
            ["server aktif", "38s"],
          ].map(([step, status], i) => (
            <div key={step} className="flex items-center gap-2">
              <span className={`size-1.5 rounded-full ${i === 2 ? "bg-emerald-500" : "bg-foreground/30"}`} />
              <span className="flex-1 text-muted-foreground">{step}</span>
              <span className={i === 2 ? "text-emerald-500" : "text-foreground/50"}>{status}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];
}
