import { HomeIcon, EyeOpenIcon } from "@sanity/icons";
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
			name: "featuredProducts",
			title: "Featured Products",
			icon: HomeIcon,
		},
		{
			name: "cta",
			title: "Call To Action",
			icon: HomeIcon,
		},
		{
			name: "seo",
			title: "SEO & Meta Tags",
			icon: EyeOpenIcon,
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
			name: "featuredProductsVisible",
			title: "Featured Products Section Visibility",
			type: "string",
			group: "featuredProducts",
			description: "Choose whether to show or hide the featured products section on the homepage.",
			initialValue: "show",
			options: {
				layout: "radio",
				list: [
					{ title: "Show", value: "show" },
					{ title: "Hide", value: "hide" },
				],
			},
			validation: rule => [
				rule.required().error("Select whether to show or hide this section."),
			],
		}),
		defineField({
			name: "testimonialsVisible",
			title: "Testimonials Section Visibility",
			type: "string",
			group: "testimonials",
			description: "Choose whether to show or hide the testimonials section on the homepage.",
			initialValue: "show",
			options: {
				layout: "radio",
				list: [
					{ title: "Show", value: "show" },
					{ title: "Hide", value: "hide" },
				],
			},
			validation: rule => [
				rule.required().error("Select whether to show or hide this section."),
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
			name: "projectsVisible",
			title: "Projects Section Visibility",
			type: "string",
			group: "projects",
			description: "Choose whether to show or hide the projects section on the homepage.",
			initialValue: "show",
			options: {
				layout: "radio",
				list: [
					{ title: "Show", value: "show" },
					{ title: "Hide", value: "hide" },
				],
			},
			validation: rule => [
				rule.required().error("Select whether to show or hide this section."),
			],
		}),
		defineField({
			name: "projectsHeading",
			title: "Projects Heading",
			type: "string",
			group: "projects",
			initialValue: "Projects We've Worked On So Far",
			description: "Enter the heading for the projects section.",
			validation: rule => [
				rule.required().error("Enter the heading for the projects section."),
			],
		}),
		defineField({
			name: "projectsSubheading",
			title: "Projects Description",
			type: "text",
			rows: 3,
			group: "projects",
			initialValue: "Explore our portfolio of successful installations across diverse industries. Each project showcases our commitment to delivering innovative wireless control solutions that enhance efficiency, and improve environmental sustainability. <br /> <i>Click on any project card to view the detailed PDF.</i>",
			description: "Enter the description for the projects section.",
			validation: rule => [
				rule.required().error("Enter the description for the projects section."),
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
		defineField({
			name: "cta",
			type: "ctaSection",
			group: "cta",
			description: "Call-to-action section encouraging visitors to take the next step.",
			initialValue: {
				visible: "show",
				title: "Ready to Get Started?",
				description: "Request a quote for our wireless control solutions and receive pricing tailored to your project needs",
				action: {
					label: "Request a Quote",
					href: "/contact",
					icon: "solar:round-arrow-right-bold",
				},
			},
			validation: rule => [
				rule.required().error("Configure the CTA section to publish the homepage."),
			],
		}),
		defineField({
			name: "seo",
			type: "seo",
			title: "SEO & Meta Tags",
			group: "seo",
			description: "Override default SEO settings for this page (optional)",
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
