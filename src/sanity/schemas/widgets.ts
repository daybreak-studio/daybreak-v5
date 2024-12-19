import { defineField } from "sanity";
import { createMediaArray } from "./media";

type WidgetSize = "1x1" | "2x2" | "3x3";
const ALL_SIZES: WidgetSize[] = ["1x1", "2x2", "3x3"];

const createWidgetFields = (uniqueFields: any[]) => [
  defineField({
    name: "position",
    title: "Position",
    type: "object",
    fields: [
      defineField({
        name: "row",
        type: "number",
        title: "Row (1-3)",
        validation: (Rule) => Rule.required().min(1).max(3),
        initialValue: 1,
      }),
      defineField({
        name: "column",
        type: "number",
        title: "Column (1-7)",
        validation: (Rule) => Rule.required().min(1).max(7),
        initialValue: 1,
      }),
    ],
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "size",
    title: "Widget Size",
    type: "string",
    options: { list: ALL_SIZES },
    initialValue: "1x1",
    validation: (Rule) => Rule.required(),
  }),
  ...uniqueFields,
];

const createWidgetPreview = (name: string) => ({
  select: {
    size: "size",
  },
  prepare({ size }: { size: string }) {
    return {
      title: `${name} Widget`,
      subtitle: `Size: ${size || "1x1"}`,
    };
  },
});

// Widget Definitions
export const twitter = {
  type: "object",
  name: "twitter",
  title: "Twitter",
  fields: createWidgetFields([
    defineField({ name: "tweet", type: "text", title: "Tweet" }),
    defineField({ name: "author", type: "string", title: "Author" }),
    defineField({ name: "link", type: "url", title: "Link" }),
    defineField({
      name: "media",
      title: "Media",
      type: "array",
      of: [{ type: "image", title: "Image" }],
    }),
  ]),
  preview: createWidgetPreview("Twitter"),
};

export const media = {
  type: "object",
  name: "media",
  title: "Media",
  fields: createWidgetFields([createMediaArray()]),
  preview: createWidgetPreview("Media"),
};

export const project = {
  type: "object",
  name: "project",
  title: "Project",
  fields: createWidgetFields([
    defineField({
      name: "client",
      title: "Client",
      type: "reference",
      to: [{ type: "clients" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Brand", value: "brand" },
          { title: "Product", value: "product" },
          { title: "Motion", value: "motion" },
          { title: "Web", value: "web" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Case Study", value: "caseStudy" },
          { title: "Preview", value: "preview" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ]),
  preview: createWidgetPreview("Project"),
};

export const rive = {
  type: "object",
  name: "rive",
  title: "Rive",
  fields: createWidgetFields([
    defineField({ name: "src", type: "url", title: "Source" }),
  ]),
  preview: createWidgetPreview("Rive"),
};

export const recents = {
  type: "object",
  name: "recents",
  title: "Recents",
  fields: createWidgetFields([
    defineField({
      name: "clients",
      title: "Clients",
      type: "array",
      of: [{ type: "reference", to: [{ type: "clients" }] }],
      validation: (Rule) => Rule.required().max(3),
    }),
  ]),
  preview: createWidgetPreview("Recents"),
};

export const widgets = [twitter, media, project, rive, recents];
