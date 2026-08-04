import { fetchAiModels } from "@/lib/api";
import { ModelCatalog } from "@/components/landing/model-catalog";
import { PublicShell } from "@/components/landing/public-shell";
import { dummyAiModels } from "@/lib/dummy-models";
import type { Locale } from "@/lib/site";

export async function ModelsPage({ locale }: { locale: Locale }) {
  const models = await fetchAiModels();
  const catalog = models?.length ? models : dummyAiModels;

  return <PublicShell locale={locale}><ModelCatalog locale={locale} models={catalog} /></PublicShell>;
}
