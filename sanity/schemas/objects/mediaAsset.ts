import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const mediaAsset = defineType({
	name: "mediaAsset",
	title: "Media",
	type: "object",
	icon: ImageIcon,
	fields: [
		defineField({
			name: "source",
			type: "string",
			initialValue: "upload",
			description:
				"Choose how you want to provide the asset. Upload for hosted media, or use External URL for images hosted elsewhere.",
			options: {
				layout: "radio",
				list: [
					{ title: "Upload", value: "upload" },
					{ title: "External URL", value: "external" },
				],
			},
			validation: rule => [
				rule.required().error("Select how this media should be provided."),
			],
		}),
		defineField({
			name: "image",
			type: "image",
			description: "Upload an image from your library.",
			options: {
				hotspot: true,
			},
			hidden: ({ parent }) => parent?.source !== "upload",
			validation: rule => [
				rule.custom((value, context) => {
					const source = (context.parent as { source?: string } | undefined)?.source;

					if (source === "upload" && !value?.asset?._ref) {
						return "Upload an image or switch to External URL.";
					}

					return true;
				}),
			],
		}),
		defineField({
			name: "externalUrl",
			type: "url",
			description: "Publicly accessible HTTPS image URL.",
			hidden: ({ parent }) => parent?.source !== "external",
			validation: rule => [
				rule.custom((value, context) => {
					const source = (context.parent as { source?: string } | undefined)?.source;

					if (source === "external") {
						if (!value) {
							return "Provide the external image URL or switch to Upload.";
						}
						// Validate HTTPS scheme only when value is provided
						if (value && !value.startsWith("https://")) {
							return "External URL must use HTTPS protocol.";
						}
						// Validate URI format
						try {
							const url = new URL(value);
							if (url.protocol !== "https:") {
								return "External URL must use HTTPS protocol.";
							}
						} catch {
							return "Please provide a valid URL.";
						}
					}

					return true;
				}),
			],
		}),
		defineField({
			name: "altText",
			type: "string",
			description:
				"Describe the image for accessibility and SEO. Helpful when the image cannot load.",
			validation: rule => [
				rule.max(160).warning("Aim for 160 characters or fewer."),
			],
		}),
	],
	preview: {
		select: {
			title: "altText",
			source: "source",
			image: "image",
			externalUrl: "externalUrl",
		},
		prepare({ title, source, image, externalUrl }) {
			return {
				title:
					title || (source === "external" ? "External image" : "Uploaded image"),
				subtitle:
					source === "external"
						? externalUrl
						: image?.asset?._ref
							? "Uploaded asset"
							: "No media selected",
				media: image,
			};
		},
	},
});
