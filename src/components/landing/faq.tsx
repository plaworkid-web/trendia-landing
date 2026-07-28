import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Faq } from "@/types/landing";

interface FaqSectionProps {
  faqs: Faq[];
}

const fallbackFaqs: Faq[] = [
  {
    id: "1",
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfer (BCA, Mandiri, BRI, BNI), e-wallets (GoPay, OVO, Dana), credit/debit cards, and cryptocurrency.",
    sort_order: 0,
  },
  {
    id: "2",
    question: "How quickly can I deploy a VPS?",
    answer:
      "VPS instances are provisioned automatically within 60 seconds after payment confirmation.",
    sort_order: 1,
  },
  {
    id: "3",
    question: "Can I upgrade my VPS plan later?",
    answer:
      "Yes, you can upgrade or downgrade your VPS plan at any time. Changes take effect immediately with prorated billing.",
    sort_order: 2,
  },
  {
    id: "4",
    question: "What AI models are available?",
    answer:
      "We support OpenAI GPT-4/4o, Anthropic Claude 3.5, Google Gemini Pro, Meta Llama 3, Mistral, and many more. New models are added regularly.",
    sort_order: 3,
  },
  {
    id: "5",
    question: "Is there a free trial for AI API?",
    answer:
      "Yes, all new accounts receive free trial credits to test any supported AI model before committing to a paid plan.",
    sort_order: 4,
  },
  {
    id: "6",
    question: "Do you provide managed AI VPS?",
    answer:
      "Yes, our AI-optimized VPS comes pre-configured with popular frameworks (PyTorch, TensorFlow, Ollama) and GPU support available on request.",
    sort_order: 5,
  },
  {
    id: "7",
    question: "What is your uptime guarantee?",
    answer:
      "We guarantee 99.9% uptime for all VPS and AI API services, backed by our SLA with service credits for any downtime.",
    sort_order: 6,
  },
];

export function FaqSection({ faqs }: FaqSectionProps) {
  const items = faqs.length > 0 ? faqs : fallbackFaqs;

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        {/* Accordion */}
        <Accordion defaultValue={[]} className="mt-12">
          {items.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
