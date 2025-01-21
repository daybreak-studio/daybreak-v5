import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "../env";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource | undefined): string => {
  if (!source) {
    console.warn("No source provided to urlFor");
    return "";
  }

  return imageBuilder
    .image(source)
    .auto("format")
    .quality(100)
    .fit("max")
    .url();
};

export const getMuxThumbnailUrl = (
  media: {
    source?: {
      asset?: {
        playbackId?: string;
      };
    };
  },
  time?: number,
) => {
  const playbackId = media.source?.asset?.playbackId;
  if (!playbackId) return "";
  const baseUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
  return time !== undefined ? `${baseUrl}?time=${time}` : baseUrl;
};
