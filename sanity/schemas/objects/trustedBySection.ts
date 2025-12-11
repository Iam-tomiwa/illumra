import { UsersIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const trustedBySection = defineType({
	name: "trustedBySection",
	title: "Trusted By Section",
	type: "object",
	icon: UsersIcon,
	fields: [
		defineField({
			name: "visible",
			title: "Section Visibility",
			type: "string",
			description: "Choose whether to show or hide this section on the page.",
			initialValue: "show",
			options: {
				layout: "radio",
				list: [
					{ title: "Show", value: "show" },
					{ title: "Hide", value: "hide" },
				],
			},
			validation: rule => [
				rule.required().error("Select whether to show or hide this section."),
			],
		}),
		defineField({
			name: "heading",
			type: "string",
			description: "Short label displayed above the marquee of partner logos.",
			validation: rule => [
				rule
					.required()
					.min(3)
					.max(80)
					.error("Write a heading between 3 and 80 characters."),
			],
		}),
		defineField({
			name: "logos",
			type: "array",
			description:
				"Add the partner or customer logos that should rotate in the marquee.",
			of: [defineArrayMember({ type: "brandLogo" })],
			validation: rule => [
				rule.required().min(3).error("Add at least three logos to build trust."),
				rule
					.max(12)
					.warning("Large marquees can become overwhelming. Keep it focused."),
			],
		}),
	],
	preview: {
		select: {
			title: "heading",
			count: "logos.length",
		},
		prepare({ title, count }) {
			return {
				title: title || "Trusted by",
				subtitle: count ? `${count} logo${count === 1 ? "" : "s"}` : "No logos yet",
			};
		},
	},
});
