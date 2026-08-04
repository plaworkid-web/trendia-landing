export type Locale = "id" | "en";

export const portalUrl = (
  process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const aiApiBaseUrl = (
  process.env.NEXT_PUBLIC_AI_API_BASE_URL || "http://localhost:8000/api/v1"
).replace(/\/$/, "");

export const contactUrl =
  process.env.NEXT_PUBLIC_CONTACT_URL || "mailto:sales@trendia.id";

export function localizedPath(locale: Locale, path = "") {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return locale === "en" ? `/en${normalized}` : normalized || "/";
}

export function otherLocalePath(locale: Locale, path = "") {
  return localizedPath(locale === "id" ? "en" : "id", path);
}

export const copy = {
  id: {
    nav: { home: "Beranda", vps: "VPS", models: "Model", pricing: "Harga", docs: "Dokumentasi", signIn: "Masuk", start: "Mulai" },
    hero: {
      badge: "Infrastruktur cloud dan AI dalam satu platform",
      title: "VPS & AI Platform",
      titleLine2: "Untuk Developer Modern",
      description: "Deploy server virtual berperforma tinggi dan akses berbagai model AI melalui satu platform terpadu. Infrastruktur dan kecerdasan yang tumbuh bersama produk Anda.",
      primary: "Lihat Paket VPS",
      secondary: "Jelajahi AI API",
    },
    integrations: {
      title: "Satu API, Semua Model AI Terdepan",
      description: "Akses model dari OpenAI, Anthropic, Google, Meta, Mistral, dan provider lain melalui endpoint yang kompatibel dengan OpenAI.",
      action: "Lihat Katalog Model",
    },
    pricing: {
      eyebrow: "Harga Transparan",
      title: "Pilih Infrastruktur yang Anda Butuhkan",
      description: "Paket VPS fleksibel dan akses AI berbasis kredit untuk setiap tahap pengembangan.",
      vps: "VPS Hosting",
      ai: "AI API",
    },
    models: {
      eyebrow: "Katalog AI",
      title: "Semua model, satu endpoint.",
      description: "Bandingkan provider, kapabilitas, context window, serta harga input dan output.",
      search: "Cari model atau provider...",
      all: "Semua provider",
      empty: "Belum ada model aktif.",
      unavailable: "Katalog model belum dapat dimuat.",
      input: "Input / 1M",
      output: "Output / 1M",
      context: "Context",
      copy: "Salin ID model",
    },
    docs: {
      eyebrow: "Dokumentasi",
      title: "Mulai membangun dalam beberapa menit.",
      description: "Panduan AI API yang sesuai endpoint Trendia serta alur awal penggunaan VPS.",
    },
    common: { loading: "Memuat...", copy: "Salin", copied: "Tersalin", getStarted: "Mulai sekarang" },
  },
  en: {
    nav: { home: "Home", vps: "VPS", models: "Models", pricing: "Pricing", docs: "Docs", signIn: "Sign in", start: "Get started" },
    hero: {
      badge: "Cloud infrastructure and AI in one platform",
      title: "VPS & AI Platform",
      titleLine2: "For Modern Developers",
      description: "Deploy high-performance virtual servers and access leading AI models through one unified platform. Infrastructure and intelligence that scale with your product.",
      primary: "Explore VPS Plans",
      secondary: "Explore AI API",
    },
    integrations: {
      title: "One API, Every Leading AI Model",
      description: "Access models from OpenAI, Anthropic, Google, Meta, Mistral, and other providers through one OpenAI-compatible endpoint.",
      action: "Browse Model Catalog",
    },
    pricing: {
      eyebrow: "Transparent Pricing",
      title: "Choose the Infrastructure You Need",
      description: "Flexible VPS packages and credit-based AI access for every stage of development.",
      vps: "VPS Hosting",
      ai: "AI API",
    },
    models: {
      eyebrow: "AI Catalog",
      title: "Every model, one endpoint.",
      description: "Compare providers, capabilities, context windows, and input/output pricing.",
      search: "Search models or providers...",
      all: "All providers",
      empty: "No active models yet.",
      unavailable: "The model catalog is currently unavailable.",
      input: "Input / 1M",
      output: "Output / 1M",
      context: "Context",
      copy: "Copy model ID",
    },
    docs: {
      eyebrow: "Documentation",
      title: "Start building in minutes.",
      description: "AI API guidance matching Trendia's live endpoints plus a practical VPS getting-started flow.",
    },
    common: { loading: "Loading...", copy: "Copy", copied: "Copied", getStarted: "Get started" },
  },
} as const;
