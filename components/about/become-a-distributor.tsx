"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldContent,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

function DistributorInquiryForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		company: "",
		message: "",
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Create mailto link with form data
		const subject = encodeURIComponent("Distributor Inquiry");
		const body = encodeURIComponent(
			`Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
		);
		const mailtoLink = `mailto:sales@illumra.com?subject=${subject}&body=${body}`;

		// Open email client
		window.location.href = mailtoLink;

		// Show success message
		toast.success("Opening your email client...");
		setIsSubmitting(false);

		// Reset form after a delay
		setTimeout(() => {
			setFormData({ name: "", email: "", company: "", message: "" });
		}, 1000);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<FieldSet>
				<FieldGroup className="grid gap-4 md:grid-cols-2">
					<Field>
						<FieldLabel htmlFor="distributor-name">
							Name <span className="text-destructive">*</span>
						</FieldLabel>
						<FieldContent>
							<Input
								id="distributor-name"
								type="text"
								required
								value={formData.name}
								onChange={e => setFormData({ ...formData, name: e.target.value })}
								placeholder="Your name"
							/>
						</FieldContent>
					</Field>

					<Field>
						<FieldLabel htmlFor="distributor-email">
							Email <span className="text-destructive">*</span>
						</FieldLabel>
						<FieldContent>
							<Input
								id="distributor-email"
								type="email"
								required
								value={formData.email}
								onChange={e => setFormData({ ...formData, email: e.target.value })}
								placeholder="your.email@example.com"
							/>
						</FieldContent>
					</Field>
				</FieldGroup>

				<Field>
					<FieldLabel htmlFor="distributor-company">Company</FieldLabel>
					<FieldContent>
						<Input
							id="distributor-company"
							type="text"
							value={formData.company}
							onChange={e => setFormData({ ...formData, company: e.target.value })}
							placeholder="Company name"
						/>
					</FieldContent>
				</Field>

				<Field>
					<FieldLabel htmlFor="distributor-message">
						Message <span className="text-destructive">*</span>
					</FieldLabel>
					<FieldContent>
						<textarea
							id="distributor-message"
							required
							rows={6}
							value={formData.message}
							onChange={e => setFormData({ ...formData, message: e.target.value })}
							placeholder="Tell us about your distribution inquiry..."
							className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						/>
					</FieldContent>
				</Field>
			</FieldSet>

			<div className="flex justify-end">
				<Button type="submit" size="lg" disabled={isSubmitting}>
					{isSubmitting ? "Submitting..." : "Submit Inquiry"}
					<Icon icon="lucide:send" className="size-5 rotate-45" />
				</Button>
			</div>
		</form>
	);
}
export default function BecomeADistributor({
	className,
}: {
	className?: string;
}) {
	return (
		<section
			className={cn("py-20 bg-white", className)}
			id="become-a-distributor"
		>
			<div className="container mx-auto px-4 max-w-4xl">
				<div className="space-y-8">
					<div>
						<h2 className="font-heading text-3xl font-semibold tracking-tight mb-4">
							Become a Distributor
						</h2>
						{/* <h3 className="text-xl font-semibold mb-4 text-foreground/90">
							Distributor Inquiries
						</h3> */}
						<p className="text-lg text-foreground/90 mb-6">
							International and US distributors may inquire about distribution
							opportunities using the email address{" "}
							<a href="mailto:sales@illumra.com" className="underline">
								sales@illumra.com
							</a>
							.
						</p>
					</div>

					{/* <DistributorInquiryForm /> */}
				</div>
			</div>
		</section>
	);
}
