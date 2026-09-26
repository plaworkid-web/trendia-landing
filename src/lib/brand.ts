/**
 * The local brand fallback.
 *
 * These values are hardcoded on purpose. The real source is
 * Settings → General in the CMS (`/admin/settings/public`), which the landing already reads. But
 * that endpoint is a network call that can fail, be slow, or return nulls — and when it does, the
 * site must still show the correct name and icon rather than a scaffold placeholder.
 *
 * It was not a theoretical gap: before this, a null `app_name` produced the title "VPS & AI
 * Platform", a null logo produced the word "Trendia", and `/favicon.ico` served the Next.js
 * scaffold icon (verified by md5 against `src/app/favicon.ico`).
 *
 * The files live in `public/brand/` and were downloaded from the CMS asset host, so the fallback is
 * the same artwork the database points at. Replacing them is a file copy, not a code change.
 *
 * When the database is populated these are only ever the fallback: the CMS value wins as soon as it
 * is present. Nothing here needs to change when the CMS is filled in.
 */

export const BRAND = {
  name: "Plapod",
  description: "Platform VPS hosting dan AI API untuk developer modern.",
  keywords: "VPS, AI, API, cloud, hosting, Plapod",
} as const;

/** Local copies, so a failed settings fetch never falls back to the Next.js scaffold icon. */
export const BRAND_ASSETS = {
  favicon: "/brand/favicon.png",
  faviconIco: "/brand/favicon.ico",
  logoDark: "/brand/logo-dark.png",
  logoLight: "/brand/logo-light.png",
  logoMini: "/brand/logo-mini.png",
} as const;

/**
 * Prefer the CMS value, fall back to the local copy.
 *
 * Blank strings count as missing: an operator who clears a field in the CMS expects the default
 * back, not an empty `src` that renders as a broken image.
 */
export function resolveBrandValue(
  fromCms: string | null | undefined,
  fallback: string,
): string {
  return fromCms?.trim() || fallback;
}
