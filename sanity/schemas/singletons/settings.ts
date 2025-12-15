import { CogIcon, EyeOpenIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const settings = defineType({
	name: "settings",
	title: "Settings",
	type: "document",
	icon: CogIcon,
	groups: [
		{
			name: "navigation",
			title: "Navigation",
			icon: CogIcon,
			default: true,
		},
		{
			name: "seo",
			title: "SEO & Meta Tags",
			icon: EyeOpenIcon,
		},
	],
	fields: [
		defineField({
			name: "logo",
			type: "mediaAsset",
			title: "Logo",
			group: "navigation",
			description: "Logo displayed in the navigation bar",
			validation: rule => [
				rule.required().error("Logo is required for the navigation."),
			],
		}),
		defineField({
			name: "ctaButton",
			type: "linkAction",
			title: "Get a Quote Button",
			group: "navigation",
			description: "Configuration for the 'Get a Quote' button in the navigation",
			validation: rule => [
				rule.required().error("CTA button configuration is required."),
			],
		}),
		defineField({
			name: "seo",
			type: "seo",
			title: "Default SEO & Meta Tags",
			group: "seo",
			description: "Default SEO metadata used across all pages (can be overridden on individual pages)",
		}),
	],
	preview: {
		prepare() {
			return {
				title: "General Settings",
				subtitle: "Site settings and navigation configuration",
			};
		},
	},
});
