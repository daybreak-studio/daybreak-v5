import { defineField, defineType } from "sanity";

export const home = defineType({
  name: "home",
  title: "Home",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle", // Add a new field for the page title
      title: "Page Title",
      type: "string",
      initialValue: "Home", // Set the default value to "Home"
    }),
    defineField({
      name: "widgets",
      title: "Widgets",
      type: "array",
      of: [
        defineField({
          name: "widget",
          type: "object",
          fields: [
            defineField({ name: "image", title: "Image", type: "image" }),
            defineField({ name: "link", title: "Link", type: "url" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
            defineField({ name: "size", title: "Size", type: "string" }),
            defineField({ name: "type", title: "Type", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "missionStatement",
      title: "Mission Statement",
      type: "text",
    }),
    defineField({
      name: "aboutUs",
      title: "About Us",
      type: "text",
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
});
