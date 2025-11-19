import { BookIcon, ComposeIcon, SparkleIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutSection = defineType({
	name: "aboutSection",
	title: "About Section",
	type: "object",
	icon: BookIcon,
	groups: [
		{
			name: "content",
			title: "Content",
			icon: ComposeIcon,
			default: true,
		},
		{
			name: "cta",
			title: "Call To Action",
			icon: BookIcon,
		},
		{
			name: "features",
			title: "Feature Highlights",
			icon: SparkleIcon,
		},
		{
			name: "media",
			title: "Background",
			icon: BookIcon,
		},
	],
	fields: [
		defineField({
			name: "title",
			type: "string",
			group: "content",
			description: "Heading displayed on the About section.",
			validation: rule => [
				rule
					.required()
					.min(3)
					.max(80)
					.error("Provide an about title between 3 and 80 characters."),
			],
		}),
		defineField({
			name: "body",
			type: "array",
			group: "content",
			description: "Paragraphs that describe your organisation.",
			of: [
				defineArrayMember({
					type: "block",
					styles: [{ title: "Paragraph", value: "normal" }],
					lists: [],
					marks: {
						decorators: [],
						annotations: [],
					},
				}),
			],
			validation: rule => [
				rule
					.required()
					.min(1)
					.error("Add at least one paragraph to introduce your company."),
				rule.max(6).warning("Keep the about copy focused and readable."),
			],
		}),
		defineField({
			name: "cta",
			type: "linkAction",
			group: "cta",
			description: "Optional button displayed under the about copy.",
		}),
		defineField({
			name: "background",
			type: "mediaAsset",
			group: "media",
			description: "Background image used behind the section.",
			validation: rule => [
				rule.required().error("Add a background image or external URL."),
			],
		}),
		defineField({
			name: "features",
			type: "array",
			group: "features",
			description: "Highlight supporting points in card format.",
			of: [defineArrayMember({ type: "iconFeature" })],
			validation: rule => [
				rule
					.required()
					.min(1)
					.error("List at least one supporting feature."),
				rule.max(6).warning("Consider highlighting no more than six features."),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			count: "features.length",
		},
		prepare({ title, count }) {
			return {
				title: title || "About section",
				subtitle: count ? `${count} feature${count === 1 ? "" : "s"}` : undefined,
			};
		},
	},
});

