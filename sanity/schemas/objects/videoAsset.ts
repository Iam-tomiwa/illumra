import { VideoIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const videoAsset = defineType({
	name: "videoAsset",
	title: "Video",
	type: "object",
	icon: VideoIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			description: "Enter a title for the video.",
			validation: rule => [rule.required().error("Video title is required.")],
		}),
		defineField({
			name: "externalUrl",
			type: "url",
			description: "Enter a valid video url from vimeo or youtube.",
			validation: rule => [
				rule.uri({ scheme: ["https"] }).error("Video URL must use HTTPS."),
				rule.required().error("Video URL is required."),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			externalUrl: "externalUrl",
		},
		prepare({ title, externalUrl }) {
			return {
				title: title || "Video",
				subtitle: externalUrl,
			};
		},
	},
});
