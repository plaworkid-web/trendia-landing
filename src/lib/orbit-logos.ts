"use client";

/**
 * Brand marks for the hero orbit.
 *
 * The files live in object storage (`landing/orbit/<slug>.svg`), not in the bundle:
 * a logo set is content an operator will want to change without a redeploy, and the
 * bucket already serves the site's other uploads. Each mark is a monochrome SVG
 * drawn with `currentColor`, so the orbit tints them without a second copy per theme.
 *
 * Swapping one out is a one-line change here. Making the whole list operator-editable
 * (a CMS field) is the next step — the shape below is already the data a CMS would
 * write.
 */

/** The bucket's public base. Same host the site's other uploads are served from. */
const ORBIT_BASE = "https://nos.wjv-1.neo.id/lisanna/landing/orbit";

export interface OrbitLogo {
  /** File name in the bucket, without extension. */
  slug: string;
  /** Brand name, used as the accessible title. */
  label: string;
}

/** Outer ring: model makers — what the customer calls. */
export const OUTER_LOGOS: OrbitLogo[] = [
  { slug: "openai", label: "OpenAI" },
  { slug: "anthropic", label: "Anthropic" },
  { slug: "claude", label: "Claude" },
  { slug: "deepseek", label: "DeepSeek" },
  { slug: "googlegemini", label: "Google Gemini" },
  { slug: "meta", label: "Meta" },
  { slug: "mistralai", label: "Mistral AI" },
  { slug: "qwen", label: "Qwen" },
  { slug: "huggingface", label: "Hugging Face" },
];

/** Inner ring: infrastructure — where the workload runs. */
export const INNER_LOGOS: OrbitLogo[] = [
  { slug: "amazonwebservices", label: "Amazon Web Services" },
  { slug: "microsoftazure", label: "Microsoft Azure" },
  { slug: "googlecloud", label: "Google Cloud" },
  { slug: "tencentqq", label: "Tencent Cloud" },
  { slug: "nvidia", label: "NVIDIA" },
  { slug: "cloudflare", label: "Cloudflare" },
  { slug: "kubernetes", label: "Kubernetes" },
  { slug: "digitalocean", label: "DigitalOcean" },
];

export function orbitLogoUrl(slug: string): string {
  return `${ORBIT_BASE}/${slug}.svg`;
}
