import ResponsiveHeroBanner from "@/components/ui/responsive-hero-banner";

export function Hero() {
  return (
    <ResponsiveHeroBanner
      badgeLabel="New"
      badgeText="High-Performance Cloud Infrastructure"
      title="VPS & AI Platform"
      titleLine2="For Modern Developers"
      description="Deploy blazing-fast virtual servers and access cutting-edge AI models through a single, unified platform. Scale your infrastructure and intelligence on demand."
      primaryButtonText="Explore VPS Plans"
      primaryButtonHref="#vps-plans"
      secondaryButtonText="Try AI API"
      secondaryButtonHref="#ai-plans"
      ctaButtonText="Get Started"
      ctaButtonHref="/register"
      partnersTitle="Trusted by developers & teams worldwide"
      navLinks={[
        { label: "Features", href: "#features" },
        { label: "VPS", href: "#vps-plans" },
        { label: "AI API", href: "#ai-plans" },
        { label: "FAQ", href: "#faq" },
      ]}
    />
  );
}
