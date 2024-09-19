import { defineField, defineType } from "sanity";

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
        defineField({
          name: "widget",
          type: "object",
          fields: [
            defineField({
              name: "media",
              title: "Media",
              type: "array",
              of: [
                {
                  type: "image",
                  title: "Image",
                  fields: [
                    {
                      name: "alt",
                      title: "Alt Text",
                      type: "string",
                      description:
                        "Description of the image for SEO and accessibility.",
                    },
                  ],
                  options: {
                    metadata: ["blurhash", "lqip", "palette"],
                  },
                },
                {
                  type: "file",
                  title: "Video",

                  options: {
                    accept: "video/*",
                  },
                  fields: [
                    {
                      name: "alt",
                      title: "Alt Text",
                      type: "string",
                      description:
                        "Description of the video for SEO and accessibility.",
                    },
                    {
                      name: "name",
                      title: "Name",
                      type: "string",
                    },
                    {
                      name: "medium",
                      title: "Medium",
                      type: "string",
                    },
                  ],
                },
              ],
              options: {
                layout: "grid",
              },
            }),
            defineField({ name: "link", title: "Link", type: "url" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              options: {
                list: [
                  { title: "Small", value: "small" },
                  { title: "Medium", value: "medium" },
                  { title: "Large", value: "large" },
                ],
              },
            }),
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Twitter", value: "twitter" },
                  { title: "Showcase", value: "showcase" },
                  // Add more placeholder options as needed
                ],
              },
            }),
          ],
        }),
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
      name: "inTheNews",
      title: "In the News",
      type: "array",
      of: [
        defineField({
          name: "newsItem",
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
