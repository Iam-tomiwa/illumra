import Image from "next/image";
import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import PagesHero from "@/components/pages-hero";
import BecomeADistributor from "@/components/about/become-a-distributor";
import BecomeARep from "@/components/about/become-a-rep";
import PortableText from "@/components/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { aboutPageQuery } from "@/sanity/lib/queries";
import { aboutPageContent, companyInfo } from "@/sanity/lib/demo";
import type { PortableTextBlock } from "next-sanity";
import { AnimatedElement } from "@/components/animated-element";

type AboutPageQueryResult = {
	content?: {
		heroDescription?: string | null;
		paragraphs?: PortableTextBlock[] | null;
	} | null;
	companyInfo?: {
		overview?: PortableTextBlock[] | null;
		email?: string | null;
		phone?: string | null;
		headquarters?: string | null;
		satelliteOffice?: string | null;
	} | null;
};

export default async function AboutPage() {
	const aboutPage = (await sanityFetch({
		query: aboutPageQuery,
	})) as AboutPageQueryResult | null;

	const heroDescription =
		aboutPage?.content?.heroDescription ?? aboutPageContent.heroDescription;
	const contentParagraphs =
		aboutPage?.content?.paragraphs ??
		(aboutPageContent.paragraphs as PortableTextBlock[]);
	const companyOverview =
		aboutPage?.companyInfo?.overview ??
		(companyInfo.overview as PortableTextBlock[]);
	const email = aboutPage?.companyInfo?.email ?? companyInfo.email;
	const phone = aboutPage?.companyInfo?.phone ?? companyInfo.phone;
	const headquarters =
		aboutPage?.companyInfo?.headquarters ?? companyInfo.headquarters;

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<PagesHero>
				<div className="max-w-3xl">
					<AnimatedElement>
						<h1 className="page-title">About ILLUMRA</h1>
					</AnimatedElement>
					<AnimatedElement delay={0.1}>
						<p className="text-xl text-white/90">{heroDescription}</p>
					</AnimatedElement>
				</div>
			</PagesHero>
			<Separator />
			{/* Company Info Section */}
			<section className="py-20 bg-accent/30">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="grid md:grid-cols-2 gap-12">
						<div className="space-y-6">
							<h2 className="font-heading text-3xl font-semibold tracking-tight">
								Company Overview
							</h2>
							<div className="space-y-4 text-foreground/90">
								<PortableText value={companyOverview} />
							</div>
						</div>

						<div className="space-y-6">
							<h2 className="font-heading text-3xl font-semibold tracking-tight">
								Contact Information
							</h2>
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<Icon
										icon="lucide:mail"
										className="size-5 text-primary mt-1 shrink-0"
									/>
									<div>
										<p className="font-medium">Email</p>
										<a href={`mailto:${email}`} className="text-primary hover:underline">
											{email}
										</a>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Icon
										icon="lucide:phone"
										className="size-5 text-primary mt-1 shrink-0"
									/>
									<div>
										<p className="font-medium">Phone</p>
										<a
											href={`tel:${phone.replace(/[^\d+]/g, "")}`}
											className="text-primary hover:underline"
										>
											{phone}
										</a>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Icon
										icon="lucide:map-pin"
										className="size-5 text-primary mt-1 shrink-0"
									/>
									<div>
										<p className="font-medium">Headquarters</p>
										<p className="text-foreground/90">{headquarters}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Key Features Section */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4 max-w-6xl">
					<h2 className="font-heading text-3xl font-semibold tracking-tight text-center mb-12">
						Why Choose ILLUMRA
					</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<Card className="border-2 hover:border-primary/50 transition-colors">
							<CardContent className="pt-6">
								<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
									<Icon icon="lucide:headphones" className="size-6 text-primary" />
								</div>
								<h3 className="text-xl font-semibold mb-2">Superior Support</h3>
								<p className="text-foreground/80">
									We provide comprehensive support throughout the installation process
									and beyond, ensuring your wireless control system operates flawlessly.
								</p>
							</CardContent>
						</Card>

						<Card className="border-2 hover:border-primary/50 transition-colors">
							<CardContent className="pt-6">
								<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
									<Icon icon="lucide:leaf" className="size-6 text-primary" />
								</div>
								<h3 className="text-xl font-semibold mb-2">Energy Efficiency</h3>
								<p className="text-foreground/80">
									Our systems support California Title 24 compliance and help transition
									to greener, energy-saving lighting control systems.
								</p>
							</CardContent>
						</Card>

						<Card className="border-2 hover:border-primary/50 transition-colors">
							<CardContent className="pt-6">
								<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
									<Icon icon="lucide:settings" className="size-6 text-primary" />
								</div>
								<h3 className="text-xl font-semibold mb-2">Flexible Solutions</h3>
								<p className="text-foreground/80">
									Easy to install and adjust, our products make changes and updates to
									control systems simple and flexible.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<Separator />

			{/* Become a Distributor Section */}
			<BecomeADistributor />
			<Separator />

			{/* Become a Rep Section */}
			<BecomeARep />
			<Separator />

			{/* EnOcean Section */}
			<section className="py-20 bg-accent/30">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="font-heading text-3xl font-semibold tracking-tight mb-4">
								The EnOcean Radio Standard
							</h2>
							<p className="text-lg text-foreground/90 mb-6">
								Learn about the EnOcean radio protocol that powers our wireless control
								solutions.
							</p>
							<Button asChild size="lg">
								<Link
									href="https://www.enocean-alliance.org"
									target="_blank"
									rel="noopener noreferrer"
								>
									Visit EnOcean Alliance
									<Icon icon="lucide:external-link" className="ml-2 size-5" />
								</Link>
							</Button>
						</div>
						<div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
							<Image
								src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
								alt="Wireless control technology"
								fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
