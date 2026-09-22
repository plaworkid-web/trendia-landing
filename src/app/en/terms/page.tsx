import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/landing/legal-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Plapod";
  return {
    title: `Terms & Conditions | ${brand}`,
    description: `Terms of use for the ${brand} service.`,
    alternates: { canonical: "/en/terms", languages: { "id-ID": "/terms", "en-US": "/en/terms" } },
  };
}

export default function Page() {
  const sections: LegalSection[] = [
    {
      heading: "1. Accepting these terms",
      body: [
        "By creating an account or using this service you agree to these terms. If you do not agree, do not use the service.",
        "If you register on behalf of an organisation, you confirm you are authorised to represent it.",
      ],
    },
    {
      heading: "2. Your account",
      body: [
        "You are responsible for keeping your password and API keys secret.",
        "All activity carried out with your API key is treated as your activity.",
        "Tell us immediately if you suspect your API key has leaked, so we can revoke it.",
      ],
    },
    {
      heading: "3. Prohibited use",
      body: [
        "- Breaking applicable law, including distributing illegal content.",
        "- Generating spam, malware, or cyber attacks.",
        "- Accessing the service in a way that harms availability for other users.",
        "- Creating multiple accounts to evade limits or farm promotional credit.",
        "- Reselling access without a written agreement with us.",
      ],
    },
    {
      heading: "4. Balance, billing, and refunds",
      body: [
        "AI usage is billed by tokens consumed at the rates published in the catalogue. The rate that applies is the one in force when the request is processed.",
        "Credit already consumed is not refundable.",
        "Billing errors proven to be caused by a fault in our system will be corrected.",
        "Refunds for unused balance are governed by [FILL IN: your refund policy].",
      ],
    },
    {
      heading: "5. Service availability",
      body: [
        "We work to keep the service available but do not guarantee it will be uninterrupted.",
        "Third-party models may change, be restricted, or be retired by their provider. We may discontinue support for a model with notice.",
        "We are not liable for losses caused by disruption outside our control.",
      ],
    },
    {
      heading: "6. Intellectual property",
      body: [
        "You retain rights to the content you submit and the output you receive, to the extent permitted by law and by the model provider's terms.",
        "You are responsible for ensuring you have the right to use the content you submit.",
      ],
    },
    {
      heading: "7. Limitation of liability",
      body: [
        "The service is provided as is. To the extent permitted by law, our liability is limited to the amount you paid in the last [FILL IN: period, e.g. 3 months].",
      ],
    },
    {
      heading: "8. Termination",
      body: [
        "You may close your account at any time from the dashboard.",
        "We may suspend or close accounts that breach these terms, with notice where possible.",
      ],
    },
    {
      heading: "9. Governing law",
      body: [
        "These terms are governed by the laws of [FILL IN: governing city/country].",
        "Disputes are resolved through [FILL IN: your dispute resolution route].",
      ],
    },
    {
      heading: "10. Contact",
      body: [
        "Questions about these terms: [FILL IN: your official contact email]",
      ],
    },
  ];

  return (
    <LegalPage
      locale="en"
      eyebrow="Legal"
      title="Terms & Conditions"
      updated="[FILL IN: effective date]"
      intro="These terms govern your use of the AI and infrastructure services we provide."
      sections={sections}
    />
  );
}
