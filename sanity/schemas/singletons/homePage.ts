import { HomeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import * as demo from "@/sanity/lib/demo";

export const homePage = defineType({
	name: "homePage",
	title: "Homepage",
	type: "document",
	icon: HomeIcon,
	groups: [
		{
			name: "hero",
			title: "Hero",
			icon: HomeIcon,
			default: true,
		},
		{
			name: "controlSolutions",
			title: "Control Solutions",
			icon: HomeIcon,
		},
		{
			name: "trustedBy",
			title: "Trusted By",
			icon: HomeIcon,
		},
		{
			name: "about",
			title: "About",
			icon: HomeIcon,
		},
		{
			name: "projects",
			title: "Projects",
			icon: HomeIcon,
		},
		{
			name: "testimonials",
			title: "Testimonials",
			icon: HomeIcon,
		},
		{
			name: "faq",
			title: "FAQ",
			icon: HomeIcon,
		},
	],
	fields: [
		defineField({
			name: "hero",
			type: "heroSection",
			group: "hero",
			initialValue: demo.heroSection,
			description:
				"Content shown at the top of the homepage. Updating this section refreshes the hero instantly.",
			validation: rule => [
				rule
					.required()
					.error("Add hero content to publish changes to the homepage hero."),
			],
		}),
		defineField({
			name: "controlSolutions",
			type: "controlSolutionsSection",
			group: "controlSolutions",
			initialValue: demo.controlSolutionsSection,
			description:
				"Feature highlights that explain why teams choose your control solutions.",
			validation: rule => [
				rule
					.required()
					.error("Configure the control solutions section to publish the homepage."),
			],
		}),
		defineField({
			name: "trustedBy",
			type: "trustedBySection",
			group: "trustedBy",
			initialValue: demo.trustedBySection,
			description: "Logos from partners or customers displayed in the marquee.",
			validation: rule => [
				rule
					.required()
					.error("Add partner logos so visitors can see who trusts you."),
			],
		}),
		defineField({
			name: "about",
			type: "aboutSection",
			group: "about",
			initialValue: demo.aboutSection,
			description:
				"Share your story and reinforce your value with supporting highlights.",
			validation: rule => [
				rule
					.required()
					.error("Write the about section content to publish the homepage."),
			],
		}),
		defineField({
			name: "faq",
			type: "array",
			group: "faq",
			title: "FAQs",
			description: "Add multiple FAQ items to the homepage.",
			initialValue: demo.faqContent,
			of: [defineArrayMember({ type: "faqContent" })],
			validation: rule => [
				rule.required().min(1).error("Add at least one FAQ item to the homepage."),
				rule.unique().warning("Duplicate FAQ items were removed."),
			],
		}),
		defineField({
			name: "testimonials",
			type: "array",
			group: "testimonials",
			title: "Testimonials",
			description: "Add multiple testimonials to the homepage.",
			// initialValue: demo.testimonials,
			of: [defineArrayMember({ type: "testimonials" })],
			validation: rule => [
				rule
					.min(1)
					.error("Add at least one testimonial to the homepage."),
				rule.unique().warning("Duplicate testimonial items were removed."),
			],
		}),
		defineField({
			name: "projects",
			type: "array",
			group: "projects",
			title: "Projects",
			description: "Add multiple projects to the homepage.",
			// initialValue: demo.projectsContent,
			of: [defineArrayMember({ type: "projectsContent" })],
			validation: rule => [
				rule.required().min(1).error("Add at least one project to the homepage."),
				rule.unique().warning("Duplicate project items were removed."),
			],
		}),
	],
	preview: {
		select: {
			title: "hero.headline",
			subtitle: "controlSolutions.title",
		},
		prepare({ title, subtitle }) {
			return {
				title: title || "Homepage",
				subtitle: subtitle || "Homepage configuration",
			};
		},
	},
});
