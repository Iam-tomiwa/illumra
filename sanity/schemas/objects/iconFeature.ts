import { SparkleIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const iconFeature = defineType({
	name: "iconFeature",
	title: "Icon Feature",
	type: "object",
	icon: SparkleIcon,
	fields: [
		defineField({
			name: "icon",
			type: "string",
			description:
				"Iconify name for the feature (for example, lucide:rocket or solar:lightning-bold).",
			validation: rule => [
				rule
					.required()
					.error("Provide the Iconify name so the feature can display an icon."),
				rule
					.max(64)
					.warning("Icon names are typically concise; double-check the spelling."),
			],
		}),
		defineField({
			name: "title",
			type: "string",
			description: "Short headline that introduces the feature.",
			validation: rule => [
				rule
					.required()
					.min(3)
					.max(80)
					.error("Feature titles must be between 3 and 80 characters."),
			],
		}),
		defineField({
			name: "description",
			type: "text",
			rows: 3,
			description: "Supporting copy that explains the benefit.",
			validation: rule => [
				rule
					.required()
					.min(16)
					.max(280)
					.error("Write a description between 16 and 280 characters."),
			],
		}),
		defineField({
			name: "url",
			type: "url",
			description:
				"Optional URL that renders the card as a clickable link (can be relative e.g /posts/my-post or absolute e.g https://illumra.com/bluetooth-light-switch-by-illumra).",
			validation: rule => [rule.uri({ scheme: ["http", "https"] })],
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
		},
		prepare({ title, subtitle }) {
			return {
				title: title || "Feature",
				subtitle: subtitle,
			};
		},
	},
});
