import { defineField, defineType } from "sanity";

const createSizeField = (allowedSizes) =>
  defineField({
    name: "size",
    title: "Size",
    type: "string",
    options: {
      list: allowedSizes.map((size) => ({ title: size, value: size })),
    },
    validation: (Rule) => Rule.required(),
  });

const baseWidget = {
  fields: [
    defineField({
      name: "position",
      title: "Position",
      type: "object",
      fields: [
        defineField({ name: "x", type: "number", title: "X Position" }),
        defineField({ name: "y", type: "number", title: "Y Position" }),
      ],
      initialValue: { x: 0, y: 0 },
    }),
  ],
};

const twitterWidget = defineField({
  name: "twitterWidget",
  title: "Twitter Widget",
  type: "object",
  fields: [
    ...baseWidget.fields,
    createSizeField(["1x1", "2x2"]),
    defineField({ name: "link", type: "url", title: "Tweet Link" }),
    defineField({ name: "author", type: "string", title: "Author" }),
    defineField({ name: "tweet", type: "text", title: "Tweet Content" }),
  ],
});

const mediaWidget = defineField({
  name: "mediaWidget",
  title: "Media Widget",
  type: "object",
  fields: [
    ...baseWidget.fields,
    createSizeField(["2x2", "3x3"]),
    defineField({
      name: "media",
      title: "Media",
      type: "array",
      of: [
        { type: "image" },
        {
          type: "file",
          options: { accept: "video/*" },
        },
      ],
      validation: (Rule) => Rule.max(1),
    }),
    defineField({ name: "caption", type: "string", title: "Caption" }),
    defineField({ name: "link", type: "url", title: "Link" }),
  ],
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
      of: [
        twitterWidget,
        mediaWidget,
        // Add other widget types here
      ],
    }),
    defineField({
      name: "missionStatement",
      title: "Mission Statement",
      type: "array", // Change to array for block content
      of: [
        {
          type: "block",
          // styles: [{ title: "Normal", value: "normal" }],
          // lists: [],
          // marks: {
          //   decorators: [], // This disables inline formatting (bold, italic, etc.)
          //   // annotations: [], // This disables links
          // },
        },
      ], // Define block content
    }),
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
