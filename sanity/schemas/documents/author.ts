import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
	name: "author",
	title: "Author",
	icon: UserIcon,
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: rule => rule.required(),
		}),
		defineField({
			name: "picture",
			title: "Picture",
			type: "mediaAsset",
			description:
				"Author profile picture. You can upload an image or use an external URL.",
			validation: rule => [rule.required().error("Author picture is required.")],
		}),
		defineField({
			name: "role",
			type: "string",
			description: "Enter a role for the author.",
			validation: rule => [rule.error("Enter a role for the author.")],
		}),
	],
});
