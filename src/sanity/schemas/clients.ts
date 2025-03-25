import { defineField, defineType } from "sanity";
import { createMediaArray } from "./media";
import { MuxThumbnail } from "../components/mux-thumbnail";

export const clients = defineType({
  name: "clients",
  title: "Work",
  type: "document",
  fields: [
    defineField({
      name: "priority",
      title: "Priority",
      type: "number",
      description: "Lower numbers will appear first (e.g. 1 appears before 10)",
      initialValue: 10,
    }),
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
      name: "logo",
      title: "Client Logo",
      type: "image",
      description: "Square aspect ratio recommended.",
      options: {
        accept: "image/png,image/jpeg",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
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
      name: "date",
      title: "Published Date",
      type: "date",
      description: "When this project was published/launched",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "The type of work this project represents",
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
      description: "Main title for the preview",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      description: "Brief description or subtitle for the preview",
    }),
    createMediaArray(),
    defineField({
      name: "link",
      title: "External Link",
      type: "url",
      description: "Optional link to external content or live project",
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
      name: "date",
      title: "Published Date",
      type: "date",
      description: "When this project was published/launched",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "The type of work this project represents",
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
      description: "Main title for the case study",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      description: "Brief description or subtitle for the case study",
    }),
    defineField({
      name: "mediaGroups",
      title: "Media Groups",
      type: "array",
      description: "Groups of media content with associated text",
      of: [
        {
          type: "object",
          name: "mediaGroup",
          fields: [
            defineField({
              name: "heading",
              type: "string",
              title: "Heading",
              description: "Title for this media group",
            }),
            defineField({
              name: "caption",
              type: "text",
              title: "Caption",
              description: "Descriptive text for this media group",
            }),
            createMediaArray({
              name: "media",
              title: "Media",
              validation: (Rule) => Rule.required().min(1).max(2),
            }),
          ],
          preview: {
            select: {
              heading: "heading",
              media: "media",
              caption: "caption",
              playbackId: "media.0.source.asset.playbackId",
            },
            prepare({ heading, media, caption, playbackId }) {
              // Check if media exists and get its length
              const mediaCount = media ? Object.keys(media).length : 0;

              // Count media types
              const mediaItems = Object.values(media || {});
              const hasImage = mediaItems.some(
                (item: any) => item._type === "imageItem",
              );
              const hasVideo = mediaItems.some(
                (item: any) => item._type === "videoItem",
              );

              // Create media string
              let mediaString = "";
              if (hasImage && hasVideo) {
                mediaString = "Image + Video";
              } else if (hasImage) {
                mediaString = mediaCount > 1 ? "Image + Image" : "Image";
              } else if (hasVideo) {
                mediaString = mediaCount > 1 ? "Video + Video" : "Video";
              }

              // Set title based on media count
              const title = `${mediaCount === 1 ? "Full" : "Split"} - ${mediaString}`;

              // Use heading as subtitle, if available
              const subtitle = heading || "";

              // Get preview media from the first item
              const firstMedia = media?.[0];
              let previewMedia;

              if (firstMedia) {
                if (firstMedia._type === "videoItem" && playbackId) {
                  previewMedia = () => MuxThumbnail({ value: playbackId });
                } else {
                  previewMedia = firstMedia.source;
                }
              }

              return {
                title,
                subtitle,
                media: previewMedia,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "array",
      description: "List of people and their roles in the project",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "role",
              type: "string",
              description: "The role or responsibility",
            },
            {
              name: "names",
              type: "array",
              of: [{ type: "string" }],
              description: "Names of people in this role",
            },
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
