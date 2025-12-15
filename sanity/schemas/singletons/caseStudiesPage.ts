import { ImageIcon, BookIcon, EyeOpenIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const caseStudiesPage = defineType({
	name: "caseStudiesPage",
	title: "Case Studies Page",
	type: "document",
	icon: BookIcon,
	groups: [
		{
			name: "hero",
			title: "Hero Section",
			icon: ImageIcon,
			default: true,
		},
		{
			name: "seo",
			title: "SEO & Meta Tags",
			icon: EyeOpenIcon,
		},
	],
	fields: [
		defineField({
			name: "backgroundImage",
			type: "mediaAsset",
			group: "hero",
			description:
				"Upload a background image or provide an external URL. Use a landscape image for best results.",
			validation: rule => [
				rule.required().error("Provide a background image for the case studies page."),
			],
		}),
		defineField({
			name: "pageTitle",
			type: "string",
			group: "hero",
			title: "Page Title",
			description: "Title for the case studies page.",
			initialValue: "Case Studies",
			validation: rule => [
				rule.required().error("Add a page title."),
			],
		}),
		defineField({
			name: "description",
			type: "text",
			group: "hero",
			title: "Description",
			description: "Description text displayed below the page title",
			rows: 3,
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
			title: "pageTitle",
		},
		prepare({ title }) {
			return {
				title: title || "Case Studies Page",
				subtitle: "Case studies page configuration",
			};
		},
	},
});

