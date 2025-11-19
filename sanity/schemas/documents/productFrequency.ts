import { ActivityIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "productFrequency",
	type: "document",
	title: "Product Frequency",
	icon: ActivityIcon,
	fields: [
		defineField({
			name: "label",
			type: "string",
			title: "Label",
			description: "Displayed label, e.g. “902 MHz”.",
			validation: rule => [
				rule.required().error("Provide a frequency label."),
				rule.max(20),
			],
		}),
		defineField({
			name: "value",
			type: "string",
			title: "Value",
			description: "Machine-friendly value used for filtering, e.g. 902mhz.",
			validation: rule => [
				rule
					.required()
					.regex(/^[a-z0-9\-]+$/i, {
						name: "slug",
						invert: false,
					})
					.error("Use letters, numbers, or dashes."),
			],
		}),
		defineField({
			name: "order",
			type: "number",
			description: "Optional ordering value for filter dropdowns.",
		}),
	],
	preview: {
		select: {
			title: "label",
			subtitle: "value",
		},
	},
});
