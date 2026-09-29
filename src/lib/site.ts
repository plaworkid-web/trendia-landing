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
  process.env.NEXT_PUBLIC_CONTACT_URL || "mailto:support@plapod.web.id";

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
  // `static` used to fall through to the home page. The landing site has no renderer
  // for CMS-stored page content, so a static menu with a route_path silently linked
  // to "/" — measured on the footer's Privacy and Terms entries, which pointed at the
  // home page while the pages themselves existed at /privacy and /terms. If a route is
  // set, honour it whatever the type: a route is a route.
  if (item.route_path && (item.menu_type === "internal" || item.menu_type === "static")) {
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
      // Shown while the VPS launch gate is off. The copy must not promise a product that is
      // not on sale, so this is a separate set of strings rather than the same words with the
      // VPS parts stripped — stripping leaves sentences about "infrastructure" that no longer
      // mean anything.
      aiOnly: {
        badge: "Satu endpoint untuk semua model AI",
        title: "AI API Platform",
        titleLine2: "Untuk Developer Modern",
        description: "Akses berbagai model AI terkemuka lewat satu endpoint yang kompatibel dengan OpenAI, dengan harga per model yang terbuka dan saldo berbasis kredit.",
        primary: "Lihat Paket AI",
        secondary: "Jelajahi Model",
      },
    },
    integrations: {
      title: "Satu API, Semua Model AI Terdepan",
      description: "Akses model dari OpenAI, Anthropic, Google, Meta, Mistral, dan provider lain melalui endpoint yang kompatibel dengan OpenAI.",
      action: "Lihat Katalog Model",
    },
    pricing: {
      title: "Pilih Paket yang Anda Butuhkan",
      description: "Paket AI berbasis kredit untuk setiap tahap pengembangan, dengan harga per model yang terbuka.",
      vps: "VPS Hosting",
      ai: "AI API",
    },
    models: {
      title: "Semua model, satu endpoint.",
      description: "Bandingkan context window serta harga input dan output antar model — dikelompokkan per keluarga model.",
      search: "Cari model...",
      all: "Semua keluarga model",
      empty: "Belum ada model aktif.",
      unavailable: "Katalog model belum dapat dimuat.",
      input: "Input / 1M",
      output: "Output / 1M",
      context: "Context",
      copy: "Salin ID model",
      model: "Model",
      off: "diskon",
      multiplier: "pengali",
      priceNote:
        "Harga dalam rupiah per 1 juta token, sudah termasuk margin layanan. Model dengan pengali lebih besar menghabiskan token lebih cepat, dan harga di atas sudah termasuk pengali itu.",
    },
    legal: {
      updated: "Terakhir diperbarui",
      draftNotice:
        "Draf ini belum ditinjau ahli hukum. Bagian bertanda [ISI: ...] perlu Anda lengkapi sebelum dipublikasikan.",
      contactPlaceholder: "[ISI: alamat email resmi Anda]",
      addressPlaceholder: "[ISI: alamat terdaftar perusahaan]",
      jurisdictionPlaceholder: "[ISI: kota/negara hukum yang berlaku]",
    },
    docs: {
      title: "Mulai membangun dalam beberapa menit.",
      description: "Panduan AI API: endpoint {brand}, alur awal, dan contoh pemakaian.",
    },
    partners: { title: "Didukung teknologi terpercaya" },
    faq: {
      title: "Pertanyaan yang sering diajukan",
      description: "Jawaban singkat tentang AI API dan cara memulai.",
    },
    blog: {
      title: "Wawasan terbaru",
      description: "Panduan, pengumuman produk, dan praktik terbaik dari tim kami.",
      readMore: "Baca selengkapnya",
      all: "Lihat semua artikel",
    },
    changelog: {
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
      aiOnly: {
        badge: "One endpoint for every AI model",
        title: "AI API Platform",
        titleLine2: "For Modern Developers",
        description: "Reach leading AI models through one OpenAI-compatible endpoint, with per-model pricing in the open and credit-based balance.",
        primary: "See AI Plans",
        secondary: "Explore Models",
      },
    },
    integrations: {
      title: "One API, Every Leading AI Model",
      description: "Access models from OpenAI, Anthropic, Google, Meta, Mistral, and other providers through one OpenAI-compatible endpoint.",
      action: "Browse Model Catalog",
    },
    pricing: {
      title: "Choose the Plan You Need",
      description: "Credit-based AI packages for every stage of development, with per-model pricing in the open.",
      vps: "VPS Hosting",
      ai: "AI API",
    },
    models: {
      title: "Every model, one endpoint.",
      description: "Compare context windows and input/output pricing across models, grouped by model family.",
      search: "Search models...",
      all: "All model families",
      empty: "No active models yet.",
      unavailable: "The model catalog is currently unavailable.",
      input: "Input / 1M",
      output: "Output / 1M",
      context: "Context",
      copy: "Copy model ID",
      model: "Model",
      off: "off",
      multiplier: "multiplier",
      priceNote:
        "Prices in rupiah per 1M tokens, service margin included. A model with a larger multiplier drains tokens faster, and the price above already includes it.",
    },
    legal: {
      updated: "Last updated",
      draftNotice:
        "This draft has not been reviewed by a lawyer. Sections marked [FILL IN: ...] must be completed before publication.",
      contactPlaceholder: "[FILL IN: your official contact email]",
      addressPlaceholder: "[FILL IN: your registered company address]",
      jurisdictionPlaceholder: "[FILL IN: governing city/country]",
    },
    docs: {
      title: "Start building in minutes.",
      description: "AI API guidance: {brand}'s live endpoints, a getting-started flow, and working examples.",
    },
    partners: { title: "Powered by trusted technology" },
    faq: {
      title: "Frequently asked questions",
      description: "Quick answers about the AI API and how to get started.",
    },
    blog: {
      title: "Latest insights",
      description: "Guides, product announcements, and best practices from our team.",
      readMore: "Read more",
      all: "View all articles",
    },
    changelog: {
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

/**
 * Is the VPS product line on sale?
 *
 * One place decides, because VPS is mentioned on eight different surfaces (navbar, footer,
 * hero, product showcase, CTA, testimonial copy, the /vps page, the pricing page) and a
 * half-hidden product is worse than a visible one: a customer who follows a link to a page
 * with no plans reads it as a broken site, not as "not launched yet".
 *
 * Defaults to VISIBLE when the setting is missing, so a failed settings fetch cannot hide a
 * product the operator is selling. Hiding must be explicit.
 */
export function vpsVisible(appSettings?: { vps_storefront_enabled?: boolean } | null): boolean {
  return appSettings?.vps_storefront_enabled !== false;
}
