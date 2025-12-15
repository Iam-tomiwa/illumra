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
import { resolveBackgroundUrl } from "@/components/home-widgets/hero-section";
import type { AboutPage, AboutPageQueryResult, IconFeature } from "@/sanity.types";
import { PortableTextBlock } from "next-sanity";

export default async function AboutPage() {
	const aboutPage = (await sanityFetch({
		query: aboutPageQuery,
	})) as AboutPageQueryResult | null;
	// Hero content
	const backgroundImage = resolveBackgroundUrl(
		aboutPage?.backgroundImage as Parameters<typeof resolveBackgroundUrl>[0]
	)?.url;


	// Overview content
	const overviewTitle = aboutPage?.companyInfo?.overviewTitle;
	const paragraphs = aboutPage?.companyInfo?.overview;

	// Company info
	const email = aboutPage?.companyInfo?.email;
	const phone = aboutPage?.companyInfo?.phone;
	const headquarters = aboutPage?.companyInfo?.headquarters;

	// Features content
	const featuresTitle = aboutPage?.featuresTitle;
	const features = aboutPage?.features;



	// EnOcean content
	const enoceanVisible = aboutPage?.enoceanVisible !== "hide";
	const enoceanTitle = aboutPage?.enoceanTitle;
	const enoceanDescription = aboutPage?.enoceanDescription;
	const enoceanAction = aboutPage?.enoceanAction;
	const enoceanImage = resolveBackgroundUrl(
		aboutPage?.enoceanImage as Parameters<typeof resolveBackgroundUrl>[0]
	)?.url;

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<PagesHero backgroundImageUrl={backgroundImage}>
			</PagesHero>
			<Separator />

			{/* Company Info Section */}
			<section className="py-20 bg-accent/30">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="grid md:grid-cols-2 gap-12">
						<div className="space-y-6">
							<h2 className="font-heading text-3xl font-semibold tracking-tight">
								{overviewTitle}
							</h2>
							<div className="space-y-4 text-foreground/90">
								{paragraphs && paragraphs.length > 0 && (
									<PortableText value={paragraphs as PortableTextBlock[]} />
								)}
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
											href={`tel:${phone?.replace(/[^\d+]/g, "")}`}
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
			{features && features.length > 0 && (
				<section className="py-20 bg-white">
					<div className="container mx-auto px-4 max-w-6xl">
						<h2 className="font-heading text-3xl font-semibold tracking-tight text-center mb-12">
							{featuresTitle}
						</h2>
						<div className="grid md:grid-cols-3 gap-8">
							{features.map((feature) => (
								<div
									key={feature.title}
									className="flip-card-container h-[280px] border rounded-lg cursor-pointer!"
								>
									<div className="flip-card-inner">
										{/* Front Side - Icon and Title */}
										<div className="flip-card-front">
											{feature.icon && (
												<div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
													<Icon icon={feature.icon} className="size-8 text-primary" />
												</div>
											)}
											<h3 className="text-xl font-semibold">{feature.title}</h3>
										</div>
										{/* Back Side - Description */}
										<div className="flip-card-back">
											<p className="text-foreground/80">{feature.description}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			<Separator />

			{/* Become a Distributor Section */}
			<BecomeADistributor />
			<Separator />

			{/* Become a Rep Section */}
			<BecomeARep />
			<Separator />

			{/* EnOcean Section */}
			{enoceanVisible && (
				<section className="py-20 bg-accent/30">
					<div className="container mx-auto px-4 max-w-4xl">
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div>
								<h2 className="font-heading text-3xl font-semibold tracking-tight mb-4">
									{enoceanTitle}
								</h2>
								<p className="text-lg text-foreground/90 mb-6">
									{enoceanDescription}
								</p>
								{enoceanAction && (
									<Button asChild size="lg">
										<Link
											href={enoceanAction.href ?? "#"}
											target="_blank"
											rel="noopener noreferrer"
										>
											{enoceanAction.label}
											{enoceanAction.icon && (
												<Icon icon={enoceanAction.icon} className="ml-2 size-5" />
											)}
										</Link>
									</Button>
								)}
							</div>
							<div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
								<Image
									src={enoceanImage ?? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"}
									alt="Wireless control technology"
									fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
