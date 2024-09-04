import { defineField, defineType } from "sanity";

export const preview = defineType({
  name: "preview",
  title: "Preview",
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
      name: "media",
      title: "Images/Video",
      type: "array",
      of: [
        defineField({ name: "image", type: "image" }),
        defineField({ name: "video", type: "file" }), // You can adjust for video
      ],
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
    }),
  ],
});
