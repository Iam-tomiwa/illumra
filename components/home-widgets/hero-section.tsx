import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cleanString, resolveMediaAsset } from "@/sanity/lib/utils";
import { heroSection } from "@/sanity/lib/demo";
import type { HomePageQueryResult, MediaAsset } from "@/sanity.types";
import { AnimatedElement } from "../animated-element";

type HeroContent = NonNullable<NonNullable<HomePageQueryResult>["hero"]>;

type HeroSectionProps = {
	hero?: HeroContent | null;
};

export const resolveBackgroundUrl = (
	background?: HeroContent["backgroundImage"]
): { url: string; alt?: string | null } | undefined => {
	return background
		? resolveMediaAsset(
				{
					...(background as MediaAsset),
					_type: "mediaAsset",
				},
				{
					width: 1920,
					height: 1080,
					fit: "crop",
				}
			)
		: undefined;
};

export function HeroSection({ hero }: HeroSectionProps) {
	const content = hero ?? (heroSection as unknown as HeroContent);

	const backgroundImage =
		resolveBackgroundUrl(hero?.backgroundImage) ??
		resolveBackgroundUrl(
			heroSection.backgroundImage as HeroContent["backgroundImage"]
		);
	const backgroundImageUrl = backgroundImage?.url;

	const attentionLabel = null;
	const attentionIcon = content.attentionIcon ?? null;
	const headline = content.headline ?? heroSection.headline;
	const summary = content.summary ?? heroSection.summary;
	const primaryAction = content.primaryAction ?? heroSection.primaryAction;
	const secondaryAction = content.secondaryAction ?? heroSection.secondaryAction;

	return (
		<header
			className={cn(
				"relative flex min-h-[80vh] items-center bg-cover bg-center py-20 text-white"
			)}
			style={
				backgroundImageUrl
					? {
							backgroundImage: `url(${backgroundImageUrl})`,
						}
					: undefined
			}
		>
			<div className="absolute inset-0 bg-black/50" />
			<div className="container relative z-10 mx-auto px-4">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<div className="space-y-8">
						{attentionLabel ? (
							<AnimatedElement className="inline-flex items-center gap-2 rounded-full border border-primary-foreground bg-accent/80 px-4 py-2 text-primary-foreground">
								{attentionIcon ? (
									<Icon icon={cleanString(attentionIcon)} className="size-4" />
								) : null}
								<span className="text-sm font-medium">{attentionLabel}</span>
							</AnimatedElement>
						) : null}
						<AnimatedElement delay={0.1}>
							<h1 className="font-heading text-5xl font-semibold tracking-tight text-primary md:text-6xl lg:text-7xl">
								{" "}
								{headline}
							</h1>
						</AnimatedElement>
						{summary ? (
							<AnimatedElement delay={0.2}>
								<p className="text-xl">{summary}</p>
							</AnimatedElement>
						) : null}
						<AnimatedElement delay={0.4} className="flex flex-col gap-4 sm:flex-row">
							{primaryAction?.href ? (
								<Button asChild className="px-8 shadow-lg shadow-primary/20" size="lg">
									<Link href={primaryAction.href}>
										{primaryAction.label}
										{primaryAction.icon ? (
											<Icon icon={primaryAction.icon} className="size-7" />
										) : null}
									</Link>
								</Button>
							) : primaryAction?.label ? (
								<Button className="px-8 shadow-lg shadow-primary/20" size="lg">
									{primaryAction.label}
								</Button>
							) : null}
							{secondaryAction?.href ? (
								<Button asChild className="px-8 text-black" size="lg" variant="outline">
									<Link href={secondaryAction.href}>
										{secondaryAction.label}
										{secondaryAction.icon ? (
											<Icon icon={secondaryAction.icon} className="size-7" />
										) : null}
									</Link>
								</Button>
							) : secondaryAction?.label ? (
								<Button className="px-8 text-black" size="lg" variant="outline">
									{secondaryAction.label}
								</Button>
							) : null}
						</AnimatedElement>
					</div>
				</div>
			</div>
		</header>
	);
}
