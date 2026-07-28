import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12 sm:py-20">
          {/* Decorative background */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Rocket className="size-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Supercharge Your Infrastructure?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
              Join thousands of developers who trust us for their VPS hosting and AI
              needs. Get started in under 2 minutes.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className={buttonVariants({
                  size: "lg",
                  className: "h-12 bg-white px-8 text-base text-primary hover:bg-white/90",
                })}
              >
                Get Started Free
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="/contact"
                className={buttonVariants({
                  variant: "link",
                  size: "lg",
                  className: "h-12 text-base text-primary-foreground/80 hover:text-primary-foreground",
                })}
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
