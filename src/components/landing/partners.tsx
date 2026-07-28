import Image from "next/image";
import type { Partner } from "@/types/landing";

interface PartnersProps {
  partners: Partner[];
}

const fallbackPartners = [
  { id: "1", name: "Partner 1", logo_url: null, sort_order: 0 },
  { id: "2", name: "Partner 2", logo_url: null, sort_order: 1 },
  { id: "3", name: "Partner 3", logo_url: null, sort_order: 2 },
  { id: "4", name: "Partner 4", logo_url: null, sort_order: 3 },
  { id: "5", name: "Partner 5", logo_url: null, sort_order: 4 },
];

export function Partners({ partners }: PartnersProps) {
  const items = partners.length > 0 ? partners : fallbackPartners;

  if (items.length === 0) return null;

  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by developers & teams worldwide
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {items.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center grayscale opacity-60 transition-all hover:opacity-100 hover:grayscale-0"
            >
              {partner.logo_url ? (
                <Image
                  src={partner.logo_url}
                  alt={partner.name}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain sm:h-10"
                />
              ) : (
                <div className="flex h-10 items-center rounded-lg border border-border bg-muted px-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    {partner.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
