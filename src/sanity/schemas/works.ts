import { defineField, defineType } from "sanity";
import { createMediaArray } from "./media";

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
      validation: (Rule) => Rule.required(),
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
      projects: "projects", // Select the entire projects array
    },
    prepare(selection) {
      const { title, projects } = selection;

      // Helper function to capitalize first letter
      const capitalize = (s: string) =>
        s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

      // Extract unique categories from projects, capitalize them, and append type
      const categoryTypes = Array.isArray(projects)
        ? projects.map((project) => {
            const category = capitalize(project.category || "");
            const type =
              project._type === "caseStudy" ? "Case Study" : "Preview";
            return `${category} (${type})`;
          })
        : [];

      // Remove duplicates and sort
      const uniqueCategoryTypes = [...new Set(categoryTypes)].sort();

      // Join categories into a string
      const subtitle =
        uniqueCategoryTypes.length > 0
          ? uniqueCategoryTypes.join(", ")
          : "No Categories";

      return {
        title,
        subtitle,
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
      name: "category",
      title: "Category",
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
    createMediaArray(),
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
      category: "category",
      media: "media.0",
    },
    prepare(selection) {
      const { category, media } = selection;
      const capitalizedType = category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : "Unspecified Type";
      return {
        title: `${capitalizedType} – Preview`,
        media: media?.asset,
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
      name: "category",
      title: "Category",
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
      title: "Media Groups",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "mediaGroup",
          title: "Media Group",
          fields: [
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
            createMediaArray({
              validation: (Rule) => Rule.max(2),
            }),
          ],
          preview: {
            select: {
              heading: "heading",
              items: "items",
              firstItem: "items.0",
            },
            prepare(selection) {
              const { heading, items, firstItem } = selection;

              const itemsArray = Array.isArray(items) ? items : [];
              const itemTypes = itemsArray.map((item) =>
                item._type === "imageItem" ? "Image" : "Video",
              );

              const itemCount = itemsArray.length;
              const title = itemCount === 1 ? "Full" : "Split";

              return {
                title: `${title}: ${heading || "No Info"}`,
                subtitle: itemTypes.join(", ") || "No files",
                media: firstItem?.asset,
              };
            },
          },
        }),
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
      category: "category",
      media: "media.0.items.0",
    },
    prepare(selection) {
      const { category, media } = selection;
      const capitalizedType = category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : "Unspecified Type";
      return {
        title: `${capitalizedType} – Case Study`,
        media: media?.asset,
      };
    },
  },
});
