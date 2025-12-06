import { PinIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "store",
	type: "document",
	title: "Store / Distributor",
	icon: PinIcon,
	fields: [
		defineField({
			name: "name",
			type: "string",
			validation: rule => [
				rule.required().error("Store name is required for display."),
				rule.max(100).warning("Names longer than 100 characters may truncate."),
			],
		}),
		defineField({
			name: "storeType",
			type: "string",
			title: "Type",
			options: {
				list: [
					{ title: "Distributor", value: "distributor" },
					{ title: "Sales Rep", value: "rep" },
					{ title: "Retailer", value: "retailer" },
				],
				layout: "radio",
			},
			initialValue: "distributor",
			validation: rule => [rule.required().error("Store type is required.")],
		}),
		defineField({
			name: "address",
			type: "string",
			description: "Street address",
			validation: rule => [rule.required().error("Address is required for the map.")],
		}),
		defineField({
			name: "city",
			type: "string",
			validation: rule => [rule.required().error("City is required.")],
		}),
		defineField({
			name: "state",
			type: "string",
			description: "State or province",
		}),
		defineField({
			name: "zipCode",
			type: "string",
			title: "ZIP / Postal Code",
		}),
		defineField({
			name: "country",
			type: "string",
			initialValue: "USA",
			validation: rule => [rule.required().error("Country is required.")],
		}),
		defineField({
			name: "phone",
			type: "string",
		}),
		defineField({
			name: "email",
			type: "string",
			validation: rule => [
				rule.email().error("Please enter a valid email address."),
			],
		}),
		defineField({
			name: "website",
			type: "string",
			validation: (rule) => [
				rule.custom((value) => {
					if (!value) return true;
					try {
						new URL(value);
						return true;
					} catch {
						return "Please enter a valid URL (e.g., https://example.com)";
					}
				}),
			],
		}),
		defineField({
			name: "location",
			type: "geopoint",
			description: "Optional: Only needed if automatic geocoding from the address is inaccurate.",
		}),
	],
	preview: {
		select: {
			title: "name",
			city: "city",
			state: "state",
			storeType: "storeType",
		},
		prepare({ title, city, state, storeType }) {
			const typeLabels: Record<string, string> = {
				distributor: "Distributor",
				rep: "Sales Rep",
				retailer: "Retailer",
			};
			return {
				title: title || "Unnamed Store",
				subtitle: [city, state].filter(Boolean).join(", ") || storeType
					? typeLabels[storeType]
					: "",
			};
		},
	},
});
