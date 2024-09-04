import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const settings = defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The name of your site",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description:
        "Description for search engines and social media. Max length of 160 characters.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "openGraphImage",
      title: "Open Graph Image",
      type: "image",
      description:
        "Default image for social media sharing. Recommended size of 1200 x 630 pixels.",
    }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});
