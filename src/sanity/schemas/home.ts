import { defineField, defineType } from "sanity";
import { createMediaArray } from "./media";
import { widgets } from "./widgets";

export const home = defineType({
  name: "home",
  title: "Home",
  type: "document",
  fields: [
    defineField({
      name: "widgets",
      title: "Widgets",
      type: "array",
      of: widgets,
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
      type: "array",
      of: [{ type: "block" }],
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
            createMediaArray({
              validation: (Rule) => Rule.required().length(1),
            }),
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
