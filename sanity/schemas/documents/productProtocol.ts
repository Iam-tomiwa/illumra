import { DocumentSheetIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "productProtocol",
	type: "document",
	title: "Product Protocol",
	icon: DocumentSheetIcon,
	fields: [
		defineField({
			name: "label",
			type: "string",
			title: "Label",
			description: "Displayed label, e.g. “BACnet” or “IoT”.",
			validation: rule => [
				rule.required().error("Provide a protocol label."),
				rule.max(40),
			],
		}),
		defineField({
			name: "value",
			type: "string",
			title: "Value",
			description: "Machine-friendly value used in queries (e.g. bacnet, iot).",
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
			name: "description",
			type: "text",
			rows: 2,
			description: "Optional description for editor context.",
		}),
		defineField({
			name: "order",
			type: "number",
			description: "Optional ordering value to control filter sort order.",
		}),
	],
	preview: {
		select: {
			title: "label",
			subtitle: "value",
		},
	},
});
