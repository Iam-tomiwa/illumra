import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "productCategory",
	type: "document",
	title: "Product Category",
	icon: TagIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Name",
			validation: rule => [
				rule.required().error("Categories must have a name."),
				rule.max(80).warning("Names longer than 80 characters may truncate in the UI."),
			],
		}),
		defineField({
			name: "slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 64,
			},
			validation: rule => [
				rule.required().error("Categories need a slug for referencing."),
			],
		}),
		defineField({
			name: "description",
			type: "text",
			rows: 3,
			description: "Optional description to help editors pick the right category.",
		}),
		defineField({
			name: "order",
			type: "number",
			description:
				"Optional ordering value for navigation. Lower numbers appear first.",
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "slug.current",
		},
		prepare({ title, subtitle }) {
			return {
				title: title || "Category",
				subtitle,
			};
		},
	},
});

