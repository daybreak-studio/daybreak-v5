import { defineField, defineType } from "sanity";

export const work = defineType({
  name: "work",
  title: "Work",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Client Name",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [{ type: "preview" }, { type: "caseStudy" }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      projectCount: "projects.length",
    },
    prepare(selection) {
      const { title, projectCount } = selection;
      return {
        title,
        subtitle: `${projectCount} project${projectCount !== 1 ? "s" : ""}`,
      };
    },
  },
});

export const preview = defineType({
  name: "preview",
  title: "Preview",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Project Type",
      type: "string",
      options: {
        list: [
          { title: "Brand", value: "brand" },
          { title: "Product", value: "product" },
          { title: "Web", value: "web" },
          { title: "Motion", value: "motion" },
        ],
      },
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "array",
      of: [
        defineField({
          name: "image",
          type: "image",
          options: {
            metadata: ["blurhash", "lqip", "palette"],
          },
        }),
        defineField({
          name: "video",
          type: "file",
          options: {
            accept: "video/*",
          },
        }),
      ],
    }),
    defineField({
      name: "link",
      title: "External Link",
      type: "url",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
    }),
  ],
  preview: {
    select: {
      type: "type",
    },
    prepare(selection) {
      const { type } = selection;
      const capitalizedType = type
        ? type.charAt(0).toUpperCase() + type.slice(1)
        : "Unspecified Type";
      return {
        title: `${capitalizedType} – Preview`,
      };
    },
  },
});

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Brand", value: "brand" },
          { title: "Product", value: "product" },
          { title: "Web", value: "web" },
          { title: "Motion", value: "motion" },
        ],
      },
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "array",
      of: [
        {
          type: "image",
          name: "image",
          title: "Image",
          fields: [
            {
              name: "heading",
              title: "Heading",
              type: "string",
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
          options: {
            hotspot: true,
            metadata: ["blurhash", "lqip", "palette"],
          },
        },
        {
          type: "file",
          name: "video",
          title: "Video",
          fields: [
            {
              name: "heading",
              title: "Heading",
              type: "string",
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
          options: {
            accept: "video/*",
          },
        },
      ],
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "role", type: "string" },
            { name: "names", type: "array", of: [{ type: "string" }] },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      type: "type",
    },
    prepare(selection) {
      const { type } = selection;
      const capitalizedType = type
        ? type.charAt(0).toUpperCase() + type.slice(1)
        : "Unspecified Type";
      return {
        title: `${capitalizedType} – Case Study`,
      };
    },
  },
});
