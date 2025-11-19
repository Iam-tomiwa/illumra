import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import * as demo from "@/sanity/lib/demo";

export const homePage = defineType({
	name: "settings",
	title: "Settings",
	type: "document",
	icon: CogIcon,
	groups: [
		{
			name: "settings",
			title: "Settings",
			icon: CogIcon,
			default: true,
		},
	],
	fields: [],
	preview: {},
});
