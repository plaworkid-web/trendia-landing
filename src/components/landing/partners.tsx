import Image from "next/image";
import type { Partner } from "@/types/landing";
import type { Locale } from "@/lib/site";
import { copy } from "@/lib/site";

export function Partners({ partners, locale }: { partners: Partner[]; locale: Locale }) {
  if (partners.length === 0) return null;

  const seen = new Set<string>();
  const unique = partners.filter((partner) => {
    const key = partner.name.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <section className="border-y border-border/40 py-14">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {copy[locale].partners.title}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {unique.map((partner) => (
            <div key={partner.id} className="flex items-center gap-2 opacity-70 transition-opacity hover:opacity-100">
              {partner.logo_url ? (
                <Image
                  src={partner.logo_url}
                  alt={partner.name}
                  width={140}
                  height={36}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span className="text-base font-semibold tracking-tight text-muted-foreground">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
