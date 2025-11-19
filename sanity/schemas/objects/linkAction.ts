import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const linkAction = defineType({
	name: "linkAction",
	title: "Link Action",
	type: "object",
	icon: LinkIcon,
	description:
		"Configure a navigational action shown as a button or link in the interface.",
	fields: [
		defineField({
			name: "label",
			type: "string",
			description: "The readable text presented to the user.",
			validation: rule => [
				rule
					.min(1)
					.max(48)
					.error("Provide an action label between 1 and 48 characters."),
			],
		}),
		defineField({
			name: "href",
			type: "url",
			description:
				"Destination for the action. Use a relative path for internal pages, or a full URL for external destinations.",
			validation: rule => [
				rule
					.uri({
						allowRelative: true,
						scheme: ["http", "https", "mailto", "tel"],
					})
					.error("Provide a valid relative path or URL."),
			],
		}),
		defineField({
			name: "icon",
			type: "string",
			description:
				"Optional Iconify icon name (for example solar:lightning-bold). The icon appears beside the label. For reference, see https://icon-sets.iconify.design/ and copy icon name from the icon you want to use.",
			validation: rule => [
				rule.max(64).warning("Icon names are typically short and descriptive."),
			],
		}),
	],
	preview: {
		select: {
			title: "label",
			subtitle: "href",
		},
		prepare({ title, subtitle }) {
			return {
				title: title || "Action",
				subtitle: subtitle || "Missing destination",
			};
		},
	},
});
