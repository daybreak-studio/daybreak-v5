import {
  ImagesIcon,
  DocumentVideoIcon,
  InlineElementIcon,
} from "@sanity/icons";
import CarouselPreview from "@/sanity/components/carousel";
import { createMediaArray } from "./media";

const carousel = {
  name: "carousel",
  title: "Carousel",
  type: "object",
  icon: InlineElementIcon,
  fields: [createMediaArray()],
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
