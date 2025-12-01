import { HelpCircleIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const faqContent = defineType({
	name: "faqContent",
	title: "FAQ Content",
	type: "object",
	icon: HelpCircleIcon,
	fields: [
		defineField({
			name: "group",
			type: "string",
			description: "Choose the group of FAQ you want to add.",
			initialValue: "gettingStarted",
			options: {
				layout: "radio",
				list: [
					{ title: "Getting Started", value: "gettingStarted" },
					{ title: "FAQ", value: "faq" },
				],
			},
			validation: rule => [
				rule.required().error("Select the group of FAQ you want to add."),
			],
		}),
		defineField({
			name: "question",
			type: "string",
			description: "Enter a question for the FAQ.",
			validation: rule => [rule.required().error("Enter a question for the FAQ.")],
		}),
		defineField({
			name: "answer",
			type: "text",
			rows: 3,
			description: "Enter an answer for the FAQ.",
			validation: rule => [rule.required().error("Enter an answer for the FAQ.")],
		}),
	],
	preview: {
		select: {
			title: "question",
			answer: "answer",
		},
		prepare({ title, answer }) {
			return {
				title: title || "FAQ",
				subtitle: answer || "Answer",
			};
		},
	},
});
