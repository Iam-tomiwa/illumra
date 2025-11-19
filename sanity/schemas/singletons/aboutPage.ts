import { TextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import * as demo from "@/sanity/lib/demo";

export const aboutPage = defineType({
	name: "aboutPage",
	title: "About Page",
	type: "document",
	icon: TextIcon,
	groups: [
		{
			name: "content",
			title: "Content",
			icon: TextIcon,
			default: true,
		},
		{
			name: "companyInfo",
			title: "Company Info",
			icon: TextIcon,
		},
	],
	fields: [
		defineField({
			name: "content",
			type: "aboutPageContent",
			group: "content",
			initialValue: demo.aboutPageContent,
			description:
				"Hero description and main content paragraphs describing the company.",
			validation: rule => [
				rule.required().error("Add content to publish the about page."),
			],
		}),
		defineField({
			name: "companyInfo",
			type: "companyInfo",
			group: "companyInfo",
			initialValue: demo.companyInfo,
			description: "Company overview and contact information.",
			validation: rule => [
				rule.required().error("Add company information to publish the about page."),
			],
		}),
	],
	preview: {
		select: {
			title: "content.heroDescription",
		},
		prepare({ title }) {
			return {
				title: title || "About Page",
				subtitle: "About page configuration",
			};
		},
	},
});
