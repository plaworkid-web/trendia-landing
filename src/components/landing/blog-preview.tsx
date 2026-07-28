import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types/landing";

interface BlogPreviewProps {
  posts: BlogPost[];
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const fallbackPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with AI API: A Complete Guide",
    slug: "getting-started-ai-api",
    excerpt:
      "Learn how to integrate our AI API into your application in under 5 minutes with practical examples.",
    featured_image_url: null,
    category: { id: "c1", name: "Tutorial", slug: "tutorial" },
    status: "published",
    is_featured: true,
    published_at: "2024-12-15T00:00:00Z",
    created_at: "2024-12-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Optimizing VPS Performance: Tips & Tricks",
    slug: "optimizing-vps-performance",
    excerpt:
      "Discover best practices to maximize your VPS performance for production workloads.",
    featured_image_url: null,
    category: { id: "c2", name: "Guide", slug: "guide" },
    status: "published",
    is_featured: false,
    published_at: "2024-12-10T00:00:00Z",
    created_at: "2024-12-10T00:00:00Z",
  },
  {
    id: "3",
    title: "Comparing AI Models: GPT-4 vs Claude vs Gemini",
    slug: "comparing-ai-models",
    excerpt:
      "An in-depth comparison of the top AI models available on our platform to help you choose the right one.",
    featured_image_url: null,
    category: { id: "c1", name: "Tutorial", slug: "tutorial" },
    status: "published",
    is_featured: false,
    published_at: "2024-12-05T00:00:00Z",
    created_at: "2024-12-05T00:00:00Z",
  },
];

export function BlogPreview({ posts }: BlogPreviewProps) {
  const items = posts.length > 0 ? posts : fallbackPosts;

  return (
    <section className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Blog
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Latest from Our Blog
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tips, tutorials, and updates from our engineering team.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((post) => (
            <Card
              key={post.id}
              className="group overflow-hidden transition-shadow hover:shadow-lg"
            >
              {/* Image */}
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                {post.featured_image_url ? (
                  <Image
                    src={post.featured_image_url}
                    alt={post.title}
                    width={600}
                    height={338}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                    <span className="text-4xl font-bold text-primary/20">
                      {post.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  {post.category && (
                    <Badge variant="secondary" className="text-xs">
                      {post.category.name}
                    </Badge>
                  )}
                  {post.published_at && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      {formatDate(post.published_at)}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read More
                  <ArrowRight className="size-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            View All Posts
            <ArrowRight className="ml-1 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
