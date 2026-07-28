import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import type { MenuItem, CompanyProfile } from "@/types/landing";

interface FooterProps {
  menuItems: MenuItem[];
  company: CompanyProfile | null;
  appName: string;
}

const footerLinks = {
  Products: [
    { title: "VPS Hosting", href: "#vps-plans" },
    { title: "AI API", href: "#ai-plans" },
    { title: "AI-Optimized VPS", href: "#features" },
    { title: "Pricing", href: "#vps-plans" },
  ],
  Resources: [
    { title: "Documentation", href: "/docs" },
    { title: "API Reference", href: "/docs/api" },
    { title: "Blog", href: "/blog" },
    { title: "Changelog", href: "/changelog" },
  ],
  Company: [
    { title: "About Us", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Support", href: "/support" },
    { title: "Status", href: "/status" },
  ],
  Legal: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "SLA", href: "/sla" },
  ],
};

const socialIcons: Record<string, string> = {
  whatsapp: "WhatsApp",
  twitter: "Twitter",
  x: "X",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  github: "GitHub",
  youtube: "YouTube",
  telegram: "Telegram",
  discord: "Discord",
};

export function Footer({ menuItems, company, appName }: FooterProps) {
  const footerMenuItems = menuItems.filter(
    (item) => item.show_in_footer && !item.parent_id
  );
  const year = new Date().getFullYear();
  const companyName = company?.company_name || appName;

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight">
              {companyName}
            </Link>
            {company?.tagline && (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {company.tagline}
              </p>
            )}
            {/* Contacts */}
            {company?.emails && company.emails.length > 0 && (
              <div className="mt-4 space-y-1">
                {company.emails.map((email, i) => (
                  <a
                    key={i}
                    href={`mailto:${email.email}`}
                    className="block text-sm text-muted-foreground hover:text-foreground"
                  >
                    {email.email}
                  </a>
                ))}
              </div>
            )}
            {company?.phones && company.phones.length > 0 && (
              <div className="mt-2 space-y-1">
                {company.phones.map((phone, i) => (
                  <a
                    key={i}
                    href={`tel:${phone.number}`}
                    className="block text-sm text-muted-foreground hover:text-foreground"
                  >
                    {phone.number}
                  </a>
                ))}
              </div>
            )}
            {/* Socials */}
            {company?.socials && company.socials.length > 0 && (
              <div className="mt-4 flex gap-3">
                {company.socials.map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                    title={social.label || socialIcons[social.platform] || social.platform}
                  >
                    {social.label || socialIcons[social.platform] || social.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dynamic menu items from backend in footer */}
        {footerMenuItems.length > 0 && (
          <>
            <Separator className="my-8" />
            <div className="flex flex-wrap gap-4">
              {footerMenuItems.map((item) => (
                <Link
                  key={item.id}
                  href={
                    item.menu_type === "external" && item.url
                      ? item.url
                      : item.route_path || "#"
                  }
                  target={item.open_in_new_tab ? "_blank" : undefined}
                  rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </>
        )}

        <Separator className="my-8" />
        <p className="text-center text-sm text-muted-foreground">
          &copy; {year} {companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
