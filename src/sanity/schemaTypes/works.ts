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
      category: "category",
    },
    prepare(selection) {
      const { category } = selection;
      const capitalizedType = category
        ? category.charAt(0).toUpperCase() + category.slice(1)
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
      title: "Media",
      type: "array",
      of: [
        {
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
            defineField({
              name: "items",
              title: "Media Items",
              type: "array",
              of: [
                {
                  type: "image",
                  options: {
                    hotspot: true,
                    metadata: ["blurhash", "lqip", "palette"],
                  },
                },
                {
                  type: "file",
                  options: {
                    accept: "video/*",
                  },
                },
              ],
              validation: (Rule) => Rule.max(2),
            }),
          ],
          preview: {
            select: {
              heading: "heading",
              items: "items",
              firstItemAsset: "items.0.asset",
            },
            prepare(selection) {
              const { heading, items, firstItemAsset } = selection;

              // Helper function to clean and capitalize types
              const cleanAndCapitalizeType = (type: string): string => {
                if (type === "file") return "Video";
                return type.charAt(0).toUpperCase() + type.slice(1);
              };

              // Convert items to an array if it's not already
              const itemsArray = items
                ? Array.isArray(items)
                  ? items
                  : Object.values(items)
                : [];

              const itemTypes = itemsArray.map((item: any) =>
                cleanAndCapitalizeType(item._type || "Unknown"),
              );

              const itemCount = itemsArray.length;
              const title = itemCount === 1 ? "Full" : "Split";

              return {
                title: `${title}: ${heading || "No Info"}`,
                subtitle: itemTypes.join(", ") || "No files",
                media: firstItemAsset,
              };
            },
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
      category: "category",
    },
    prepare(selection) {
      const { category } = selection;
      const capitalizedType = category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : "Unspecified Type";
      return {
        title: `${capitalizedType} – Case Study`,
      };
    },
  },
});
