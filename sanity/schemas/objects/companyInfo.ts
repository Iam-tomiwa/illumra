import { DocumentTextIcon, ComposeIcon, EyeOpenIcon } from "@sanity/icons";
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
			name: "visible",
			title: "Section Visibility",
			type: "string",
			group: "overview",
			description: "Choose whether to show or hide this section on the page.",
			initialValue: "show",
			options: {
				layout: "radio",
				list: [
					{ title: "Show", value: "show" },
					{ title: "Hide", value: "hide" },
				],
			},
			validation: rule => [
				rule.required().error("Select whether to show or hide this section."),
			],
		}),
		defineField({
			name: "overviewTitle",
			type: "string",
			group: "overview",
			title: "Overview Section Title",
			description: "Title for the company overview section.",
			initialValue: "Company Overview",
			validation: rule => [
				rule.required().error("Add an overview section title."),
			],
		}),
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
