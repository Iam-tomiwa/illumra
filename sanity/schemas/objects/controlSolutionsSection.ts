import { ControlsIcon, SparkleIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const controlSolutionsSection = defineType({
	name: "controlSolutionsSection",
	title: "Control Solutions Section",
	type: "object",
	icon: ControlsIcon,
	groups: [
		{
			name: "content",
			title: "Content",
			icon: ControlsIcon,
			default: true,
		},
		{
			name: "features",
			title: "Features",
			icon: SparkleIcon,
		},
	],
	fields: [
		defineField({
			name: "title",
			type: "string",
			group: "content",
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
			group: "content",
			rows: 3,
			description: "Optional supporting copy that introduces the features.",
			validation: rule => [
				rule.max(280).warning("Keep the subtitle under 280 characters."),
			],
		}),
		defineField({
			name: "features",
			type: "array",
			group: "features",
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

