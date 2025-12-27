import { EyeOpenIcon, DocumentTextIcon } from "@sanity/icons";
import { ImageIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const legal = defineType({
  name: "legal",
  title: "Legal Documents",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    {
      name: "content",
      title: "Content",
      icon: DocumentTextIcon,
      default: true,
    },
    {
      name: "seo",
      title: "SEO & Meta Tags",
      icon: EyeOpenIcon,
    },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      title: "Title",
      description: "Title of the legal document",
      validation: (rule) => [
        rule.required().error("Title is required."),
        rule
          .min(3)
          .max(80)
          .warning("Title should be between 3 and 80 characters."),
      ],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description:
        "URL slug for this document (e.g., warranty-policy, privacy-policy)",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required().error("Slug is required."),
    }),
    defineField({
      name: "content",
      title: "Content",
      group: "content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "object",
          name: "contentImage",
          title: "Image",
          icon: ImageIcon,
          fields: [
            defineField({
              name: "media",
              title: "Media",
              type: "mediaAsset",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional caption to display below the image.",
            }),
          ],
          preview: {
            select: {
              altText: "media.altText",
              source: "media.source",
              image: "media.image",
              caption: "caption",
            },
            prepare({ altText, source, image, caption }) {
              return {
                title: altText || caption || "Image",
                subtitle: source === "external" ? "External URL" : "Uploaded",
                media: image,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "seo",
      type: "seo",
      title: "SEO & Meta Tags",
      group: "seo",
      description:
        "Override default SEO settings for this page (optional - leave empty to use default settings)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
    },
    prepare({ title, slug }) {
      return {
        title: title || "Untitled",
        subtitle: `Legal Document${slug ? ` • /${slug}` : ""}`,
      };
    },
  },
});
