import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const brandLogo = defineType({
	name: "brandLogo",
	title: "Brand Logo",
	type: "object",
	icon: TagIcon,
	fields: [
		defineField({
			name: "name",
			type: "string",
			description: "Brand name or label for the logo.",
			validation: rule => [
				rule
					.required()
					.min(2)
					.max(60)
					.error("Provide the brand name between 2 and 60 characters."),
			],
		}),
		defineField({
			name: "logo",
			type: "mediaAsset",
			description: "Upload the brand mark or link to an externally hosted version.",
			validation: rule => [
				rule.required().error("Add a logo image for this brand."),
			],
		}),
		defineField({
			name: "href",
			type: "url",
			description: "Optional link to the partner or brand website.",
			validation: rule => [
				rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
			],
		}),
	],
	preview: {
		select: {
			title: "name",
			media: "logo.image",
			source: "logo.source",
		},
		prepare({ title, media, source }) {
			return {
				title: title || "Brand",
				subtitle: source === "external" ? "External logo" : "Uploaded logo",
				media,
			};
		},
	},
});

