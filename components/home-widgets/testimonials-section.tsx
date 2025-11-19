import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
	rating: number;
	text: string;
	author: {
		name: string;
		role: string;
		company: string;
		avatar: string;
		initials: string;
	};
}

const testimonials: Testimonial[] = [
	{
		rating: 5,
		text:
			"“Illumra's wireless switches have simplified our lighting controls, providing a cost-effective and eco-friendly solution. Highly recommended!",
		author: {
			name: "Ethan Carter",
			role: "Operations Director",
			company: "EcoSolutions Ltd.",
			avatar: "https://randomuser.me/api/portraits/men/32.jpg",
			initials: "EC",
		},
	},
	{
		rating: 5,
		text:
			"Illumra's control systems have revolutionized our energy management. Their commitment to innovation and quality is truly commendable.",
		author: {
			name: "Sophia Adams",
			role: "Facilities Manager",
			company: "BrightWay Inc.",
			avatar: "https://randomuser.me/api/portraits/women/44.jpg",
			initials: "SA",
		},
	},
	{
		rating: 5,
		text:
			"The reliability and performance of Illumra's wireless sensors have exceeded our expectations, contributing to significant energy savings. Exceptional products!",
		author: {
			name: "Olivia Parker",
			role: "Energy Efficiency Consultant",
			company: "SmartEco Solutions",
			avatar: "https://randomuser.me/api/portraits/men/67.jpg",
			initials: "DP",
		},
	},
];

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

export function TestimonialsSection() {
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
				<div className="grid md:grid-cols-3 gap-6">
					{testimonials.map(testimonial => (
						<Card key={testimonial.author.name}>
							<CardContent className="pt-6">
								<StarRating rating={testimonial.rating} />
								<p className="text-muted-foreground mb-6 mt-4">{testimonial.text}</p>
								<div className="flex items-center gap-3">
									<Avatar>
										<AvatarImage src={testimonial.author.avatar} />
										<AvatarFallback>{testimonial.author.initials}</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold text-sm">{testimonial.author.name}</div>
										<div className="text-xs text-muted-foreground">
											{testimonial.author.role}, {testimonial.author.company}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
