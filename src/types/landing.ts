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
  prices: AiPlanPrice[];
}

export interface AiModelPrice {
  currency_code: "IDR" | "USD";
  input_price_per_1m: number;
  output_price_per_1m: number;
}

export interface AiModel {
  id: string;
  model_id: string;
  display_name: string;
  description: string | null;
  provider_name: string;
  provider_slug: string;
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
  maintenance_mode: boolean;
}

export interface AppearanceSettings {
  default_mode: "dark" | "light" | "system";
  glassmorphism_enabled: boolean;
  background_mode: "gradient" | "flat";
  colors: Record<string, unknown> | null;
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
