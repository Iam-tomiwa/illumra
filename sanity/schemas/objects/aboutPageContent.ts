import { BookIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const aboutPageContent = defineType({
	name: "aboutPageContent",
	title: "About Page Content",
	type: "object",
	icon: BookIcon,
	fields: [
		defineField({
			name: "heroDescription",
			type: "text",
			rows: 3,
			description:
				"Short description shown below the page title in the hero section.",
			validation: rule => [
				rule
					.required()
					.min(20)
					.max(200)
					.error("Provide a description between 20 and 200 characters."),
			],
		}),
		defineField({
			name: "paragraphs",
			type: "array",
			description: "Main content paragraphs describing the company.",
			of: [{ type: "block" }],
			validation: rule => [
				rule
					.required()
					.min(1)
					.error("Add at least one paragraph to describe your company."),
				rule.max(10).warning("Consider keeping the content focused and readable."),
			],
		}),
	],
	preview: {
		select: {
			heroDescription: "heroDescription",
			paragraphs: "paragraphs",
		},
		prepare({ heroDescription, paragraphs }) {
			const count = paragraphs?.length || 0;
			return {
				title: heroDescription || "About Page Content",
				subtitle: count ? `${count} paragraph${count === 1 ? "" : "s"}` : undefined,
			};
		},
	},
});
