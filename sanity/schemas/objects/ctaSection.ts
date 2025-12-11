import { RocketIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const ctaSection = defineType({
	name: "ctaSection",
	title: "CTA Section",
	type: "object",
	icon: RocketIcon,
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
			description: "Main heading for the CTA section.",
			initialValue: "Ready to Get Started?",
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
				"Request a quote for our wireless control solutions and receive pricing tailored to your project needs",
			validation: rule => [
				rule.max(280).warning("Keep the description under 280 characters."),
			],
		}),
		defineField({
			name: "action",
			type: "linkAction",
			description: "Button that drives visitors to take action.",
			validation: rule => [
				rule.required().error("Add a call-to-action button."),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
		},
		prepare({ title, subtitle }) {
			return {
				title: title || "CTA Section",
				subtitle: subtitle || "Call to action",
			};
		},
	},
});

