"use client";

import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { HomePageQueryResult, MediaAsset } from "@/sanity.types";
import { resolveMediaAsset } from "@/sanity/lib/utils";
import Marquee from "react-fast-marquee";

function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex gap-1">
			{Array.from({ length: rating }).map((_, i) => (
				<Icon
					key={i}
					icon="solar:star-bold"
					className="size-5 [&>path]:fill-primary text-primary"
				/>
			))}
		</div>
	);
}

export function TestimonialsSection({
	testimonials,
}: {
	testimonials: NonNullable<HomePageQueryResult>["testimonials"];
}) {
	const normalizedTestimonials = testimonials ?? [];

	return (
		<section className="py-20 bg-accent">
			<div className="container mx-auto px-4">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">
						What Our Clients Say
					</h2>
					<p className="text-lg text-muted-foreground">
						Real results from real businesses
					</p>
				</div>
				<Marquee
					autoFill
					pauseOnHover
					speed={50}
					gradient
					gradientColor="var(--accent)"
					gradientWidth={100}
					className="py-4 overflow-y-clip"
				>
					{normalizedTestimonials.map((testimonial, index) => {
						const picture = testimonial?.author?.picture as
							| MediaAsset
							| null
							| undefined;
						const imageResolved = picture
							? resolveMediaAsset({
									...picture,
									_type: "mediaAsset",
								} as MediaAsset)
							: undefined;
						return (
							<Card
								key={`${testimonial?.author?.name}-${index}`}
								className="mx-3 w-[350px] shrink-0"
							>
								<CardContent className="pt-6">
									<StarRating rating={5} />
									<p className="text-muted-foreground mb-6 mt-4">
										{testimonial.testimony}
									</p>
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarImage
												src={imageResolved?.url}
												alt={testimonial?.author?.name || ""}
											/>
											<AvatarFallback>
												{testimonial?.author?.name?.charAt(0)?.toUpperCase() || "?"}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-semibold text-sm">
												{testimonial?.author?.name}
											</div>
											<div className="text-xs text-muted-foreground">
												{testimonial?.author?.role}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</Marquee>
			</div>
		</section>
	);
}
