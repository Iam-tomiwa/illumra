import { ControlsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const controlSolutionsSection = defineType({
	name: "controlSolutionsSection",
	title: "Control Solutions Section",
	type: "object",
	icon: ControlsIcon,
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
			name: "title",
			type: "string",
			description: "Heading presented above the feature list.",
			validation: rule => [
				rule
					.required()
					.min(3)
					.max(80)
					.error("Add a title between 3 and 80 characters."),
			],
		}),
		defineField({
			name: "subtitle",
			type: "text",
			rows: 3,
			description: "Optional supporting copy that introduces the features.",
			validation: rule => [
				rule.max(280).warning("Keep the subtitle under 280 characters."),
			],
		}),
		defineField({
			name: "features",
			type: "array",
			description: "Highlight up to four reasons teams choose this solution.",
			of: [defineArrayMember({ type: "iconFeature" })],
			validation: rule => [
				rule
					.required()
					.min(1)
					.error("Add at least one feature to spotlight your solution."),
				rule.max(6).warning("Consider highlighting no more than six features."),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "subtitle",
		},
		prepare({ title, subtitle }) {
			return {
				title: title || "Control solutions",
				subtitle: subtitle,
			};
		},
	},
});

