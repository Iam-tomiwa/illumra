import { cn } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/fetch";
import { becomeADistributorQuery } from "@/sanity/lib/queries";
import DistributorInquiryForm from "./distributor-inquiry-form";

export default async function BecomeADistributor({
	className,
}: {
	className?: string;
}) {
	const becomeADistributor = await sanityFetch({
		query: becomeADistributorQuery,
	});

	const title = becomeADistributor?.title;
	const description = becomeADistributor?.description;
	const distributorEmail = becomeADistributor?.email || 'sales@illumra.com';
	
	// Replace {email} placeholder with actual email link if present, or replace the email in text with a link
	let formattedDescription = description;
	if (description) {
		// Replace {email} placeholder
		if (description.includes('{email}')) {
			formattedDescription = description.replace(
				/\{email\}/g,
				`<a href="mailto:${distributorEmail}" class="underline">${distributorEmail}</a>`
			);
		} else if (description.includes(distributorEmail)) {
			// If email is in the text but not as placeholder, wrap it in a link
			formattedDescription = description.replace(
				new RegExp(distributorEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
				`<a href="mailto:${distributorEmail}" class="underline">${distributorEmail}</a>`
			);
		}
	}

	return (
		<section
			className={cn("py-20 bg-white", className)}
			id="become-a-distributor"
		>
			<div className="container mx-auto px-4 max-w-4xl">
				<div className="space-y-8">
					<div>
						<h2 className="font-heading text-3xl font-semibold tracking-tight mb-4">
							{title || "Become a Distributor"}
						</h2>
						{formattedDescription && (
							<p 
								className="text-lg text-foreground/90 mb-6"
								dangerouslySetInnerHTML={{ __html: formattedDescription }}
							/>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
