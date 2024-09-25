import { defineArrayMember, defineField, defineType } from "sanity";

function createWidgetPreview(widgetTitle: string) {
  return {
    select: {
      size: "size",
      x: "position.x",
      y: "position.y",
    },
    prepare({ size, x, y }: { size: string; x: number; y: number }) {
      return {
        title: `${widgetTitle} (${size}) at (${x}, ${y})`,
      };
    },
  };
}

const twitterWidget = defineArrayMember({
  name: "twitterWidget",
  title: "Twitter Widget",
  type: "object",
  fields: [
    defineField({
      name: "position",
      title: "Position",
      type: "object",
      fields: [
        { name: "x", type: "number" },
        { name: "y", type: "number" },
      ],
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: {
        list: ["1x1", "2x2"],
      },
      initialValue: "1x1",
    }),
    defineField({
      name: "tweet",
      title: "Tweet",
      type: "text",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
    }),
  ],
  preview: createWidgetPreview("Twitter Widget"),
});

const mediaWidget = defineArrayMember({
  name: "mediaWidget",
  title: "Media Widget",
  type: "object",
  fields: [
    defineField({
      name: "position",
      title: "Position",
      type: "object",
      fields: [
        { name: "x", type: "number" },
        { name: "y", type: "number" },
      ],
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: {
        list: ["2x2", "3x3"],
      },
      initialValue: "2x2",
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "array",
      of: [
        {
          type: "image",
          title: "Image",
        },
        {
          type: "file",
          title: "Video",
          options: { accept: "video/*" },
        },
      ],
      validation: (Rule) => Rule.max(1),
    }),
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
