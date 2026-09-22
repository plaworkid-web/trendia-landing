import { fetchAiModels, fetchAiPlans } from "@/lib/api";
import { AiServicePage } from "@/components/landing/ai-service-page";
import type { Locale } from "@/lib/site";

export async function AiPage({ locale }: { locale: Locale }) {
  const [plans, models] = await Promise.all([fetchAiPlans(), fetchAiModels()]);
  return (
    <AiServicePage
      locale={locale}
      plans={plans}
      models={models ?? []}
    />
  );
}
