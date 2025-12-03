import { GetQuoteModalForm } from "@/components/get-quote-modal";
import { AboutPageQueryResult } from "@/sanity.types";
import { companyInfo } from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { aboutPageQuery } from "@/sanity/lib/queries";
import { Icon } from "@iconify/react";

import React from "react";

export default async function ContactUsPage() {
	const aboutPage = (await sanityFetch({
		query: aboutPageQuery,
	})) as AboutPageQueryResult | null;

	const email = aboutPage?.companyInfo?.email ?? companyInfo.email;
	const phone = aboutPage?.companyInfo?.phone ?? companyInfo.phone;
	const headquarters =
		aboutPage?.companyInfo?.headquarters ?? companyInfo.headquarters;

	return (
		<div className="bg-background">
			<div className="max-w-6xl flex-wrap flex gap-10 py-10 md:py-20 mx-auto justify-center items-start px-4">
				<div className="space-y-6 md:max-w-[40%] bg-primary/5 rounded-lg p-8">
					<h2 className="font-heading text-3xl font-semibold tracking-tight">
						Request a Quote
					</h2>
					<p>
						Fill out the form to receive pricing and lead times for our wireless
						control solutions. Our team will respond promptly with a customized quote
						based on your project requirements.
					</p>
					<div className="pt-6 border-t border-border">
						<h3 className="font-semibold text-lg mb-4">Contact Information</h3>
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

				<div className="flex-1 max-w-xl">
					<GetQuoteModalForm />
				</div>
			</div>
		</div>
	);
}
