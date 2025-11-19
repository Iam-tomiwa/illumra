import { TextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const specificationEntry = defineType({
	name: "specificationEntry",
	title: "Specification Entry",
	type: "object",
	icon: TextIcon,
	fields: [
		defineField({
			name: "label",
			type: "string",
			description:
				"Name of the specification, for example “Range” or “Dimensions”.",
			validation: rule => [
				rule
					.required()
					.min(2)
					.max(80)
					.error("Add a specification label between 2 and 80 characters."),
			],
		}),
		defineField({
			name: "value",
			type: "text",
			rows: 2,
			description:
				"Specification value. Supports multi-line values for complex entries.",
			validation: rule => [
				rule
					.required()
					.min(1)
					.max(400)
					.error("Provide the specification value (max 400 characters)."),
			],
		}),
	],
	preview: {
		select: {
			title: "label",
			subtitle: "value",
		},
		prepare({ title, subtitle }) {
			return {
				title: title || "Specification",
				subtitle,
			};
		},
	},
});
