import { AlertTriangle, CheckCircle2, KeyRound, Server, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/landing/code-block";
import { PublicShell } from "@/components/landing/public-shell";
import { fetchAppSettings } from "@/lib/api";
import { aiApiBaseUrl, copy, portalUrl, type Locale } from "@/lib/site";

export async function DocsPage({ locale }: { locale: Locale }) {
  const t = copy[locale].docs;
  const isId = locale === "id";
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Trendia";
  const curl = `curl ${aiApiBaseUrl}/chat/completions \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"model":"MODEL_ID","messages":[{"role":"user","content":"Hello"}]}'`;
  const node = `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${aiApiBaseUrl}",
  apiKey: process.env.TRENDIA_API_KEY,
});

const response = await client.chat.completions.create({
  model: "MODEL_ID",
  messages: [{ role: "user", content: "Hello" }],
});`;
  const python = `from openai import OpenAI

client = OpenAI(
    base_url="${aiApiBaseUrl}",
    api_key="YOUR_API_KEY",
)

response = client.chat.completions.create(
    model="MODEL_ID",
    messages=[{"role": "user", "content": "Hello"}],
)`;

  const nav = [
    ["quickstart", isId ? "Mulai cepat" : "Quickstart"],
    ["auth", isId ? "Autentikasi" : "Authentication"],
    ["chat", "Chat Completions"],
    ["models", isId ? "Katalog model" : "Model catalog"],
    ["errors", isId ? "Kode error" : "Error codes"],
    ["vps", "VPS Quickstart"],
  ];

  return (
    <PublicShell locale={locale}>
      <section className="section-shell">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">{t.eyebrow}</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{t.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t.description}</p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <nav className="sticky top-24 space-y-1 rounded-xl border bg-background/70 p-3 backdrop-blur">
                {nav.map(([id, label]) => <a key={id} href={`#${id}`} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">{label}</a>)}
              </nav>
            </aside>

            <div className="min-w-0 space-y-8">
              <Card id="quickstart" className="scroll-mt-24 glass-card">
                <CardHeader><CardTitle className="flex items-center gap-2"><Terminal className="size-5 text-primary" />{isId ? "Mulai cepat AI API" : "AI API quickstart"}</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-muted-foreground">{isId ? `Buat akun, aktifkan paket AI, lalu generate key dari dashboard. Ganti base URL OpenAI SDK Anda ke endpoint ${brand}.` : `Create an account, activate an AI plan, then generate a key from the dashboard. Point your OpenAI SDK base URL at ${brand}.`}</p>
                  <div className="rounded-lg border bg-muted/40 px-4 py-3 font-mono text-sm">{aiApiBaseUrl}</div>
                  <CodeBlock label="curl" code={curl} />
                </CardContent>
              </Card>

              <Card id="auth" className="scroll-mt-24 glass-card">
                <CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="size-5 text-primary" />{isId ? "Autentikasi Bearer" : "Bearer authentication"}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{isId ? "Kirim API key pada header Authorization. Key hanya ditampilkan sekali saat dibuat." : "Send your API key in the Authorization header. A raw key is only shown once when generated."}</p>
                  <CodeBlock label="header" code="Authorization: Bearer YOUR_API_KEY" />
                  <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" /><span>{isId ? "Jangan simpan API key di source code, browser bundle, atau repository." : "Never store API keys in source code, browser bundles, or repositories."}</span></div>
                </CardContent>
              </Card>

              <Card id="chat" className="scroll-mt-24 glass-card">
                <CardHeader><CardTitle>POST /chat/completions</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-muted-foreground">{isId ? "Request mengikuti format OpenAI dan mendukung streaming pada model yang kompatibel." : "Requests follow the OpenAI shape and support streaming on compatible models."}</p>
                  <div id="openai-sdk" className="grid gap-4 xl:grid-cols-2"><CodeBlock label="Node.js" code={node} /><CodeBlock label="Python" code={python} /></div>
                  <p className="text-sm text-muted-foreground"><code className="rounded bg-muted px-1.5 py-1">POST /embeddings</code> {isId ? "tersedia untuk model embedding aktif." : "is available for active embedding models."}</p>
                </CardContent>
              </Card>

              <Card id="models" className="scroll-mt-24 glass-card">
                <CardHeader><CardTitle>{isId ? "Pilih model" : "Choose a model"}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{isId ? "Gunakan model ID persis seperti di katalog. Endpoint API GET /models memerlukan key aktif." : "Use the exact model ID from the catalog. The API GET /models endpoint requires an active key."}</p>
                  <a href={locale === "id" ? "/models" : "/en/models"} className="inline-flex rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted">{isId ? "Buka katalog model" : "Open model catalog"}</a>
                </CardContent>
              </Card>

              <Card id="errors" className="scroll-mt-24 glass-card">
                <CardHeader><CardTitle>{isId ? "Kode error umum" : "Common error codes"}</CardTitle></CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {[["401", isId ? "Key tidak ada atau tidak valid" : "Missing or invalid key"], ["402", isId ? "Saldo kredit tidak cukup" : "Insufficient credit balance"], ["403", isId ? "Paket kedaluwarsa atau model dibatasi" : "Expired plan or restricted model"], ["429", isId ? "Rate limit tercapai" : "Rate limit exceeded"], ["502", isId ? "Provider upstream gagal" : "Upstream provider failure"], ["503", isId ? "Provider sementara tidak tersedia" : "Provider temporarily unavailable"]].map(([status, description]) => <div key={status} className="rounded-lg border p-3"><Badge variant="outline">{status}</Badge><p className="mt-2 text-sm text-muted-foreground">{description}</p></div>)}
                </CardContent>
              </Card>

              <Card id="vps" className="scroll-mt-24 glass-card">
                <CardHeader><CardTitle className="flex items-center gap-2"><Server className="size-5 text-primary" />VPS Quickstart</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {(isId ? ["Pilih spesifikasi VPS lalu hubungi sales untuk konfirmasi workload dan region.", "Setelah provisioning selesai, simpan IP dan kredensial yang dikirim melalui kanal resmi.", "Hubungkan via SSH, ganti kredensial awal, aktifkan firewall, dan pasang update keamanan.", "Atur backup serta monitoring sesuai kebutuhan workload produksi."] : ["Choose VPS specifications, then contact sales to confirm workload and region.", "After provisioning, store the IP and credentials delivered through the official channel.", "Connect over SSH, rotate initial credentials, enable a firewall, and install security updates.", "Configure backups and monitoring for production workloads."]).map((step, index) => <div key={step} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" /><div><p className="text-sm font-medium">{index + 1}</p><p className="text-sm text-muted-foreground">{step}</p></div></div>)}
                  <a href={`${portalUrl}/register`} className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80">{isId ? `Buat akun ${brand}` : `Create a ${brand} account`}</a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
