import { HelpCircleIcon, EyeOpenIcon, PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productsPage = defineType({
  name: "productsPage",
  title: "Products Page",
  type: "document",
  icon: PackageIcon,
  groups: [
    {
      name: "content",
      title: "Content",
      icon: HelpCircleIcon,
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
      name: "backgroundImage",
      type: "mediaAsset",
      group: "content",
      description:
        "Upload a background image or provide an external URL. Use a landscape image for best results.",
      validation: (rule) => [
        rule
          .required()
          .error("Provide a background image for the products page."),
      ],
    }),
    defineField({
      name: "title",
      type: "string",
      group: "content",
      description: "Heading displayed above the products page.",
      initialValue: "All Products",
      validation: (rule) => [
        rule
          .required()
          .min(3)
          .max(80)
          .error("Add a title between 3 and 80 characters."),
      ],
    }),
    defineField({
      name: "description",
      type: "text",
      group: "content",
      rows: 3,
      description: "Supporting text displayed below the title.",
      initialValue:
        "Explore our comprehensive range of products designed to meet your unique needs.",
      validation: (rule) => [
        rule.max(280).warning("Keep the description under 280 characters."),
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
      title: "title",
      description: "description",
    },
    prepare({ title, description }) {
      return {
        title: title || "Products Page",
        subtitle:
          description ||
          "Explore our comprehensive range of products designed to meet your unique needs.",
      };
    },
  },
});
