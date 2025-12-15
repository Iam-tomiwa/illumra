import { defineField, defineType } from "sanity";

export const selectOption = defineType({
	name: "selectOption",
	title: "Select Option",
	type: "object",
	fields: [
		defineField({
			name: "label",
			type: "string",
			title: "Option Label",
			description: "Display text for this option",
			validation: rule => [
				rule.required().error("Option label is required."),
			],
		}),
		defineField({
			name: "value",
			type: "string",
			title: "Option Value",
			description: "Internal value for this option (used when submitted)",
			validation: rule => [
				rule.required().error("Option value is required."),
			],
		}),
	],
	preview: {
		select: {
			label: "label",
			value: "value",
		},
		prepare({ label, value }) {
			return {
				title: label || value || "Option",
				subtitle: value ? `Value: ${value}` : "",
			};
		},
	},
});

