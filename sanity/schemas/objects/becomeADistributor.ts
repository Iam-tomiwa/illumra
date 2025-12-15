import { CaseIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const becomeADistributor = defineType({
	name: "becomeADistributor",
	title: "Become a Distributor",
	type: "object",
	icon: CaseIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Distributor Section Title",
			description: "Heading for the 'Become a Distributor' section.",
			initialValue: "Become a Distributor",
			validation: rule => [
				rule.required().error("Add a distributor section title."),
			],
		}),
		defineField({
			name: "description",
			type: "text",
			rows: 4,
			title: "Distributor Description",
			description: "Description text for the distributor section. Use {email} to insert the sales email link.",
			initialValue: "International and US distributors may inquire about distribution opportunities using the email address sales@illumra.com.",
		}),
		defineField({
			name: "email",
			type: "string",
			title: "Distributor Contact Email",
			description: "Email address for distributor inquiries.",
			initialValue: "sales@illumra.com",
			validation: rule => [
				rule.required().error("Add a contact email for distributor inquiries."),
				rule.email().error("Please provide a valid email address."),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
		},
		prepare({ title }) {
			return {
				title: title || "Become a Distributor",
				subtitle: "Distributor section configuration",
			};
		},
	},
});

