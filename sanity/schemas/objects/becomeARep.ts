import { UsersIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const becomeARep = defineType({
	name: "becomeARep",
	title: "Become a Rep",
	type: "object",
	icon: UsersIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Rep Section Title",
			description: "Heading for the 'Become a Rep' section.",
			initialValue: "Become a Rep",
			validation: rule => [
				rule.required().error("Add a rep section title."),
			],
		}),
		defineField({
			name: "description",
			type: "array",
			title: "Rep Description",
			description: "Description paragraphs for the rep section.",
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
				rule.required().error("Add description text for the rep section."),
				rule.min(1).error("Add at least one paragraph."),
			],
		}),
		defineField({
			name: "button",
			title: "Rep Button",
			type: "linkAction",
			description: "Button for the rep section.",
			validation: rule => [
				rule.required().error("Add a button for the rep section."),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
		},
		prepare({ title }) {
			return {
				title: title || "Become a Rep",
				subtitle: "Rep section configuration",
			};
		},
	},
});

