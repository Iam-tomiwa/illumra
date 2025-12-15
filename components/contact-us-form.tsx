"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "./ui/field";
import { Form } from "./ui/form";
import { sanitizeSanityData } from "@/sanity/lib/utils";

const contactSchema = z.object({
	name: z.string().min(2, "Name is required"),
	email: z.string().email("Enter a valid email"),
	phone: z.string().min(7, "Enter a valid phone number"),
	subject: z.string().optional(),
	message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactUsForm() {
	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			subject: "",
			message: "",
		},
	});

	const {
		handleSubmit,
		register,
		reset,
		formState: { errors, isSubmitting },
	} = form;

	const onSubmit = async (values: ContactFormValues) => {
		try {
			const response = await fetch("/api/submit-contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(sanitizeSanityData(values)),
			});

			if (!response.ok) {
				throw new Error("Failed to send contact request.");
			}

			toast.success("Message sent successfully!");
			reset();
		} catch (error) {
			toast.error("Something went wrong. Please try again.");
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<FieldSet>
					<FieldGroup className="grid gap-4 md:grid-cols-2">
						<Field>
							<FieldLabel htmlFor="name">
								Name <span className="text-destructive">*</span>
							</FieldLabel>
							<FieldContent>
								<Input id="name" placeholder="Your name" {...register("name")} />
								<FieldError errors={errors.name ? [errors.name] : undefined} />
							</FieldContent>
						</Field>
						<Field>
							<FieldLabel htmlFor="phone">
								Phone Number <span className="text-destructive">*</span>
							</FieldLabel>
							<FieldContent>
								<Input id="phone" placeholder="Phone Number" {...register("phone")} />
								<FieldError errors={errors.phone ? [errors.phone] : undefined} />
							</FieldContent>
						</Field>
					</FieldGroup>

					<Field>
						<FieldLabel htmlFor="email">
							Email <span className="text-destructive">*</span>
						</FieldLabel>
						<FieldContent>
							<Input
								id="email"
								placeholder="Email"
								type="email"
								{...register("email")}
							/>
							<FieldError errors={errors.email ? [errors.email] : undefined} />
						</FieldContent>
					</Field>

					<Field>
						<FieldLabel htmlFor="subject">Subject</FieldLabel>
						<FieldContent>
							<Input
								id="subject"
								placeholder="Subject (optional)"
								{...register("subject")}
							/>
						</FieldContent>
					</Field>

					<Field>
						<FieldLabel htmlFor="message">
							Message <span className="text-destructive">*</span>
						</FieldLabel>
						<FieldContent>
							<textarea
								rows={6}
								placeholder="Tell us how we can help you"
								id="message"
								className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:border-primary"
								{...register("message")}
							/>
							<FieldError errors={errors.message ? [errors.message] : undefined} />
						</FieldContent>
					</Field>
				</FieldSet>

				<div className="flex justify-end">
					<Button
						className="w-full md:w-auto mt-2"
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Sending..." : "Send Message"}
					</Button>
				</div>
			</form>
		</Form>
	);
}

