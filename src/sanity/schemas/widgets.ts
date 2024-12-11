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

// Widget Definitions
export const twitterWidget = {
  type: "object",
  name: "twitterWidget",
  title: "Twitter Widget",
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
};

export const mediaWidget = {
  type: "object",
  name: "mediaWidget",
  title: "Media Widget",
  fields: createWidgetFields([createMediaArray()]),
};

export const projectWidget = {
  type: "object",
  name: "projectWidget",
  title: "Project Widget",
  fields: createWidgetFields([
    defineField({
      name: "selectedClient",
      title: "Select Client",
      type: "reference",
      to: [{ type: "clients" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "projectCategory",
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
      name: "projectType",
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
};

export const widgets = [twitterWidget, mediaWidget, projectWidget];
