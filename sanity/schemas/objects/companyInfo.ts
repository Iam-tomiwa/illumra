import { DocumentTextIcon, ComposeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const companyInfo = defineType({
	name: "companyInfo",
	title: "Company Information",
	type: "object",
	icon: DocumentTextIcon,
	groups: [
		{
			name: "overview",
			title: "Company Overview",
			icon: DocumentTextIcon,
			default: true,
		},
		{
			name: "contact",
			title: "Contact Information",
			icon: ComposeIcon,
		},
	],
	fields: [
		defineField({
			name: "overview",
			type: "array",
			group: "overview",
			description: "Paragraphs describing the company overview.",
			of: [{ type: "block" }],
			validation: rule => [
				rule
					.required()
					.min(1)
					.error("Add at least one paragraph for the company overview."),
			],
		}),
		defineField({
			name: "email",
			type: "string",
			group: "contact",
			description: "Company email address.",
			validation: rule => [
				rule.required().email().error("Provide a valid email address."),
			],
		}),
		defineField({
			name: "phone",
			type: "string",
			group: "contact",
			description: "Company phone number.",
			validation: rule => [rule.required().error("Provide a phone number.")],
		}),
		defineField({
			name: "headquarters",
			type: "string",
			group: "contact",
			description: "Headquarters location.",
			validation: rule => [
				rule.required().error("Provide the headquarters location."),
			],
		}),
		defineField({
			name: "satelliteOffice",
			type: "string",
			group: "contact",
			description: "Satellite office location (if applicable).",
		}),
	],
	preview: {
		select: {
			headquarters: "headquarters",
			email: "email",
		},
		prepare({ headquarters, email }) {
			return {
				title: "Company Information",
				subtitle: headquarters || email || "Company details",
			};
		},
	},
});
