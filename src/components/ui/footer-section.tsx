'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Briefcase, Camera, MessageCircle, Play } from 'lucide-react';
import {
	footerItems,
	localizedPath,
	portalUrl,
	type Locale,
	type ResolvedNavItem,
} from '@/lib/site';
import type { AppSettings, CompanyProfile, MenuItem } from '@/types/landing';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
	facebook: MessageCircle,
	instagram: Camera,
	youtube: Play,
	youtubecom: Play,
	linkedin: Briefcase,
};

function socialIcon(platform: string) {
	const key = platform.toLowerCase().replace(/[^a-z]/g, '');
	return SOCIAL_ICONS[key];
}

function getDefaultSections(locale: Locale): FooterSection[] {
	const isId = locale === 'id';
	return [
		{
			label: isId ? 'Produk' : 'Product',
			links: [
				{ title: 'VPS', href: localizedPath(locale, '/vps') },
				{ title: isId ? 'Model AI' : 'AI Models', href: localizedPath(locale, '/models') },
				{ title: isId ? 'Harga' : 'Pricing', href: localizedPath(locale, '/pricing') },
				{ title: isId ? 'Dokumentasi' : 'Docs', href: localizedPath(locale, '/docs') },
			],
		},
		{
			label: isId ? 'Akun' : 'Account',
			links: [
				{ title: isId ? 'Daftar' : 'Register', href: `${portalUrl}/register` },
				{ title: isId ? 'Masuk' : 'Sign in', href: `${portalUrl}/login` },
				{ title: 'Dashboard', href: `${portalUrl}/dashboard` },
			],
		},
		{
			label: isId ? 'Panduan' : 'Guides',
			links: [
				{ title: 'OpenAI SDK', href: `${localizedPath(locale, '/docs')}#openai-sdk` },
				{ title: 'Chat Completions', href: `${localizedPath(locale, '/docs')}#chat` },
				{ title: 'VPS Quickstart', href: `${localizedPath(locale, '/docs')}#vps` },
			],
		},
	];
}

function buildSections(
	menuItems: MenuItem[],
	locale: Locale,
	company: CompanyProfile | null | undefined,
	isId: boolean,
): FooterSection[] {
	const managed = footerItems(menuItems, locale);
	const sections: FooterSection[] = [];

	if (managed.length > 0) {
		sections.push({
			label: isId ? 'Tautan' : 'Links',
			links: flattenMenu(managed),
		});
		sections.push({
			label: isId ? 'Akun' : 'Account',
			links: [
				{ title: isId ? 'Daftar' : 'Register', href: `${portalUrl}/register` },
				{ title: isId ? 'Masuk' : 'Sign in', href: `${portalUrl}/login` },
				{ title: 'Dashboard', href: `${portalUrl}/dashboard` },
			],
		});
	} else {
		sections.push(...getDefaultSections(locale));
	}

	const contactLinks: FooterLink[] = [];
	for (const phone of company?.phones ?? []) {
		contactLinks.push({ title: phone.number, href: `tel:${phone.number.replace(/\s/g, '')}` });
	}
	for (const email of company?.emails ?? []) {
		contactLinks.push({ title: email.email, href: `mailto:${email.email}` });
	}
	if (contactLinks.length > 0) {
		sections.push({ label: isId ? 'Kontak' : 'Contact', links: contactLinks });
	}

	const socialLinks: FooterLink[] = (company?.socials ?? []).map((social) => ({
		title: social.label || social.platform,
		href: social.url,
		icon: socialIcon(social.platform),
	}));
	if (socialLinks.length > 0) {
		sections.push({ label: isId ? 'Sosial' : 'Social', links: socialLinks });
	}

	return sections;
}

function flattenMenu(items: ResolvedNavItem[]): FooterLink[] {
	const links: FooterLink[] = [];
	const walk = (nodes: ResolvedNavItem[]) => {
		for (const node of nodes) {
			links.push({ title: node.label, href: node.href });
			if (node.children.length) walk(node.children);
		}
	};
	walk(items);
	return links;
}

export function Footer({
	locale = 'id',
	appSettings,
	menuItems = [],
	company,
}: {
	locale?: Locale;
	appSettings?: AppSettings | null;
	menuItems?: MenuItem[];
	company?: CompanyProfile | null;
}) {
	const isId = locale === 'id';
	const footerLinks = buildSections(menuItems, locale, company, isId);
	const brandName = appSettings?.app_name || 'Trendia';
	const tagline = company?.tagline;
	return (
		<footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16">
			<div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

			<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
				<AnimatedContainer className="space-y-4">
					<a href={localizedPath(locale)} className="inline-flex items-center" aria-label={brandName}>
						{appSettings?.logo_dark_url && (
							<Image src={appSettings.logo_dark_url} alt={brandName} width={210} height={56} style={{ width: 'auto' }} className="hidden h-14 w-auto dark:block" />
						)}
						{appSettings?.logo_light_url && (
							<Image src={appSettings.logo_light_url} alt={brandName} width={210} height={56} style={{ width: 'auto' }} className="block h-14 w-auto dark:hidden" />
						)}
						{!appSettings?.logo_light_url && !appSettings?.logo_dark_url && (
							<span className="type-h3">{brandName}</span>
						)}
					</a>
					{tagline && (
						<p className="text-muted-foreground max-w-xs text-sm">{tagline}</p>
					)}
					{/* Operator-editable text from Settings → General. NULL keeps the built-in
					    default; {year} and {app_name} are substituted here so one string can
					    carry the year without being rewritten every January. */}
					<p className="text-muted-foreground mt-8 text-sm md:mt-0">
						{(appSettings?.copyright_text?.trim() ||
							'© {year} {app_name}. All rights reserved.')
							.replace(/\{year\}/g, String(new Date().getFullYear()))
							.replace(/\{app_name\}/g, brandName)}
					</p>
				</AnimatedContainer>

				<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<p className="type-caption font-medium">{section.label}</p>
								<ul className="text-muted-foreground mt-4 space-y-2 text-sm">
									{section.links.map((link) => (
										<li key={`${link.title}-${link.href}`}>
											<a
												href={link.href}
												target={link.href.startsWith('http') ? '_blank' : undefined}
												rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
												className="hover:text-foreground inline-flex items-center transition-all duration-300"
											>
												{link.icon && <link.icon className="me-1 size-4" />}
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>
		</footer>
	);
};

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
};
