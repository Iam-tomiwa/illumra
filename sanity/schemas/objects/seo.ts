import { EyeOpenIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO & Meta Tags",
  type: "object",
  icon: EyeOpenIcon,
  description:
    "Configure SEO metadata, Open Graph, and Twitter Card information",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Site Title",
      description:
        "Default site title (used in browser tab and search results)",
      validation: (rule) => [
        rule
          .max(60)
          .warning("Titles should be under 60 characters for best SEO."),
      ],
    }),
    defineField({
      name: "titleTemplate",
      type: "string",
      title: "Title Template",
      description:
        "Template for page titles (use %s for page name). Example: '%s | Illumra'",
      initialValue: "%s | Illumra",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Meta Description",
      description: "Default meta description (shown in search results)",
      rows: 3,
      validation: (rule) => [
        rule
          .max(160)
          .warning("Descriptions should be 150-160 characters for best SEO."),
      ],
    }),
    defineField({
      name: "keywords",
      type: "array",
      title: "Keywords",
      description: "Optional SEO keywords (separated by commas)",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "siteUrl",
      type: "url",
      title: "Site URL",
      description:
        "Base URL of your website (used for Open Graph and metadata)",
      validation: (rule) => [
        rule.uri({ scheme: ["https"] }).error("Site URL must use HTTPS."),
      ],
    }),
    defineField({
      name: "ogImage",
      type: "mediaAsset",
      title: "Open Graph Image",
      description:
        "Default image for social media sharing (recommended: 1200x627px)",
      initialValue: () => ({
        source: "external",
        externalUrl:
          "https://res.cloudinary.com/tomiwadev/image/upload/v1766822760/d55447e9-aae9-4439-9f5a-9df087a415eb.png",
      }),
    }),
    defineField({
      name: "twitterCard",
      type: "string",
      title: "Twitter Card Type",
      description: "Type of Twitter card to use",
      options: {
        list: [
          { title: "Summary", value: "summary" },
          { title: "Summary Large Image", value: "summary_large_image" },
          { title: "App", value: "app" },
          { title: "Player", value: "player" },
        ],
      },
      initialValue: "summary_large_image",
    }),
    defineField({
      name: "twitterSite",
      type: "string",
      title: "Twitter Site",
      description: "Twitter username (e.g., @illumra)",
    }),
    defineField({
      name: "twitterCreator",
      type: "string",
      title: "Twitter Creator",
      description: "Twitter creator username (e.g., @illumra)",
    }),
    defineField({
      name: "locale",
      type: "string",
      title: "Locale",
      description: "Site locale (e.g., en_US)",
      initialValue: "en_US",
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
    },
    prepare({ title, description }) {
      return {
        title: title || "SEO & Meta Tags",
        subtitle: description || "Configure SEO metadata",
      };
    },
  },
});
