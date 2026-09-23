import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

export function BlogPage({ posts, locale }: { posts: BlogPost[]; locale: Locale }) {
  const t = copy[locale].blog;

  return (
    <main className="section-shell">
      <div className="section-container">
        <Link
          href={localizedPath(locale, "/")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {copy[locale].nav.home}
        </Link>

        <div className="mx-auto mt-8 max-w-2xl text-center">
          <h1 className="type-h2">{t.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t.description}</p>
        </div>

        {posts.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">
            {locale === "id"
              ? "Belum ada artikel yang dipublikasikan."
              : "No articles have been published yet."}
          </p>
        ) : (
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
                    {post.category && (
                      <span className="font-medium text-primary">{post.category.name}</span>
                    )}
                    {post.published_at && <span>{formatDate(post.published_at, locale)}</span>}
                  </div>
                  <h2 className="mt-2 type-h3">{post.title}</h2>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
