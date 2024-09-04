import { defineField, defineType } from "sanity";

export const services = defineType({
  name: "services",
  title: "Services",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "text", title: "Text", type: "text" }),
        defineField({
          name: "caseStudy",
          title: "Case Study",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "image", title: "Image", type: "image" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [defineField({ name: "logo", type: "image" })],
    }),
  ],
});
