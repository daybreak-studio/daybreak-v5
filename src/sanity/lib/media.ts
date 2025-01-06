import { Preview, CaseStudy, Clients } from "@/sanity/types";
import {
  SanityImageCrop,
  SanityImageHotspot,
  SanityImageMetadata,
} from "@/sanity/types";

export type MediaItem = {
  _type: "imageItem" | "videoItem";
  source?: {
    _type: "image" | "mux.video";
    asset?: {
      _ref: string;
      assetId?: string;
      _type: "reference";
      metadata?: SanityImageMetadata;
      playbackId?: string;
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
  };
  width?: string;
  alt?: string;
  _key: string;
};

export const getProjectFirstMedia = (
  project: Preview | CaseStudy | null,
): MediaItem | null => {
  if (!project) return null;

  if (project._type === "preview") {
    return project.media?.[0] ?? null;
  }

  return project.mediaGroups?.[0]?.media?.[0] ?? null;
};

export const getClientFirstMedia = (client: Clients): MediaItem | null => {
  const firstProject = client.projects?.[0];
  if (!firstProject) return null;

  return getProjectFirstMedia(firstProject);
};

/**
 * Extracts a unique asset identifier from a media item
 * @param mediaAsset The media asset (image or video)
 * @returns The unique identifier for the asset, or null if not found
 */
export const getMediaAssetId = (mediaAsset: MediaItem | null) => {
  if (!mediaAsset) return null;

  if (mediaAsset._type === "videoItem") {
    return mediaAsset.source?.asset?.assetId || null;
  }

  if (mediaAsset._type === "imageItem") {
    return mediaAsset.source?.asset?._ref || null;
  }

  return null;
};
