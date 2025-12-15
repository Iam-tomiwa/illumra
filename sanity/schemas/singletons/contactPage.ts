import { TextIcon, DocumentIcon, EyeOpenIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const contactPage = defineType({
	name: "contactPage",
	title: "Contact Page",
	type: "document",
	icon: TextIcon,
	groups: [
		{
			name: "quoteForm",
			title: "Quote Form Configuration",
			icon: DocumentIcon,
			default: true,
		},
		{
			name: "contactForm",
			title: "Contact Form Configuration",
			icon: DocumentIcon,
		},
		{
			name: "seo",
			title: "SEO & Meta Tags",
			icon: EyeOpenIcon,
		},
	],
	fields: [
		defineField({
			name: "quoteFormTitle",
			type: "string",
			title: "Quote Form Title",
			group: "quoteForm",
			description: "Title displayed above the quote form",
			initialValue: "Request a Quote",
			validation: rule => [
				rule.required().error("Quote form title is required."),
			],
		}),
		defineField({
			name: "quoteFormDescription",
			type: "text",
			title: "Quote Form Description",
			group: "quoteForm",
			description: "Description text displayed below the quote form title",
			rows: 3,
		}),
		defineField({
			name: "quoteFormFields",
			type: "array",
			title: "Quote Form Fields",
			group: "quoteForm",
			description: "Reorder or hide existing quote form fields. You cannot create new fields here.",
			of: [defineArrayMember({ type: "quoteFormField" })],
			validation: rule => [
				rule.unique().warning("Duplicate field configurations were removed."),
			],
		}),
		defineField({
			name: "contactFormTitle",
			type: "string",
			title: "Contact Form Title",
			group: "contactForm",
			description: "Title displayed above the contact form",
			initialValue: "Contact Us",
			validation: rule => [
				rule.required().error("Contact form title is required."),
			],
		}),
		defineField({
			name: "contactFormDescription",
			type: "text",
			title: "Contact Form Description",
			group: "contactForm",
			description: "Description text displayed below the contact form title",
			rows: 3,
		}),
		defineField({
			name: "contactFormFields",
			type: "array",
			title: "Contact Form Fields",
			group: "contactForm",
			description: "Configure which fields appear in the contact form and their order",
			of: [defineArrayMember({ type: "formFieldConfig" })],
			validation: rule => [
				rule.unique().warning("Duplicate field configurations were removed."),
			],
		}),
		defineField({
			name: "seo",
			type: "seo",
			title: "SEO & Meta Tags",
			group: "seo",
			description: "Override default SEO settings for this page (optional)",
		}),
	],
	preview: {
		select: {
			title: "quoteFormTitle",
		},
		prepare({ title }) {
			return {
				title: title || "Contact Page",
				subtitle: "Contact page form configuration",
			};
		},
	},
});

