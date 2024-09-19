import { defineField, defineType } from "sanity";

const tab = defineField({
  name: "tab",
  title: "Tab",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "copy", title: "Copy", type: "text" }),
    defineField({ name: "image", title: "Image", type: "image" }),
  ],
});

export const services = defineType({
  name: "services",
  title: "Services",
  type: "document",
  fields: [
    defineField({
      name: "quotes",
      title: "Quotes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "quote", title: "Quote", type: "text" }),
          ],
        },
      ],
    }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Logo Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
            defineField({
              name: "companyName",
              title: "Company Name",
              type: "string",
            }),
            defineField({ name: "url", title: "Company URL", type: "url" }),
          ],
        },
      ],
    }),
    defineField({
      name: "serviceCategories",
      title: "Service Categories",
      type: "object",
      groups: [
        { name: "brand", title: "Brand" },
        { name: "product", title: "Product" },
        { name: "motion", title: "Motion" },
        { name: "development", title: "Development" },
      ],
      fields: [
        {
          name: "brand",
          title: "Brand",
          type: "object",
          group: "brand",
          fields: [
            defineField({
              name: "tabs",
              title: "Tabs",
              type: "array",
              of: [tab],
            }),
          ],
        },
        {
          name: "product",
          title: "Product",
          type: "object",
          group: "product",
          fields: [
            defineField({
              name: "tabs",
              title: "Tabs",
              type: "array",
              of: [tab],
            }),
          ],
        },
        {
          name: "motion",
          title: "Motion",
          type: "object",
          group: "motion",
          fields: [
            defineField({
              name: "tabs",
              title: "Tabs",
              type: "array",
              of: [tab],
            }),
          ],
        },
        {
          name: "development",
          title: "Development",
          type: "object",
          group: "development",
          fields: [
            defineField({
              name: "tabs",
              title: "Tabs",
              type: "array",
              of: [tab],
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Services" };
    },
  },
});
