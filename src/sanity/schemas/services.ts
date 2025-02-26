import { defineField, defineType } from "sanity";
import { widgets } from "./widgets";
import { createMediaArray } from "./media";

const tab = defineField({
  name: "tab",
  title: "Tab",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "caption", title: "Caption", type: "text" }),
    createMediaArray({
      validation: (Rule) => Rule.required().max(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "media.0.source",
    },
    prepare(selection) {
      const { title, media } = selection;
      return {
        title: title || "No title",
        media: media,
      };
    },
  },
});

export const services = defineType({
  name: "services",
  title: "Services",
  type: "document",
  fields: [
    defineField({
      name: "widgets",
      title: "Widgets",
      type: "array",
      of: widgets,
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "object",
      fields: [
        defineField({
          name: "brand",
          title: "Brand",
          type: "array",
          of: [tab],
        }),
        defineField({
          name: "product",
          title: "Product",
          type: "array",
          of: [tab],
        }),
        defineField({
          name: "motion",
          title: "Motion",
          type: "array",
          of: [tab],
        }),
        defineField({
          name: "web",
          title: "Web",
          type: "array",
          of: [tab],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Services" };
    },
  },
});
