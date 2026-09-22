import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/landing/legal-page";
import { fetchAppSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchAppSettings();
  const brand = settings?.app_name ?? "Plapod";
  return {
    title: `Privacy Policy | ${brand}`,
    description: `How ${brand} collects, uses, and protects your data.`,
    alternates: { canonical: "/en/privacy", languages: { "id-ID": "/privacy", "en-US": "/en/privacy" } },
  };
}

export default function Page() {
  const sections: LegalSection[] = [
    {
      heading: "1. Data we collect",
      body: [
        "Account data: name, email address, and a password stored as a hash.",
        "Billing data: balance, transaction history, and payment method. We do not store card numbers; payment processing is handled by our payment provider.",
        "Usage data: token counts, the model used, timestamps, and the status code of each request. This is used to bill you and to show your usage.",
        "Request content: prompts and model output are processed to produce a response. See section 3 about forwarding to third parties.",
        "Technical data: IP address, device type, and access logs for security and abuse prevention.",
      ],
    },
    {
      heading: "2. Why we use it",
      body: [
        "We use your data to provide the service, calculate charges, keep the platform secure, and meet legal obligations.",
        "We do not sell your personal data to third parties.",
        "We do not use your prompt content to train our own models.",
      ],
    },
    {
      heading: "3. Forwarding to model providers",
      body: [
        "To generate a response, your request is forwarded to a third-party AI model provider. Your prompt therefore leaves our infrastructure.",
        "Do not send sensitive personal data, trade secrets, or data protected by specific regulations through this API.",
        "The third party's own policy governs processing on their side.",
      ],
    },
    {
      heading: "4. Storage and security",
      body: [
        "Passwords are stored as a hash. API keys are stored as a hash and shown only once at creation.",
        "All data in transit is protected with HTTPS.",
        "Data is kept while your account is active. After closure it is deleted or anonymised, except where we must retain it for accounting and legal purposes.",
      ],
    },
    {
      heading: "5. Your rights",
      body: [
        "You may request a copy, correction, or deletion of your personal data.",
        "You can export your usage history from the dashboard.",
        "Send requests to the contact in section 7. We respond within a reasonable period.",
      ],
    },
    {
      heading: "6. Cookies",
      body: [
        "We use cookies strictly necessary to keep your login session. Without them you cannot sign in to the dashboard.",
        "We do not use third-party advertising cookies on this page.",
      ],
    },
    {
      heading: "7. Contact",
      body: [
        "Privacy questions: [FILL IN: your official contact email]",
        "Registered address: [FILL IN: your registered company address]",
      ],
    },
    {
      heading: "8. Changes",
      body: [
        "We may update this policy. Material changes will be announced by email or a dashboard notice.",
      ],
    },
  ];

  return (
    <LegalPage
      locale="en"
      eyebrow="Legal"
      title="Privacy Policy"
      updated="[FILL IN: effective date]"
      intro="This page explains what data we collect when you use this service, why we collect it, and what rights you have over it."
      sections={sections}
    />
  );
}
