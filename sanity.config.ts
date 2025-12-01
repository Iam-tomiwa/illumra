"use client";
/**
 * This config is used to set up Sanity Studio that's mounted on the `app/(sanity)/studio/[[...tool]]/page.tsx` route
 */
import { visionTool } from "@sanity/vision";
import { PluginOptions, defineConfig } from "sanity";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import {
	presentationTool,
	defineDocuments,
	defineLocations,
	type DocumentLocation,
} from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { pageStructure, singletonPlugin } from "@/sanity/plugins/settings";
import { assistWithPresets } from "@/sanity/plugins/assist";
import author from "@/sanity/schemas/documents/author";
import post from "@/sanity/schemas/documents/post";
import product from "@/sanity/schemas/documents/product";
import productCategory from "@/sanity/schemas/documents/productCategory";
import productVoltage from "@/sanity/schemas/documents/productVoltage";
import productFrequency from "@/sanity/schemas/documents/productFrequency";
import productProtocol from "@/sanity/schemas/documents/productProtocol";
import { homePage } from "@/sanity/schemas/singletons/homePage";
import { aboutPage } from "@/sanity/schemas/singletons/aboutPage";
import { heroSection } from "@/sanity/schemas/objects/heroSection";
import { controlSolutionsSection } from "@/sanity/schemas/objects/controlSolutionsSection";
import { trustedBySection } from "@/sanity/schemas/objects/trustedBySection";
import { aboutSection } from "@/sanity/schemas/objects/aboutSection";
import { aboutPageContent } from "@/sanity/schemas/objects/aboutPageContent";
import { companyInfo } from "@/sanity/schemas/objects/companyInfo";
import { mediaAsset } from "@/sanity/schemas/objects/mediaAsset";
import { iconFeature } from "@/sanity/schemas/objects/iconFeature";
import { brandLogo } from "@/sanity/schemas/objects/brandLogo";
import { linkAction } from "@/sanity/schemas/objects/linkAction";
import { specificationEntry } from "@/sanity/schemas/objects/specificationEntry";
import { resourceLink } from "@/sanity/schemas/objects/resourceLink";
import { productColor } from "@/sanity/schemas/objects/productColor";
import { videoAsset } from "@/sanity/schemas/objects/videoAsset";
import { resolveHref } from "@/sanity/lib/utils";
import { faqContent } from "./sanity/schemas/objects/faqContent";
import { testimonials } from "./sanity/schemas/objects/testimonials";
import { projectsContent } from "./sanity/schemas/objects/projectsContent";

const homeLocation = {
	title: "Home",
	href: "/",
} satisfies DocumentLocation;

const aboutLocation = {
	title: "About",
	href: "/about",
} satisfies DocumentLocation;

export default defineConfig({
	basePath: studioUrl,
	projectId,
	dataset,
	schema: {
		types: [
			// Singletons
			// settings,
			homePage,
			aboutPage,
			// Documents
			post,
			product,
			productCategory,
			productVoltage,
			productFrequency,
			productProtocol,
			author,
			// Objects
			heroSection,
			controlSolutionsSection,
			trustedBySection,
			aboutSection,
			aboutPageContent,
			companyInfo,
			mediaAsset,
			iconFeature,
			brandLogo,
			linkAction,
			specificationEntry,
			resourceLink,
			productColor,
			videoAsset,
			faqContent,
			testimonials,
			projectsContent,
		],
	},
	plugins: [
		presentationTool({
			resolve: {
				mainDocuments: defineDocuments([
					{
						route: "/",
						filter: `_type == "homePage"`,
					},
					{
						route: "/about",
						filter: `_type == "aboutPage"`,
					},
					{
						route: "/posts/:slug",
						filter: `_type == "post" && slug.current == $slug`,
					},
				]),
				locations: {
					homePage: defineLocations({
						locations: [homeLocation],
						message: "This document powers the homepage hero content.",
						tone: "positive",
					}),
					aboutPage: defineLocations({
						locations: [aboutLocation],
						message: "This document powers the about page content.",
						tone: "positive",
					}),
					post: defineLocations({
						select: {
							title: "title",
							slug: "slug.current",
						},
						resolve: doc => ({
							locations: [
								{
									title: doc?.title || "Untitled",
									href: resolveHref("post", doc?.slug)!,
								},
								homeLocation,
							],
						}),
					}),
				},
			},
			previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
		}),
		structureTool({ structure: pageStructure([homePage, aboutPage]) }),
		// Configures the global "new document" button, and document actions, to suit the Settings document singleton
		singletonPlugin([homePage.name, aboutPage.name]),
		// Add an image asset source for Unsplash
		unsplashImageAsset(),
		// Sets up AI Assist with preset prompts
		// https://www.sanity.io/docs/ai-assist
		assistWithPresets(),
		// Vision lets you query your content with GROQ in the studio
		// https://www.sanity.io/docs/the-vision-plugin
		process.env.NODE_ENV === "development" &&
			visionTool({ defaultApiVersion: apiVersion }),
	].filter(Boolean) as PluginOptions[],
});
