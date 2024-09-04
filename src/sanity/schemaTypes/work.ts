import { defineField, defineType } from "sanity";

export const work = defineType({
  name: "work",
  title: "Work",
  type: "document",
  fields: [
    defineField({
      name: "caseStudies",
      title: "Case Studies",
      type: "array",
      of: [
        defineField({
          name: "caseStudyRef",
          type: "reference",
          to: [{ type: "caseStudy" }],
        }),
      ],
    }),
    defineField({
      name: "previews",
      title: "Previews",
      type: "array",
      of: [
        defineField({
          name: "previewRef",
          type: "reference",
          to: [{ type: "preview" }],
        }),
      ],
    }),
  ],
});
