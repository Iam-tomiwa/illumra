"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { aboutSection } from "@/sanity/lib/demo";
import type { HomePageQueryResult, MediaAsset } from "@/sanity.types";
import { resolveMediaAsset } from "@/sanity/lib/utils";
import { AnimatedElement } from "@/components/animated-element";

type AboutContent = NonNullable<NonNullable<HomePageQueryResult>["about"]>;
type AboutFeature = NonNullable<AboutContent["features"]>[number];

type RenderFeature = {
	icon: string;
	title: string;
	description: string;
};

type RenderCta = {
	label: string;
	href: string;
	icon?: string | null;
};

const blocksToParagraphs = (body?: AboutContent["body"]): string[] => {
	if (!body) {
		return [];
	}

	return body
		.map(block =>
			block?.children
				?.map(child => child?.text ?? "")
				.join("")
				.trim()
		)
		.filter((text): text is string => Boolean(text));
};

type AboutSectionProps = {
	section?: AboutContent | null;
};

const getFeatures = (features?: AboutFeature[] | null): RenderFeature[] => {
	const fallbackFeatures = (aboutSection.features ?? []).map<RenderFeature>(
		feature => ({
			icon: feature.icon ?? "lucide:sparkles",
			title: feature.title ?? "Feature",
			description:
				feature.description ??
				"Share a supporting point that reinforces why customers choose you.",
		})
	);

	if (!features || features.length === 0) {
		return fallbackFeatures;
	}

	const mapped = features.map<RenderFeature>(feature => ({
		icon: feature.icon ?? "lucide:sparkles",
		title: feature.title ?? "Feature",
		description:
			feature.description ??
			"Share a supporting point that reinforces why customers choose you.",
	}));

	return mapped.length === 0 ? fallbackFeatures : mapped;
};

const getCta = (cta?: AboutContent["cta"] | null): RenderCta => {
	const fallbackCta: RenderCta = {
		label: aboutSection.cta?.label ?? "Learn More",
		href: aboutSection.cta?.href ?? "#",
		icon: aboutSection.cta?.icon ?? null,
	};

	if (!cta?.href) {
		return fallbackCta;
	}

	return {
		label: cta.label ?? fallbackCta.label,
		href: cta.href,
		icon: cta.icon ?? null,
	};
};

const getParagraphs = (body?: AboutContent["body"]) => {
	const paragraphs = blocksToParagraphs(body);
	const fallbackParagraphs = blocksToParagraphs(
		aboutSection.body as unknown as AboutContent["body"]
	);
	return paragraphs.length === 0 ? fallbackParagraphs : paragraphs;
};

export function AboutSection({ section }: AboutSectionProps) {
	const content = section ?? (aboutSection as unknown as AboutContent);
	const backgroundImage =
		resolveMediaAsset(
			{
				...(section?.background as MediaAsset),
				_type: "mediaAsset",
			},
			{
				width: 2400,
				height: 1400,
				fit: "crop",
			}
		) ??
		resolveMediaAsset(
			{
				...(aboutSection.background as unknown as MediaAsset),
				_type: "mediaAsset",
			},
			{
				width: 2400,
				height: 1400,
				fit: "crop",
			}
		);
	const backgroundUrl = backgroundImage?.url;
	const features = getFeatures(section?.features);
	const cta = getCta(section?.cta);
	const paragraphs = getParagraphs(section?.body);
	const heading = content.title;
	return (
		<section
			className="relative bg-cover bg-center py-20 text-white"
			style={
				backgroundUrl
					? {
							backgroundImage: `url(${backgroundUrl})`,
						}
					: undefined
			}
		>
			<div className="absolute inset-0 bg-black/60" />
			<div className="container relative z-10 mx-auto px-4">
				<div className="grid items-center gap-16 lg:grid-cols-2">
					<div className="space-y-6">
						{heading ? (
							<AnimatedElement delay={0.1}>
								<h2 className="font-heading text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
									{heading}
								</h2>
							</AnimatedElement>
						) : null}
						<div className="space-y-4">
							{paragraphs.map((paragraph, index) => (
								<AnimatedElement
									key={`about-paragraph-${index}`}
									delay={0.2 + index * 0.1}
								>
									<p className="text-lg text-white/90">{paragraph}</p>
								</AnimatedElement>
							))}
						</div>
						{cta.href ? (
							<AnimatedElement delay={0.4}>
								<Button asChild size="lg">
									<Link href={cta.href}>
										{cta.label}
										{cta.icon ? <Icon icon={cta.icon} className="size-5" /> : null}
									</Link>
								</Button>
							</AnimatedElement>
						) : null}
					</div>

					<div className="grid gap-6 sm:grid-cols-2">
						{features.map((feature, index) => (
							<Card
								key={`${feature.title}-${feature.icon}`}
								className="border border-white/20 bg-white/5 transition"
							>
								<AnimatedElement delay={0.1 + index * 0.1}>
									<CardContent className="pt-6">
										<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary-foreground/90">
											<Icon icon={feature.icon} className="size-6 text-primary" />
										</div>
										<h3 className="text-lg font-semibold text-white">{feature.title}</h3>
										<p className="mt-2 text-sm leading-relaxed text-white/80">
											{feature.description}
										</p>
									</CardContent>
								</AnimatedElement>
							</Card>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
