import { defineField, defineType } from "sanity";

export const work = defineType({
  name: "work",
  title: "Work",
  type: "document",
  fields: [
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "project" }],
        },
      ],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Work",
      };
    },
  },
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
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
      name: "isActive",
      title: "Active?",
      type: "boolean",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "projectType",
      title: "Project Type",
      type: "string",
      options: {
        list: [
          { title: "Case Study", value: "caseStudy" },
          { title: "Preview", value: "preview" },
        ],
      },
    }),
    // Case Study fields
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      hidden: ({ document }) => document?.projectType !== "caseStudy",
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
        { type: "block" },
        {
          type: "object",
          name: "imageVideo",
          fields: [
            { name: "media", type: "image" },
            { name: "size", type: "string" },
          ],
        },
      ],
      hidden: ({ document }) => document?.projectType !== "caseStudy",
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string" },
            { name: "team", type: "string" },
          ],
        },
      ],
      hidden: ({ document }) => document?.projectType !== "caseStudy",
    }),
    // Preview fields
    defineField({
      name: "media",
      title: "Images/Video",
      type: "array",
      of: [{ type: "image" }, { type: "file" }],
      hidden: ({ document }) => document?.projectType !== "preview",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      hidden: ({ document }) => document?.projectType !== "preview",
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      hidden: ({ document }) => document?.projectType !== "preview",
    }),
  ],
  preview: {
    select: {
      title: "title",
      projectType: "projectType",
      isActive: "isActive",
    },
    prepare(selection) {
      const { title, projectType, isActive } = selection;
      return {
        title: `${title} ${!isActive ? "(Archived)" : ""}`,
        subtitle: projectType === "caseStudy" ? "Case Study" : "Preview",
      };
    },
  },
});
