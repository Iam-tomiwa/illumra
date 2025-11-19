import { ColorWheelIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productColor = defineType({
	name: "productColor",
	title: "Product Color",
	type: "object",
	icon: ColorWheelIcon,
	fields: [
		defineField({
			name: "name",
			type: "string",
			title: "Color Name",
			description:
				"Display name for the color variant (e.g., White, Light Almond, Ivory)",
			validation: rule => [
				rule.required().error("Color name is required."),
				rule.min(2).max(50).warning("Keep color names concise (2-50 characters)."),
			],
		}),
		defineField({
			name: "partNumber",
			type: "string",
			title: "Part Number / SKU",
			description:
				"Unique SKU or part number for this color variant (e.g., E9T-S1AWH)",
			validation: rule => [
				rule.required().error("Part number is required for each color variant."),
				rule
					.regex(/^[A-Za-z0-9\-]+$/u, {
						name: "alphanumeric",
						invert: false,
					})
					.error("Part number must contain only letters, numbers, or dashes."),
			],
		}),
		defineField({
			name: "hex",
			type: "string",
			title: "Hex Color Code",
			description: "Hex color code for display purposes (e.g., #FFFFFF)",
			validation: rule => [
				rule
					.regex(/^#[0-9A-Fa-f]{6}$/u, {
						name: "hex",
						invert: false,
					})
					.error("Enter a valid hex color code (e.g., #FFFFFF)."),
			],
		}),
	],
	preview: {
		select: {
			name: "name",
			partNumber: "partNumber",
			hex: "hex",
		},
		prepare({ name, partNumber }) {
			return {
				title: name || "Unnamed color",
				subtitle: partNumber ? `Part: ${partNumber}` : "No part number",
			};
		},
	},
});
