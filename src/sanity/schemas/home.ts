import { defineArrayMember, defineField, defineType } from "sanity";
import { createMediaArray } from "./media";

function createWidgetPreview(widgetTitle: string) {
  return {
    select: {
      size: "size",
      x: "position.x",
      y: "position.y",
    },
    prepare(selection: { size?: string; x?: number; y?: number }) {
      const { size = "Unknown", x = 0, y = 0 } = selection;
      return {
        title: `${widgetTitle} (${size}) at (${x}, ${y})`,
      };
    },
  };
}

const twitterWidget = defineArrayMember({
  type: "object",
  name: "twitterWidget",
  title: "Twitter Widget",
  fields: [
    defineField({
      name: "position",
      type: "object",
      fields: [
        defineField({ name: "x", type: "number" }),
        defineField({ name: "y", type: "number" }),
      ],
      initialValue: { x: 0, y: 0 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "size",
      type: "string",
      options: {
        list: ["1x1", "2x2"],
      },
      initialValue: "2x2",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tweet",
      type: "text",
      title: "Tweet",
    }),
    defineField({
      name: "author",
      type: "string",
      title: "Author",
    }),
    defineField({
      name: "link",
      type: "url",
      title: "Link",
    }),
    defineField({
      name: "media",
      type: "array",
      of: [{ type: "image", title: "Image" }],
    }),
  ],
  preview: createWidgetPreview("Twitter Widget"),
});

const mediaWidget = defineArrayMember({
  type: "object",
  name: "mediaWidget",
  title: "Media Widget",
  fields: [
    defineField({
      name: "position",
      type: "object",
      fields: [
        defineField({ name: "x", type: "number" }),
        defineField({ name: "y", type: "number" }),
      ],
      initialValue: { x: 0, y: 0 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "size",
      type: "string",
      options: {
        list: ["2x2", "3x3"],
      },
      initialValue: "2x2",
      validation: (Rule) => Rule.required(),
    }),
    createMediaArray(),
  ],
  preview: createWidgetPreview("Media Widget"),
});

export const home = defineType({
  name: "home",
  title: "Home",
  type: "document",
  fields: [
    defineField({
      name: "widgets",
      title: "Widgets",
      type: "array",
      of: [twitterWidget, mediaWidget],
    }),
    defineField({
      name: "missionStatement",
      title: "Mission Statement",
      type: "array",
      of: [
        {
          type: "block",
        },
      ],
    }),
    createMediaArray(),
    defineField({
      name: "aboutUs",
      title: "About Us",
      type: "array", // Change to array for block content
      of: [{ type: "block" }], // Define block content
    }),
    defineField({
      name: "newsfeed",
      title: "Newsfeed",
      type: "array",
      of: [
        defineField({
          name: "article",
          type: "object",
          fields: [
            defineField({ name: "image", title: "Image", type: "image" }),
            defineField({ name: "date", title: "Date", type: "datetime" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
            defineField({ name: "link", title: "Link", type: "url" }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Home",
      };
    },
  },
});
