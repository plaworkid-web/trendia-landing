import type { LandingData, AiPlan, AppSettings, AppearanceSettings } from "@/types/landing";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function fetchApi<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchLandingData(): Promise<LandingData | null> {
  return fetchApi<LandingData>("/public/landing");
}

export async function fetchAiPlans(): Promise<AiPlan[]> {
  const data = await fetchApi<AiPlan[]>("/public/ai-plans");
  return data ?? [];
}

export async function fetchAppSettings(): Promise<AppSettings | null> {
  return fetchApi<AppSettings>("/admin/settings/public");
}

export async function fetchAppearance(): Promise<AppearanceSettings | null> {
  return fetchApi<AppearanceSettings>("/admin/appearance/public");
}
