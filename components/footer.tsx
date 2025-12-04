import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/dist/client/link";
import { CategoryType } from "./home-widgets/featured-products-section";
import { productCategoriesDemo } from "@/sanity/lib/demo";

interface LinkGroup {
	title: string;
	links: { label: string; href: string; target?: string }[];
}

export function Footer({ categories }: { categories?: CategoryType[] }) {
	const productCategories = (categories ?? productCategoriesDemo ?? []).map(
		category => ({
			label: category.title,
			href: `/products?category=${category.slug}`,
		})
	);

	const linkGroups: LinkGroup[] = [
		// {
		// 	title: "Solutions",
		// 	links: [
		// 		{ label: "Lighting Control", href: "#" },
		// 		{ label: "HVAC Control", href: "#" },
		// 		{ label: "Energy Analytics", href: "#" },
		// 		{ label: "Integration Services", href: "#" },
		// 	],
		// },
		{
			title: "Company",
			links: [
				{ label: "About Us", href: "/about" },
				{ label: "Case Studies", href: "/#projects" },
				{
					label: "Support",
					href: "https://illumra.freshdesk.com/support/home",
					target: "_blank",
				},
				{ label: "Contact", href: "/contact" },
			],
		},
		{
			title: "Products",
			links:
				productCategories.map(category => ({
					label: category?.label ?? "",
					href: `/products?category=${category.label}`,
				})) ?? [],
		},
	];

	const legalLinks = [
		{ label: "Privacy Policy", href: "#" },
		{ label: "Terms of Service", href: "#" },
	];
	return (
		<footer className="py-12 bg-accent-foreground text-white border-t border-border">
			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-3 gap-12 mb-8">
					<div>
						<Link href="/">
							<Image
								src="/logo-white.png"
								alt="Logo"
								height={40}
								width={120}
								className="h-10 w-auto mb-4"
								priority
							/>
						</Link>
						<p className="text-sm text-inherit mb-4">
							Advanced wireless control solutions for commercial and industrial
							environments.
						</p>
						<p className="text-sm text-inherit mb-4">Lindon, UT</p>
					</div>
					{linkGroups.map(group => (
						<div key={group.title}>
							<h4 className="font-semibold mb-4">{group.title}</h4>
							<ul className="space-y-2 text-sm text-inherit">
								{group.links.map(link => (
									<li key={link.label}>
										<Link
											href={link.href}
											target={link.target ?? undefined}
											rel="noopener noreferrer"
											className="hover:text-primary transition-colors"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<Separator className="mb-8" />
				<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-inherit">
					<p>© {new Date().getFullYear()} Illumra. All rights reserved.</p>
					<div className="flex gap-6">
						{legalLinks.map(link => (
							<a
								key={link.label}
								href={link.href}
								className="hover:text-primary transition-colors"
							>
								{link.label}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
