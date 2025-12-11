import { ImageIcon, LinkIcon, DashboardIcon, EyeOpenIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const heroSection = defineType({
	name: "heroSection",
	title: "Hero Section",
	type: "object",
	icon: DashboardIcon,
	groups: [
		{
			name: "content",
			title: "Content",
			icon: DashboardIcon,
			default: true,
		},
		{
			name: "actions",
			title: "Actions",
			icon: LinkIcon,
		},
		{
			name: "media",
			title: "Media",
			icon: ImageIcon,
		},
	],
	fields: [
		defineField({
			name: "headline",
			type: "string",
			group: "content",
			description: "Primary headline for the hero section.",
			validation: rule => [
				rule
					.required()
					.min(6)
					.max(120)
					.error("Provide a headline between 6 and 120 characters."),
			],
		}),
		defineField({
			name: "summary",
			type: "text",
			group: "content",
			rows: 3,
			description:
				"Supporting copy that elaborates on the headline. Keep it concise and benefit focused.",
			validation: rule => [
				rule
					.required()
					.min(24)
					.max(280)
					.error("Write a summary between 24 and 280 characters."),
			],
		}),
		defineField({
			name: "primaryAction",
			type: "linkAction",
			group: "actions",
			description: "Main action for the hero section.",
			validation: rule => [
				rule.required().error("Add the primary action so visitors can respond."),
			],
		}),
		defineField({
			name: "secondaryAction",
			type: "linkAction",
			group: "actions",
			description: "Optional secondary action shown next to the primary action.",
		}),
		defineField({
			name: "backgroundImage",
			type: "mediaAsset",
			group: "media",
			description:
				"Upload a background image or provide an external URL. Use a landscape image for best results.",
			validation: rule => [
				rule.required().error("Provide a background image for the hero."),
			],
		}),
	],
	preview: {
		select: {
			title: "headline",
			subtitle: "attentionLabel",
			media: "backgroundImage.image",
		},
		prepare({ title, subtitle, media }) {
			return {
				title: title || "Hero",
				subtitle: subtitle || "Hero section",
				media,
			};
		},
	},
});
