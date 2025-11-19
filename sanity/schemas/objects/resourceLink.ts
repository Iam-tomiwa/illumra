import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const resourceLink = defineType({
	name: "resourceLink",
	title: "Resource Link",
	type: "object",
	icon: DocumentIcon,
	description:
		"Downloadable or external resource such as datasheets or wiring diagrams.",
	fields: [
		defineField({
			name: "title",
			type: "string",
			description:
				"Short label shown to users, e.g. “Datasheet” or “Installation Guide”.",
			validation: rule => [
				rule
					.required()
					.min(2)
					.max(80)
					.error("Provide a resource title between 2 and 80 characters."),
			],
		}),
		defineField({
			name: "file",
			type: "file",
			description: "Upload the PDF if it is hosted in Sanity.",
			options: {
				accept: ".pdf",
			},
		}),
		defineField({
			name: "externalUrl",
			type: "url",
			description: "Optional external URL if the resource is hosted elsewhere.",
			validation: rule => [rule.uri({ scheme: ["http", "https"] })],
		}),
	],
	preview: {
		select: {
			title: "title",
			file: "file.asset._ref",
			externalUrl: "externalUrl",
		},
		prepare({ title, file, externalUrl }) {
			return {
				title: title || "Resource",
				subtitle: file ? "Sanity file" : externalUrl || "No link configured",
			};
		},
	},
	validation: rule => [
		rule.custom(resource => {
			if (!resource?.file && !resource?.externalUrl) {
				return "Upload a file or provide an external URL.";
			}
			return true;
		}),
	],
});
