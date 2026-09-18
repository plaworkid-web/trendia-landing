import { fetchAiModels } from "@/lib/api";
import { ModelCatalog } from "@/components/landing/model-catalog";
import { PublicShell } from "@/components/landing/public-shell";
import type { Locale } from "@/lib/site";

export async function ModelsPage({ locale }: { locale: Locale }) {
  const models = (await fetchAiModels()) ?? [];
  return (
    <PublicShell locale={locale}>
      <ModelCatalog locale={locale} models={models} unavailable={models.length === 0} />
    </PublicShell>
  );
}
