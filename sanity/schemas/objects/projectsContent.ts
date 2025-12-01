import { Building2Icon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const projectsContent = defineType({
	name: "projectsContent",
	title: "Projects Content",
	type: "object",
	icon: Building2Icon,
	fields: [
		defineField({
			name: "picture",
			title: "Picture",
			type: "mediaAsset",
			description:
				"Project picture. You can upload an image or use an external URL.",
			validation: rule => [rule.required().error("Project picture is required.")],
		}),
		defineField({
			name: "title",
			type: "string",
			description: "Enter the title of the project.",
			validation: rule => [
				rule.required().error("Enter the title of the project."),
			],
		}),
		defineField({
			name: "projectCategory",
			type: "string",
			description: "Enter the category of the project.",
			validation: rule => [
				rule.required().error("Enter the category of the project."),
			],
		}),
		defineField({
			name: "url",
			type: "url",
			description: "Enter the URL of the project.",
			validation: rule => [rule.required().error("Enter the URL of the project.")],
		}),
	],
	preview: {
		select: {
			title: "title",
			projectCategory: "projectCategory",
			url: "url",
			picture: "picture",
		},
		prepare({ title, projectCategory, url, picture }) {
			return {
				title: title || "Project",
				subtitle: projectCategory || "Category",
				media: picture || null,
			};
		},
	},
});
