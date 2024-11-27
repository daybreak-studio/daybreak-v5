import { defineField } from "sanity";

const widthOptions = [
  { title: "Quarter (25%)", value: "1/4" },
  { title: "Third (33%)", value: "1/3" },
  { title: "Half (50%)", value: "1/2" },
  { title: "Two-Thirds (66%)", value: "2/3" },
  { title: "Three-Quarters (75%)", value: "3/4" },
  { title: "Full (100%)", value: "1/1" },
];

export const createMediaArray = ({
  name = "media",
  title = "Media",
  validation,
}: {
  name?: string;
  title?: string;
  validation?: (Rule: any) => any;
} = {}) =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      defineField({
        type: "object",
        name: "imageItem",
        title: "Image",
        fields: [
          {
            name: "source",
            type: "image",
            title: "Image",
            options: {
              hotspot: true,
              metadata: ["blurhash", "lqip", "palette"],
            },
          },
          {
            name: "width",
            type: "string",
            title: "Width",
            options: { list: widthOptions },
            initialValue: "1/1",
          },
          {
            name: "alt",
            type: "string",
            title: "Alt Text",
          },
        ],
        preview: {
          select: {
            image: "image",
            width: "width",
            alt: "alt",
          },
          prepare({ image, width, alt }) {
            return {
              title: alt || "Image",
              subtitle: `Width: ${width || "100%"}`,
              media: image,
            };
          },
        },
      }),
      defineField({
        type: "object",
        name: "videoItem",
        title: "Video",
        fields: [
          {
            name: "source",
            type: "mux.video",
            title: "Video",
          },
          {
            name: "width",
            type: "string",
            title: "Width",
            options: { list: widthOptions },
            initialValue: "1/1",
          },
          {
            name: "alt",
            type: "string",
            title: "Alt Text",
          },
        ],
        preview: {
          select: {
            video: "video",
            width: "width",
            alt: "alt",
          },
          prepare({ video, width, alt }) {
            return {
              title: alt || "Video",
              subtitle: `Width: ${width || "100%"}`,
              media: video,
            };
          },
        },
      }),
    ],
    validation,
  });
