import { BoltIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "productVoltage",
	type: "document",
	title: "Product Voltage",
	icon: BoltIcon,
	fields: [
		defineField({
			name: "label",
			type: "string",
			title: "Label",
			description: "Displayed label, e.g. “120V”.",
			validation: rule => [
				rule.required().error("Provide a voltage label."),
				rule.max(20),
			],
		}),
		defineField({
			name: "value",
			type: "string",
			title: "Value",
			description: "Machine-friendly value used in filters (e.g. 120v, 240v).",
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
			description:
				"Optional ordering value. Lower numbers appear first in filters.",
		}),
	],
	preview: {
		select: {
			title: "label",
			subtitle: "value",
		},
	},
});
