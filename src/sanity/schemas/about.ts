import { defineField, defineType } from "sanity";
import { createMediaArray } from "./media";

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      description: "A brief introduction to the team",
    }),
    defineField({
      name: "team",
      title: "Team",
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
            createMediaArray({
              name: "media",
              title: "Media",
              validation: (Rule) => Rule.required().length(1),
            }),
            defineField({
              name: "bio",
              title: "Bio",
              type: "text",
            }),
            defineField({
              name: "qaPairs",
              title: "Q&A Pairs",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
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
                  preview: {
                    select: {
                      question: "question",
                      answer: "answer",
                    },
                    prepare({ question, answer }) {
                      return {
                        title: `Q: ${question} — A: ${answer?.slice(0, 50)}${answer?.length > 50 ? "..." : ""}`,
                      };
                    },
                  },
                },
              ],
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "About",
      };
    },
  },
});
