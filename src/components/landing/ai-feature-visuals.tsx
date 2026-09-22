import { Coins, Layers, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import type { ProductFeature } from "@/components/landing/product-features";

/**
 * Artwork for the AI page's feature cards.
 *
 * Each visual echoes the homepage's capability cards, which show a small mockup of the
 * thing being described (a terminal for execution, a key for security) rather than an
 * icon in a box. A visitor reads the illustration before the sentence, so it has to
 * depict the feature, not decorate it.
 *
 * Kept in one place so the feature list stays readable and the artwork can be changed
 * without touching the copy.
 */
export function aiFeatureVisuals(isId: boolean): ProductFeature[] {
  const t = (id: string, en: string) => (isId ? id : en);

  return [
    {
      Icon: Layers,
      title: t("Satu endpoint, banyak model", "One endpoint, many models"),
      description: t(
        "Ganti model cukup dengan mengubah satu nama di kode Anda — tidak perlu integrasi baru per penyedia.",
        "Switch models by changing one name in your code — no new integration per provider.",
      ),
      visual: (
        <div className="w-full max-w-[240px] font-mono text-[10px] leading-relaxed">
          <div className="overflow-hidden rounded-lg border border-foreground/10 bg-foreground/[0.03]">
            <div className="flex items-center gap-1.5 border-b border-foreground/10 px-3 py-1.5">
              <span className="size-1.5 rounded-full bg-foreground/20" />
              <span className="size-1.5 rounded-full bg-foreground/20" />
              <span className="size-1.5 rounded-full bg-foreground/20" />
            </div>
            <div className="space-y-1 p-3 text-muted-foreground">
              <p><span className="text-foreground">model:</span> &quot;gpt-4.1&quot;</p>
              <p className="text-foreground/40">↓ ubah satu baris</p>
              <p><span className="text-foreground">model:</span> &quot;claude-opus-4.6&quot;</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      Icon: Sparkles,
      title: t("Kompatibel dengan OpenAI", "OpenAI-compatible"),
      description: t(
        "Pakai SDK OpenAI yang sudah Anda gunakan. Cukup arahkan base URL ke endpoint kami.",
        "Use the OpenAI SDK you already have. Point the base URL at our endpoint.",
      ),
      visual: (
        <div className="w-full max-w-[240px] font-mono text-[10px]">
          <div className="rounded-lg border border-foreground/10 bg-foreground/[0.03] p-3">
            <p className="text-muted-foreground">
              <span className="text-foreground">baseURL</span>: &quot;plapod.web.id&quot;
            </p>
            <p className="mt-2 text-muted-foreground">
              <span className="text-foreground">apiKey</span>: &quot;sk-••••&quot;
            </p>
          </div>
        </div>
      ),
    },
    {
      Icon: Coins,
      title: t("Harga per model terlihat", "Per-model pricing in the open"),
      description: t(
        "Harga input dan output tiap model tercantum di katalog — termasuk perbedaan model murah dan mahal.",
        "Every model's input and output price is listed — including how a cheap and an expensive model differ.",
      ),
      visual: (
        <div className="w-full max-w-[240px] space-y-1.5">
          {[
            ["DeepSeek", "Rp 1.800"],
            ["Claude", "Rp 60.000"],
          ].map(([name, price]) => (
            <div
              key={name}
              className="flex items-center justify-between rounded border border-foreground/10 bg-foreground/[0.02] px-3 py-1.5 font-mono text-[10px]"
            >
              <span className="text-muted-foreground">{name}</span>
              <span className="text-foreground">{price}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      Icon: Wallet,
      title: t("Paket bulanan atau sesuai pemakaian", "Monthly plan or pay as you go"),
      description: t(
        "Pilih jatah kredit bulanan, atau bayar hanya untuk yang Anda pakai tanpa biaya tetap.",
        "Choose a monthly credit allowance, or pay only for what you use with no fixed fee.",
      ),
      visual: (
        <div className="w-full max-w-[240px]">
          <div className="rounded-lg border border-foreground/10 bg-foreground/[0.03] p-3 font-mono text-[10px]">
            <div className="flex justify-between text-muted-foreground">
              <span>kredit terpakai</span>
              <span className="text-foreground">42%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
              <div className="h-full w-[42%] rounded-full bg-primary" />
            </div>
          </div>
        </div>
      ),
    },
    {
      Icon: ShieldCheck,
      title: t("Failover antar penyedia", "Failover between providers"),
      description: t(
        "Jika satu penyedia model bermasalah, permintaan Anda otomatis dicoba ke penyedia cadangan.",
        "If one model provider has trouble, your request is automatically retried elsewhere.",
      ),
      visual: (
        <div className="w-full max-w-[240px] space-y-1.5 font-mono text-[10px]">
          <div className="flex items-center justify-between rounded border border-foreground/10 bg-foreground/[0.02] px-3 py-1.5">
            <span className="text-muted-foreground">provider 1</span>
            <span className="text-amber-500">timeout</span>
          </div>
          <div className="flex items-center justify-between rounded border border-foreground/10 bg-foreground/[0.02] px-3 py-1.5">
            <span className="text-muted-foreground">provider 2</span>
            <span className="text-emerald-500">200 OK</span>
          </div>
        </div>
      ),
    },
  ];
}
