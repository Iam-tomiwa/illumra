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
import store from "@/sanity/schemas/documents/store";
import { settings } from "@/sanity/schemas/singletons/settings";
import { homePage } from "@/sanity/schemas/singletons/homePage";
import { faq } from "@/sanity/schemas/singletons/faq";
import { aboutPage } from "@/sanity/schemas/singletons/aboutPage";
import { caseStudiesPage } from "@/sanity/schemas/singletons/caseStudiesPage";
import { distributorsPage } from "@/sanity/schemas/singletons/distributorsPage";
import { heroSection } from "@/sanity/schemas/objects/heroSection";
import { controlSolutionsSection } from "@/sanity/schemas/objects/controlSolutionsSection";
import { trustedBySection } from "@/sanity/schemas/objects/trustedBySection";
import { aboutSection } from "@/sanity/schemas/objects/aboutSection";
import { companyInfo } from "@/sanity/schemas/objects/companyInfo";
import { mediaAsset } from "@/sanity/schemas/objects/mediaAsset";
import { iconFeature } from "@/sanity/schemas/objects/iconFeature";
import { brandLogo } from "@/sanity/schemas/objects/brandLogo";
import { linkAction } from "@/sanity/schemas/objects/linkAction";
import { specificationEntry } from "@/sanity/schemas/objects/specificationEntry";
import { resourceLink } from "@/sanity/schemas/objects/resourceLink";
import { productColor } from "@/sanity/schemas/objects/productColor";
import { videoAsset } from "@/sanity/schemas/objects/videoAsset";
import { ctaSection } from "@/sanity/schemas/objects/ctaSection";
import { resolveHref } from "@/sanity/lib/utils";
import { faqContent } from "./sanity/schemas/objects/faqContent";
import { testimonials } from "./sanity/schemas/objects/testimonials";
import { projectsContent } from "./sanity/schemas/objects/projectsContent";
import { becomeARep } from "./sanity/schemas/objects/becomeARep";
import { becomeADistributor } from "./sanity/schemas/objects/becomeADistributor";
import { formFieldConfig } from "./sanity/schemas/objects/formFieldConfig";
import { selectOption } from "./sanity/schemas/objects/selectOption";
import { quoteFormField } from "./sanity/schemas/objects/quoteFormField";
import { seo } from "./sanity/schemas/objects/seo";
import { contactPage } from "./sanity/schemas/singletons/contactPage";
import { legal } from "./sanity/schemas/documents/legal";

const homeLocation = {
  title: "Home",
  href: "/",
} satisfies DocumentLocation;

const aboutLocation = {
  title: "About",
  href: "/about",
} satisfies DocumentLocation;

const contactLocation = {
  title: "Contact",
  href: "/contact",
} satisfies DocumentLocation;

const caseStudiesLocation = {
  title: "Case Studies",
  href: "/case-studies",
} satisfies DocumentLocation;

const distributorsLocation = {
  title: "Distributors",
  href: "/distributors",
} satisfies DocumentLocation;

export default defineConfig({
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: [
      // Singletons
      settings,
      homePage,
      aboutPage,
      faq,
      contactPage,
      caseStudiesPage,
      distributorsPage,
      // Documents
      post,
      product,
      productCategory,
      productVoltage,
      productFrequency,
      productProtocol,
      store,
      author,
      legal,
      // Objects
      heroSection,
      controlSolutionsSection,
      trustedBySection,
      aboutSection,
      companyInfo,
      mediaAsset,
      iconFeature,
      brandLogo,
      linkAction,
      specificationEntry,
      resourceLink,
      productColor,
      videoAsset,
      ctaSection,
      faqContent,
      testimonials,
      projectsContent,
      becomeARep,
      becomeADistributor,
      formFieldConfig,
      selectOption,
      quoteFormField,
      seo,
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
            route: "/contact",
            filter: `_type == "contactPage"`,
          },
          {
            route: "/case-studies",
            filter: `_type == "caseStudiesPage"`,
          },
          {
            route: "/distributors",
            filter: `_type == "distributorsPage"`,
          },
          {
            route: "/posts/:slug",
            filter: `_type == "post" && slug.current == $slug`,
          },
          {
            route: "/legal/:slug",
            filter: `_type == "legal" && slug.current == $slug`,
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
            message:
              "This document powers the about page and contact information content.",
            tone: "positive",
          }),
          contactPage: defineLocations({
            locations: [contactLocation],
            message:
              "This document powers the contact page form configurations.",
            tone: "positive",
          }),
          caseStudiesPage: defineLocations({
            locations: [caseStudiesLocation],
            message: "This document powers the case studies page.",
            tone: "positive",
          }),
          distributorsPage: defineLocations({
            locations: [distributorsLocation],
            message: "This document powers the distributors page.",
            tone: "positive",
          }),
          post: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "Untitled",
                  href: resolveHref("post", doc?.slug)!,
                },
                homeLocation,
              ],
            }),
          }),
          legal: defineLocations({
            select: {
              title: "title",
              slug: "slug.current",
            },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [
                    {
                      title: doc.title || "Untitled",
                      href: `/legal/${doc.slug}`,
                    },
                    homeLocation,
                  ]
                : [homeLocation],
            }),
          }),
        },
      },
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
    }),
    structureTool({
      structure: pageStructure([
        settings,
        homePage,
        aboutPage,
        faq,
        contactPage,
        caseStudiesPage,
        distributorsPage,
      ]),
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([
      settings.name,
      homePage.name,
      aboutPage.name,
      faq.name,
      contactPage.name,
      caseStudiesPage.name,
      distributorsPage.name,
    ]),
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
