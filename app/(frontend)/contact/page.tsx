import { GetQuoteModalForm } from "@/components/get-quote-modal";
import { ContactUsForm } from "@/components/contact-us-form";
import { AboutPageQueryResult } from "@/sanity.types";
import { companyInfo } from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { aboutPageQuery } from "@/sanity/lib/queries";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
			<div className="max-w-7xl mx-auto py-10 md:py-20 px-4">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">
						Contact Us
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Get in touch with us for quotes, support, or general inquiries. We're here to help.
					</p>
				</div>

				{/* Contact Information Card */}


				{/* Forms Section */}
				<div className="max-w-6xl flex gap-8 mb-12">
					<div className=" bg-primary/5 rounded-lg p-8">
						<div className="mb-6">
							<h2 className="font-heading text-2xl font-semibold tracking-tight mb-2">
								Contact Us
							</h2>
							<p className="text-muted-foreground">
								Have a question or need assistance? Send us a message and we'll get back to you as soon as possible.
							</p>
						</div>
						<div className="space-y-6">
							<div className="flex items-start gap-3">
								<Icon
									icon="lucide:mail"
									className="size-5 text-primary mt-1 shrink-0"
								/>
								<div>
									<p className="font-medium mb-1">Email</p>
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
									<p className="font-medium mb-1">Phone</p>
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
									<p className="font-medium mb-1">Headquarters</p>
									<p className="text-foreground/90">{headquarters}</p>
								</div>
							</div>
						</div>
					</div>
					{/* Contact Us Form */}
					<div className="border rounded-lg p-8 h-max min-w-[60%] flex-grow">
						<ContactUsForm />
					</div>
				</div>

				{/* Forms Section */}
				<section id="request-a-quote" className="max-w-6xl flex gap-8 mb-12">
					<div className="bg-primary/5 rounded-lg p-8">
						<div className="mb-6">
							<h2 className="font-heading text-2xl font-semibold tracking-tight mb-2">
								Request a Quote
							</h2>
							<p className="text-muted-foreground mb-6">
								Fill out the form to receive pricing and lead times for our wireless
								control solutions. Our team will respond promptly with a customized quote
								based on your project requirements.
							</p>
						</div>

						<div className="pt-6 border-t border-border">
							<div className="flex items-start gap-3 mb-4">
								<div>
									<h3 className="font-semibold text-lg mb-2">Explore Our Products</h3>
									<p className="text-sm text-muted-foreground mb-4">
										Before requesting a quote, browse our full range of wireless control solutions and find the perfect products for your project.
									</p>
									<Button asChild variant="outline" size="sm">
										<Link href="/products" className="inline-flex items-center gap-2">
											View All Products
											<Icon icon="lucide:arrow-right" className="size-4" />
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Request a Quote Form */}
					<div className="border rounded-lg p-8 flex-grow h-max min-w-[60%]">
						<GetQuoteModalForm />
					</div>
				</section>
			</div>
		</div>
	);
}
