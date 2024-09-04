import { defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title / Project Name",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        defineField({ name: "textBlock", type: "block" }),
        defineField({
          name: "imageVideo",
          title: "Images/Videos",
          type: "object",
          fields: [
            defineField({ name: "media", title: "Media", type: "image" }), // or 'video'
            defineField({ name: "size", title: "Size", type: "string" }), // e.g., "half", "full"
          ],
        }),
      ],
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "array",
      of: [
        defineField({
          name: "credit",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({
              name: "team",
              title: "Team / Title",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
});
