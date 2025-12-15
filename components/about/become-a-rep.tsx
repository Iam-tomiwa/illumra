import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import PortableText from "@/components/portable-text";
import { PortableTextBlock } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/fetch";
import { becomeARepQuery } from "@/sanity/lib/queries";

export default async function BecomeARep({ 
	className,
}: { 
	className?: string;
}) {
	const becomeARep = await sanityFetch({
		query: becomeARepQuery,
	});

	const title = becomeARep?.title;
	const description = becomeARep?.description as PortableTextBlock[] | null | undefined;
	const button = becomeARep?.button;

	return (
		<section id="rep" className={cn("py-20 bg-accent/30", className)}>
			<div className="container mx-auto px-4 max-w-4xl">
				<div className="space-y-8">
					<div>
						<h2 className="font-heading text-3xl font-semibold tracking-tight mb-4">
							{title || "Become a Rep"}
						</h2>
						{description && (
							<div className="space-y-4 text-lg text-foreground/90 mb-8">
								<PortableText value={description} />
							</div>
						)}
						{button && (
							<Button asChild size="lg">
								<Link href={button.href ?? "/contact"}>
									{button.label || "Contact Us to Become a Rep"}
									{button.icon && <Icon icon={button.icon} className="ml-2 size-5" />}
									{!button.icon && <Icon icon="lucide:arrow-right" className="ml-2 size-5" />}
								</Link>
							</Button>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
