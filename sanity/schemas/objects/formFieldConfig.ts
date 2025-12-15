import { DocumentIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const formFieldConfig = defineType({
	name: "formFieldConfig",
	title: "Form Field Configuration",
	type: "object",
	icon: DocumentIcon,
	fields: [
		defineField({
			name: "fieldKey",
			type: "string",
			title: "Field Key",
			description: "Internal identifier for this field (e.g., 'name', 'email', 'phone')",
			validation: rule => [
				rule.required().error("Field key is required."),
				rule.regex(/^[a-z][a-z0-9]*$/i, {
					name: "alphanumeric",
					invert: false,
				}).error("Field key must be alphanumeric and start with a letter."),
			],
		}),
		defineField({
			name: "label",
			type: "string",
			title: "Field Label",
			description: "Display label for this field",
			validation: rule => [
				rule.required().error("Field label is required."),
			],
		}),
		defineField({
			name: "placeholder",
			type: "string",
			title: "Placeholder Text",
			description: "Placeholder text shown in the input field",
		}),
		defineField({
			name: "required",
			type: "boolean",
			title: "Required",
			description: "Whether this field is required",
			initialValue: false,
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
		defineField({
			name: "fieldType",
			type: "string",
			title: "Field Type",
			description: "Type of input field",
			options: {
				list: [
					{ title: "Text", value: "text" },
					{ title: "Email", value: "email" },
					{ title: "Phone", value: "tel" },
					{ title: "Textarea", value: "textarea" },
					{ title: "Select", value: "select" },
					{ title: "Number", value: "number" },
				],
			},
			initialValue: "text",
		}),
		defineField({
			name: "options",
			type: "array",
			title: "Select Options",
			description: "Options for select fields. Required when field type is 'Select'.",
			of: [defineArrayMember({ type: "selectOption" })],
			hidden: ({ parent }) => parent?.fieldType !== "select",
			validation: rule => [
				rule.custom((options, context) => {
					const parent = context.parent as { fieldType?: string } | undefined;
					if (parent?.fieldType === "select") {
						if (!options || options.length === 0) {
							return "Select fields require at least one option.";
						}
					}
					return true;
				}),
			],
		}),
	],
	preview: {
		select: {
			label: "label",
			fieldKey: "fieldKey",
			required: "required",
			visible: "visible",
		},
		prepare({ label, fieldKey, required, visible }) {
			return {
				title: label || fieldKey || "Unnamed Field",
				subtitle: `${fieldKey || ""}${required ? " • Required" : ""}${!visible ? " • Hidden" : ""}`,
			};
		},
	},
});

