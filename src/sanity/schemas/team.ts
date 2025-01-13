import { defineField, defineType } from "sanity";

export const team = defineType({
  name: "team",
  title: "Team",
  type: "document",
  fields: [
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
              name: "video",
              title: "Video",
              type: "mux.video",
            }),
            defineField({
              name: "bio",
              title: "Bio",
              type: "text",
            }),
            defineField({
              name: "info",
              title: "Info",
              type: "array",
              of: [
                defineField({
                  name: "question",
                  title: "Question",
                  type: "text",
                }),
                defineField({
                  name: "answer",
                  title: "Answer",
                  type: "text",
                }),
              ],
              validation: (Rule) => Rule.length(2),
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Team",
      };
    },
  },
});
