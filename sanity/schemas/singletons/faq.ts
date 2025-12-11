import { faqContent } from "@/sanity/lib/demo";
import { HelpCircleIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const faq = defineType({
	name: "faq",
	title: "FAQ",
	type: "document",
	icon: HelpCircleIcon,
	initialValue: {
		visible: "show",
		title: "Need Help?",
		description: "Find quick answers to common questions or learn how to get started with Illumra's wireless control solutions.",
		items: faqContent
	},
	fields: [
		defineField({
			name: "visible",
			title: "Section Visibility",
			type: "string",
			description: "Choose whether to show or hide the FAQ section on the page.",
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
			description: "Heading displayed above the FAQ section.",
			initialValue: "Need Help?",
			validation: rule => [
				rule
					.required()
					.min(3)
					.max(80)
					.error("Add a title between 3 and 80 characters."),
			],
		}),
		defineField({
			name: "description",
			type: "text",
			rows: 3,
			description: "Supporting text displayed below the title.",
			initialValue:
				"Find quick answers to common questions or learn how to get started with Illumra's wireless control solutions.",
			validation: rule => [
				rule.max(280).warning("Keep the description under 280 characters."),
			],
		}),
		defineField({
			name: "items",
			title: "FAQ Items",
			type: "array",
			description: "Add frequently asked questions and their answers.",
			of: [defineArrayMember({ type: "faqContent" })],
			validation: rule => [
				rule.required().min(1).error("Add at least one FAQ item."),
				rule.unique().warning("Duplicate FAQ items were removed."),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			count: "items.length",
		},
		prepare({ title, count }) {
			return {
				title: title || "FAQ",
				subtitle: count ? `${count} question${count === 1 ? "" : "s"}` : "No questions yet",
			};
		},
	},
});

