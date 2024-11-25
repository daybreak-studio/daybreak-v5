import {
  ImagesIcon,
  DocumentVideoIcon,
  InlineElementIcon,
} from "@sanity/icons";
import CarouselPreview from "@/sanity/components/carousel";

const sizeOptions = [
  { title: "Quarter (25%)", value: "1/4" },
  { title: "Third (33%)", value: "1/3" },
  { title: "Half (50%)", value: "1/2" },
  { title: "Two-Thirds (66%)", value: "2/3" },
  { title: "Three-Quarters (75%)", value: "3/4" },
  { title: "Full (100%)", value: "1/1" },
];

const fields = [
  { name: "title", title: "Title", type: "string" },
  { name: "alt", title: "Caption", type: "string" },
  {
    name: "width",
    title: "Width",
    type: "string",
    options: {
      list: sizeOptions,
    },
  },
];

const carousel = {
  name: "carousel",
  title: "Carousel",
  type: "object",
  icon: InlineElementIcon,
  fields: [
    {
      name: "media",
      title: "Media",
      type: "array",
      of: [
        {
          name: "image",
          title: "Image",
          type: "image",
          icon: ImagesIcon,
          fields: [...fields],
          options: {
            metadata: ["blurhash", "lqip", "palette"],
          },
        },
        {
          name: "video",
          title: "Video",
          type: "file",
          icon: DocumentVideoIcon,
          fields: [...fields],
          options: {
            accept: "video/*",
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      media: "media",
    },
  },
  components: {
    preview: CarouselPreview,
  },
};

export default carousel;
