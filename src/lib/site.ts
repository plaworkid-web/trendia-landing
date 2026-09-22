export type Locale = "id" | "en";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

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

export interface ResolvedNavItem {
  id: string;
  label: string;
  href: string;
  external: boolean;
  openInNewTab: boolean;
  children: ResolvedNavItem[];
}

interface RawMenuItem {
  id: string;
  title: string;
  menu_type: "external" | "internal" | "static";
  url: string | null;
  route_path: string | null;
  parent_id: string | null;
  show_in_navbar: boolean;
  show_in_footer: boolean;
  open_in_new_tab: boolean;
}

function menuHref(item: RawMenuItem, locale: Locale): string {
  if (item.menu_type === "external" && item.url) return item.url;
  if (item.menu_type === "internal" && item.route_path) {
    return localizedPath(locale, item.route_path);
  }
  return item.url ?? localizedPath(locale);
}

function buildMenuTree(
  items: RawMenuItem[],
  locale: Locale,
  where: "show_in_navbar" | "show_in_footer",
): ResolvedNavItem[] {
  const filtered = items.filter(
    (item) => item[where] && item.title.trim().length > 0 && (item.url || item.route_path),
  );
  const byParent = new Map<string | null, RawMenuItem[]>();
  for (const item of filtered) {
    const key = item.parent_id && filtered.some((p) => p.id === item.parent_id)
      ? item.parent_id
      : null;
    const list = byParent.get(key) ?? [];
    list.push(item);
    byParent.set(key, list);
  }

  const toNode = (item: RawMenuItem): ResolvedNavItem => ({
    id: item.id,
    label: item.title,
    href: menuHref(item, locale),
    external: item.menu_type === "external",
    openInNewTab: item.open_in_new_tab,
    children: (byParent.get(item.id) ?? []).map(toNode),
  });

  return (byParent.get(null) ?? []).map(toNode);
}

export function navbarItems(items: RawMenuItem[], locale: Locale): ResolvedNavItem[] {
  return buildMenuTree(items, locale, "show_in_navbar");
}

export function footerItems(items: RawMenuItem[], locale: Locale): ResolvedNavItem[] {
  return buildMenuTree(items, locale, "show_in_footer");
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
      model: "Model",
      off: "diskon",
      priceNote: "Harga dalam rupiah per 1 juta token, sudah termasuk margin layanan.",
    },
    docs: {
      eyebrow: "Dokumentasi",
      title: "Mulai membangun dalam beberapa menit.",
      description: "Panduan AI API yang sesuai endpoint {brand} serta alur awal penggunaan VPS.",
    },
    partners: { title: "Didukung teknologi terpercaya" },
    faq: {
      eyebrow: "FAQ",
      title: "Pertanyaan yang sering diajukan",
      description: "Jawaban singkat tentang VPS, AI API, dan cara memulai.",
    },
    blog: {
      eyebrow: "Blog",
      title: "Wawasan terbaru",
      description: "Panduan, pengumuman produk, dan praktik terbaik dari tim kami.",
      readMore: "Baca selengkapnya",
      all: "Lihat semua artikel",
    },
    changelog: {
      eyebrow: "Changelog",
      title: "Apa yang baru",
      description: "Pembaruan produk dan perbaikan terbaru.",
    },
    testimonials: {
      tag: "Testimoni",
      title: "Dipercaya Developer & Tim",
      primary: "Mulai sekarang",
      secondary: "Lihat Harga",
    },
    contact: {
      title: "Hubungi kami",
      phones: "Telepon",
      emails: "Email",
      socials: "Sosial",
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
      model: "Model",
      off: "off",
      priceNote: "Prices in rupiah per 1M tokens, service margin included.",
    },
    docs: {
      eyebrow: "Documentation",
      title: "Start building in minutes.",
      description: "AI API guidance matching {brand}'s live endpoints plus a practical VPS getting-started flow.",
    },
    partners: { title: "Powered by trusted technology" },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      description: "Quick answers about VPS, AI API, and how to get started.",
    },
    blog: {
      eyebrow: "Blog",
      title: "Latest insights",
      description: "Guides, product announcements, and best practices from our team.",
      readMore: "Read more",
      all: "View all articles",
    },
    changelog: {
      eyebrow: "Changelog",
      title: "What's new",
      description: "Latest product updates and improvements.",
    },
    testimonials: {
      tag: "Testimonials",
      title: "Trusted by Developers & Teams",
      primary: "Get started",
      secondary: "View Pricing",
    },
    contact: {
      title: "Contact us",
      phones: "Phone",
      emails: "Email",
      socials: "Social",
    },
    common: { loading: "Loading...", copy: "Copy", copied: "Copied", getStarted: "Get started" },
  },
} as const;
