export interface MenuItem {
  id: string;
  title: string;
  menu_type: "external" | "internal" | "static";
  url: string | null;
  route_path: string | null;
  parent_id: string | null;
  sort_order: number;
  show_in_navbar: boolean;
  show_in_footer: boolean;
  open_in_new_tab: boolean;
  icon: string | null;
  css_class: string | null;
}

export interface HighlightPoint {
  icon: string;
  title: string;
  description: string;
}

export interface Highlight {
  id: string;
  title: string;
  subtitle: string | null;
  body_text: string | null;
  image_url: string | null;
  image_position: "left" | "right";
  points: HighlightPoint[] | null;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  position: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  video_url: string | null;
  sort_order: number;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category: BlogCategory | null;
  status: string;
  is_featured: boolean;
  published_at: string | null;
  created_at: string | null;
}

export interface CompanyProfile {
  id: string;
  company_name: string;
  tagline: string | null;
  phones: Array<{ label: string; number: string }> | null;
  emails: Array<{ label: string; email: string }> | null;
  socials: Array<{ platform: string; url: string; label: string }> | null;
}

export interface CompanySection {
  id: string;
  title: string;
  content: string | null;
  sort_order: number;
}

export interface Changelog {
  id: string;
  version: string;
  title: string;
  content: string | null;
  release_date: string | null;
  change_type: "feature" | "bugfix" | "improvement" | "breaking";
  is_highlighted: boolean;
}

export interface AiPlanPrice {
  id: string;
  currency_code: string;
  price: number;
  setup_fee: number;
  overage_price_per_1m: number | null;
}

export interface AiPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  description_en: string | null;
  plan_type: string;
  token_quota: number | null;
  credit_quota: number | null;
  trial_credits: number | null;
  duration_days: number;
  rate_limit_rpm: number;
  rate_limit_tpm: number;
  max_concurrent_requests: number;
  overage_policy: string;
  is_featured: boolean;
  is_trial: boolean;
  trial_duration_days: number | null;
  sort_order: number;
  features: string[] | null;
  features_en: string[] | null;
  prices: AiPlanPrice[];
  /** Price after an active automatic discount; null when there is none. */
  effective_price: number | null;
  discount_percent: number | null;
  discount_label: string | null;
  /** Model ids the plan includes; null means unrestricted (Enterprise). */
  allowed_models: string[] | null;
  allowed_models_count: number | null;
}

export interface AiModelPrice {
  currency_code: "IDR" | "USD";
  input_price_per_1m: number;
  output_price_per_1m: number;
  /** True when derived from IDR at the active rate, not a stored price. */
  converted?: boolean;
}

export interface AiModel {
  id: string;
  model_id: string;
  display_name: string;
  description: string | null;
  provider_name: string | null;
  provider_slug: string | null;
  provider_logo_url: string | null;
  category: string;
  context_window: number | null;
  max_output_tokens: number | null;
  supports_streaming: boolean;
  supports_vision: boolean;
  supports_function_calling: boolean;
  supports_json_mode: boolean;
  status: string;
  deprecation_notice: string | null;
  is_featured: boolean;
  sort_order: number;
  prices: AiModelPrice[];
  /** Brand family for grouping (Claude, DeepSeek, GPT, ...). Never the supplier. */
  family_slug?: string;
  family_label?: string;
  /** Effective discount percent on this model, when a promotion applies. */
  discount_percent?: number;
  /**
   * How much faster this model drains a token balance, when the platform prices by
   * multiplier. 1 under the per-model scheme, where each model already has its own price.
   * Published so a reader sees WHY a model costs more per token instead of an unexplained
   * number.
   */
  token_multiplier?: number;
}

export type VpsPlanType = "general" | "compute" | "memory" | "gpu";

export interface VpsPlanPrice {
  id?: string;
  currency_code: "IDR" | "USD" | string;
  billing_period: "monthly" | "yearly" | string;
  price: number;
  original_price: number | null;
  setup_fee: number;
}

export interface VpsPlan {
  id: string;
  name: string;
  slug: string;
  plan_type: VpsPlanType | string;
  description: string | null;
  description_en: string | null;
  vcpu: number;
  ram_gb: number;
  storage_gb: number;
  storage_type: string;
  /** Traffic quota in TB; null means unmetered. */
  bandwidth_tb: number | null;
  network_mbps: number;
  region: string;
  os_options: string[] | null;
  features: string[] | null;
  badge: string | null;
  cta_label: string | null;
  cta_url: string | null;
  is_featured: boolean;
  sort_order: number;
  prices: VpsPlanPrice[];
}

export interface AppSettings {
  app_name: string;
  app_description: string | null;
  app_url: string | null;
  logo_mini_url: string | null;
  favicon_url: string | null;
  logo_dark_url: string | null;
  logo_light_url: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  // Operator-editable footer text. NULL means the built-in default; the tokens
  // {year} and {app_name} are substituted at render.
  copyright_text?: string | null;
  maintenance_mode: boolean;
}

export interface AppearanceSettings {
  default_mode: "dark" | "light" | "system";
  glassmorphism_enabled: boolean;
  background_mode: "gradient" | "flat";
  colors: Record<string, string> | null;
}

export interface LandingData {
  menu_items: MenuItem[];
  highlights: Highlight[];
  testimonials: Testimonial[];
  partners: Partner[];
  faqs: Faq[];
  blog_posts: BlogPost[];
  company: CompanyProfile | null;
  company_sections: CompanySection[];
  changelogs: Changelog[];
}
