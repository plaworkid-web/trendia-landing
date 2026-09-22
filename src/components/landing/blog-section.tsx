import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types/landing";
import { copy, localizedPath, type Locale } from "@/lib/site";

function formatDate(value: string | null, locale: Locale) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function BlogSection({ posts, locale }: { posts: BlogPost[]; locale: Locale }) {
  const t = copy[locale].blog;
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="section-shell">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="type-eyebrow">{t.eyebrow}</p>
          <h2 className="type-h2 mt-2">{t.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t.description}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="glass-card group flex flex-col overflow-hidden rounded-2xl">
              {post.featured_image_url && (
                <div className="relative aspect-16/9 overflow-hidden">
                  <Image
                    src={post.featured_image_url}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {post.category && <span className="font-medium text-primary">{post.category.name}</span>}
                  {post.published_at && <span>{formatDate(post.published_at, locale)}</span>}
                </div>
                <h3 className="mt-2 type-h3">{post.title}</h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t.readMore}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href={localizedPath(locale, "/blog")} className="text-sm font-medium text-primary hover:underline">
            {t.all}
          </Link>
        </div>      </div>
    </section>
  );
}
