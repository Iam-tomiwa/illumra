"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { AnimatedElement } from "@/components/animated-element";
import type { HomePageQueryResult } from "@/sanity.types";

type CTASectionProps = {
	cta?: NonNullable<HomePageQueryResult>["cta"];
};

export function CTASection({ cta }: CTASectionProps) {
	const title = cta?.title ?? "Ready to Get Started?";
	const description = cta?.description ?? "Request a quote for our wireless control solutions and receive pricing tailored to your project needs";
	const actionLabel = cta?.action?.label ?? "Request a Quote";
	const actionHref = cta?.action?.href ?? "/contact";
	const actionIcon = cta?.action?.icon ?? "solar:round-arrow-right-bold";

	return (
		<section className="py-20 bg-card/50">
			<div className="container mx-auto px-4">
				<Card className="max-w-4xl mx-auto bg-linear-to-br from-card to-accent/20 border-accent">
					<CardContent className="pt-12 pb-12 text-center">
						<AnimatedElement delay={0.1}>
							<h2 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">
								{title}
							</h2>
						</AnimatedElement>
						<AnimatedElement delay={0.2}>
							<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
								{description}
							</p>
						</AnimatedElement>
						<AnimatedElement delay={0.3}>
							<Button size="lg" asChild>
								<Link href={actionHref}>
									{actionLabel}{" "}
									{actionIcon && <Icon icon={actionIcon} className="size-7" />}
								</Link>
							</Button>
						</AnimatedElement>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
