import { defineField, defineType } from "sanity";

export const team = defineType({
  name: "team",
  title: "Team",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Title for the team page",
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      description: "A brief introduction to the team",
    }),
    defineField({
      name: "teamMembers",
      title: "Team Members",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: "bio",
              title: "Bio",
              type: "text",
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Team",
      };
    },
  },
});
