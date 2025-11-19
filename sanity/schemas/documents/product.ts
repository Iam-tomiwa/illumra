import { CubeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import { specificationEntry } from "@/sanity/schemas/objects/specificationEntry";
import { resourceLink } from "@/sanity/schemas/objects/resourceLink";
import { productColor } from "@/sanity/schemas/objects/productColor";

const featureTags = [
	{ title: "Featured", value: "featured" },
	{ title: "Standard", value: "standard" },
];

export default defineType({
	name: "product",
	type: "document",
	title: "Product",
	icon: CubeIcon,
	groups: [
		{ name: "content", title: "Content", icon: CubeIcon, default: true },
		{ name: "specifications", title: "Specifications", icon: CubeIcon },
		{ name: "media", title: "Media", icon: CubeIcon },
		{ name: "resources", title: "Resources", icon: CubeIcon },
	],
	fields: [
		defineField({
			name: "title",
			type: "string",
			title: "Name",
			group: "content",
			validation: rule => [
				rule.required().error("Products must have a name."),
				rule
					.min(4)
					.max(120)
					.warning("Keep product names concise (4-120 characters)."),
			],
		}),
		defineField({
			name: "sku",
			type: "string",
			group: "content",
			description: "Base stock keeping unit. If product has color variants, this is the base SKU.",
			validation: rule => [
				rule
					.required()
					.regex(/^[A-Za-z0-9\-]+$/u, {
						name: "alphanumeric",
						invert: false,
					})
					.error("Enter the SKU using letters, numbers, or dashes."),
			],
		}),
		defineField({
			name: "colors",
			type: "array",
			group: "content",
			title: "Color Variants",
			description: "Available color options with their part numbers.",
			of: [defineArrayMember({ type: productColor.name })],
			validation: rule => [
				rule.unique().warning("Duplicate color variants were removed."),
			],
		}),
		defineField({
			name: "slug",
			type: "slug",
			group: "content",
			options: {
				source: "title",
				maxLength: 64,
			},
			validation: rule => [
				rule.required().error("Products need a slug to generate detail pages."),
			],
		}),
		defineField({
			name: "category",
			type: "reference",
			group: "content",
			to: [{ type: "productCategory" }],
			validation: rule => [
				rule.required().error("Select a category to enable filtering."),
			],
		}),
		defineField({
			name: "voltage",
			type: "reference",
			group: "content",
			to: [{ type: "productVoltage" }],
			validation: rule => [
				rule.required().error("Select the primary voltage for this product."),
			],
		}),
		defineField({
			name: "frequency",
			type: "reference",
			group: "content",
			to: [{ type: "productFrequency" }],
			validation: rule => [
				rule.required().error("Select the wireless frequency."),
			],
		}),
		defineField({
			name: "protocols",
			type: "array",
			group: "content",
			description: "Protocols supported by this product.",
			of: [
				defineArrayMember({
					type: "reference",
					to: [{ type: "productProtocol" }],
				}),
			],
			validation: rule => [
				rule.unique().warning("Duplicate protocols were removed."),
			],
		}),
		defineField({
			name: "featureTag",
			type: "string",
			title: "Featured Status",
			group: "content",
			description:
				"Mark products as Featured to display them in highlighted sections.",
			options: {
				list: featureTags,
				layout: "radio",
			},
			initialValue: "standard",
		}),
		defineField({
			name: "shortDescription",
			type: "text",
			group: "content",
			rows: 3,
			description: "Short marketing copy shown on cards and summaries.",
			validation: rule => [
				rule
					.required()
					.min(40)
					.max(320)
					.error("Write a short description between 40 and 320 characters."),
			],
		}),
		defineField({
			name: "body",
			type: "array",
			group: "content",
			description: "Rich descriptive content for the detail page.",
			of: [
				defineArrayMember({
					type: "block",
					styles: [
						{ title: "Normal", value: "normal" },
						{ title: "Heading 2", value: "h2" },
						{ title: "Heading 3", value: "h3" },
					],
					lists: [{ title: "Bullet", value: "bullet" }],
				}),
			],
		}),
		defineField({
			name: "specifications",
			type: "array",
			group: "specifications",
			description: "Technical specifications displayed in tables or lists.",
			of: [defineArrayMember({ type: specificationEntry.name })],
			validation: rule => [
				rule
					.required()
					.min(1)
					.error("Add at least one specification for every product."),
			],
		}),
		defineField({
			name: "images",
			type: "array",
			group: "media",
			description: "Gallery images displayed in product cards and detail pages.",
			of: [
				defineArrayMember({
					type: "mediaAsset",
				}),
			],
			validation: rule => [
				rule.required().min(1).error("Upload at least one product image."),
			],
		}),
		defineField({
			name: "downloads",
			type: "array",
			title: "Downloads",
			group: "resources",
			description: "Datasheets, installation guides and other documents.",
			of: [defineArrayMember({ type: resourceLink.name })],
		}),
		defineField({
			name: "applications",
			type: "array",
			group: "resources",
			description: "Bullet list of common use cases or application links.",
			of: [
				defineArrayMember({
					type: "object",
					name: "application",
					title: "Application",
					fields: [
						defineField({
							name: "title",
							type: "string",
							validation: rule => [rule.required().error("Add an application title.")],
						}),
						defineField({
							name: "url",
							type: "url",
							validation: rule => [rule.uri({ scheme: ["http", "https"] })],
						}),
					],
					preview: {
						select: { title: "title", subtitle: "url" },
					},
				}),
			],
		}),
		defineField({
			name: "wiringDiagrams",
			type: "array",
			group: "resources",
			description: "Wiring diagrams associated with the product.",
			of: [defineArrayMember({ type: resourceLink.name })],
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "sku",
			media: "images.0.image",
		},
		prepare({ title, subtitle, media }) {
			return {
				title: title || "Untitled product",
				subtitle: subtitle ? `SKU: ${subtitle}` : "SKU not set",
				media,
			};
		},
	},
});
