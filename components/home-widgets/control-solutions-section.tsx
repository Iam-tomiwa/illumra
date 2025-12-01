import { Icon } from "@iconify/react";

import { controlSolutionsSection } from "@/sanity/lib/demo";
import type { HomePageQueryResult } from "@/sanity.types";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AnimatedElement } from "@/components/animated-element";

type ControlSolutionsContent = NonNullable<
	NonNullable<HomePageQueryResult>["controlSolutions"]
>;

type Feature = NonNullable<ControlSolutionsContent["features"]>[number];

type EnergyFeaturesProps = {
	section?: ControlSolutionsContent | null;
};

export default function EnergyFeatures({ section }: EnergyFeaturesProps) {
	const content =
		section ?? (controlSolutionsSection as ControlSolutionsContent);

	const LinkOrCard = ({
		url,
		children,
		className,
	}: {
		url?: string | null;
		className: string;
		children: ReactNode;
	}) => {
		return url ? (
			<Link className={className} href={url}>
				{children}
			</Link>
		) : (
			<div className={className}>{children}</div>
		);
	};
	return (
		<section className="bg-accent py-12">
			<div className="container mx-auto px-4">
				<div className="mx-auto mb-10 max-w-3xl text-center">
					{content.title ? (
						<AnimatedElement delay={0.1}>
							<h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
								{content.title}
							</h2>
						</AnimatedElement>
					) : null}
					{content.subtitle ? (
						<AnimatedElement delay={0.2}>
							<p className="mt-4 text-base text-foreground/80">{content.subtitle}</p>
						</AnimatedElement>
					) : null}
				</div>
				<div className="grid gap-6 sm:grid-cols-2">
					{content?.features?.map((feature, index) => (
						<AnimatedElement
							key={`${feature.title}-${feature.icon}`}
							delay={0.1 + index * 0.1}
							className={cn(
								feature.url &&
									"cursor-pointer shadow-sm shadow-primary/5 backdrop-blur transition hover:border-primary/40 hover:shadow-lg"
							)}
						>
							<LinkOrCard
								className="flex gap-3 rounded-xl border border-primary/10 bg-background/80 p-6 h-full"
								url={feature?.url}
							>
								<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
									<Icon icon={feature.icon ?? "lucide:sparkles"} className="size-6" />
								</div>
								<div>
									<h3 className="text-lg font-semibold text-foreground">
										{feature.title}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-foreground/80">
										{feature.description}
									</p>
								</div>
							</LinkOrCard>
						</AnimatedElement>
					))}
				</div>
			</div>
		</section>
	);
}
