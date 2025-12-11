import { TextIcon, BookIcon, ImageIcon, SparkleIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import * as demo from "@/sanity/lib/demo";

export const aboutPage = defineType({
	name: "aboutPage",
	title: "About Page",
	type: "document",
	icon: TextIcon,
	groups: [
		{ 
			name: "hero",
			title: "About Us Info",
			icon: ImageIcon,
			default: true,
		},
		{
			name: "features",
			title: "Why Choose Us",
			icon: SparkleIcon,
		},
		{
			name: "enocean",
			title: "EnOcean Section",
			icon: BookIcon,
		},
	],
	fields: [
		// Hero Section
		defineField({
			name: "backgroundImage",
			type: "mediaAsset",
			group: "hero",
			description:
				"Upload a background image or provide an external URL. Use a landscape image for best results.",
			validation: rule => [
				rule.required().error("Provide a background image for the about page."),
			],
		}),
		defineField({
			name: "pageTitle",
			type: "string",
			group: "hero",
			title: "Page Title",
			description: "Title for the about page.",
			initialValue: "About Us",
			validation: rule => [
				rule.error("Add a page title."),
			],
		}),
		// Company Overview Section
	
		defineField({
			name: "companyInfo",
			type: "companyInfo",
			group: "hero",
			description: "Company overview and contact information.",
			validation: rule => [
				rule.required().error("Add company information to publish the about page."),
			],
		}),
		// Why Choose Us Section
		defineField({
			name: "featuresTitle",
			type: "string",
			group: "features",
			title: "Features Section Title",
			description: "Heading for the 'Why Choose Us' section.",
			initialValue: "Why Illumra",
			validation: rule => [
				rule.required().error("Add a features section title."),
			],
		}),
		defineField({
			name: "features",
			type: "array",
			group: "features",
			title: "Feature Cards",
			description: "Highlight key reasons to choose your company.",
			of: [defineArrayMember({ type: "iconFeature" })],
			validation: rule => [
				rule.min(1).error("Add at least one feature."),
				rule.max(6).warning("Consider showing 3-6 features for best layout."),
			],
		}),
		// EnOcean Section
		defineField({
			name: "enoceanVisible",
			title: "EnOcean Section Visibility",
			type: "string",
			group: "enocean",
			description: "Choose whether to show or hide the EnOcean section.",
			initialValue: "show",
			options: {
				layout: "radio",
				list: [
					{ title: "Show", value: "show" },
					{ title: "Hide", value: "hide" },
				],
			},
		}),
		defineField({
			name: "enoceanTitle",
			type: "string",
			group: "enocean",
			title: "EnOcean Section Title",
			description: "Heading for the EnOcean section.",
			initialValue: "The EnOcean Radio Standard",
			validation: rule => [
				rule.required().error("Add an EnOcean section title."),
			],
		}),
		defineField({
			name: "enoceanDescription",
			type: "text",
			group: "enocean",
			rows: 3,
			title: "EnOcean Description",
			description: "Description text for the EnOcean section.",
			initialValue: "Learn about the EnOcean radio protocol that powers our wireless control solutions.",
		}),
		defineField({
			name: "enoceanAction",
			type: "linkAction",
			group: "enocean",
			title: "EnOcean Button",
			description: "Call-to-action button for the EnOcean section.",
		}),
		defineField({
			name: "enoceanImage",
			type: "mediaAsset",
			group: "enocean",
			title: "EnOcean Image",
			description: "Image displayed alongside the EnOcean content.",
		}),
	],
	preview: {
		select: {
			title: "pageTitle",
		},
		prepare({ title }) {
			return {
				title: title || "About Page",
				subtitle: "About page configuration",
			};
		},
	},
});
