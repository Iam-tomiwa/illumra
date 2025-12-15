import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const quoteFormField = defineType({
	name: "quoteFormField",
	title: "Quote Form Field",
	type: "object",
	icon: DocumentIcon,
	fields: [
		defineField({
			name: "fieldKey",
			type: "string",
			title: "Field",
			description: "Select which field to configure",
			options: {
				list: [
					{ title: "Product of Interest", value: "productSlug" },
					{ title: "Color", value: "colorId" },
					{ title: "Phone Number", value: "phone" },
					{ title: "Name", value: "name" },
					{ title: "Company", value: "company" },
					{ title: "Email", value: "email" },
					{ title: "State", value: "state" },
					{ title: "Inquiry Type", value: "inquiryType" },
					{ title: "Message", value: "message" },
				],
			},
			validation: rule => [
				rule.required().error("Field selection is required."),
			],
		}),
		defineField({
			name: "visible",
			type: "boolean",
			title: "Visible",
			description: "Whether this field should be displayed",
			initialValue: true,
		}),
		defineField({
			name: "order",
			type: "number",
			title: "Display Order",
			description: "Order in which this field appears (lower numbers appear first)",
			validation: rule => [
				rule.required().error("Display order is required."),
				rule.min(0).error("Display order must be 0 or greater."),
			],
		}),
	],
	preview: {
		select: {
			fieldKey: "fieldKey",
			visible: "visible",
			order: "order",
		},
		prepare({ fieldKey, visible, order }) {
			const fieldLabels: Record<string, string> = {
				productSlug: "Product of Interest",
				colorId: "Color",
				phone: "Phone Number",
				name: "Name",
				company: "Company",
				email: "Email",
				state: "State",
				inquiryType: "Inquiry Type",
				message: "Message",
			};
			return {
				title: fieldLabels[fieldKey as string] || fieldKey || "Unknown Field",
				subtitle: `Order: ${order || 0}${!visible ? " • Hidden" : ""}`,
			};
		},
	},
});

