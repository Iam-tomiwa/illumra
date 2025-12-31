import { HelpCircleIcon, ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const faqContent = defineType({
  name: "faqContent",
  title: "FAQ Content",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "group",
      type: "string",
      description: "Choose the group of FAQ you want to add.",
      initialValue: "gettingStarted",
      options: {
        layout: "radio",
        list: [
          { title: "Getting Started", value: "gettingStarted" },
          { title: "FAQ", value: "faq" },
        ],
      },
      validation: (rule) => [
        rule.required().error("Select the group of FAQ you want to add."),
      ],
    }),
    defineField({
      name: "question",
      type: "string",
      description: "Enter a question for the FAQ.",
      validation: (rule) => [
        rule.required().error("Enter a question for the FAQ."),
      ],
    }),
    defineField({
      name: "answer",
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
        { type: "videoAsset" },
      ],
      description: "Enter an answer for the FAQ.",
      validation: (rule) => [
        rule.required().error("Enter an answer for the FAQ."),
      ],
    }),
  ],
  preview: {
    select: {
      title: "question",
    },
    prepare({ title }) {
      return {
        title: title || "FAQ",
      };
    },
  },
});
