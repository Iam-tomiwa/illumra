import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import authorType from "../documents/author";

export const testimonials = defineType({
	name: "testimonials",
	title: "Testimonials",
	type: "object",
	icon: StarIcon,
	fields: [
		defineField({
			name: "author",
			title: "Author",
			type: "reference",
			to: [{ type: authorType.name }],
		}),
		defineField({
			name: "testimony",
			type: "text",
			rows: 3,
			description: "What has this person said about the product?",
			validation: rule => [
				rule.required().error("Enter a testimony for the testimonial."),
			],
		}),
	],
	preview: {
		select: {
			title: "author.name",
			testimony: "testimony",
		},
		prepare({ title, testimony }) {
			return {
				title: title || "Testimonial",
				subtitle: testimony || "No testimony provided",
			};
		},
	},
});
