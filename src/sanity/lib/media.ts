import { Preview, CaseStudy, Work } from "@/sanity/types";
import {
  SanityImageCrop,
  SanityImageHotspot,
  SanityImageMetadata,
} from "@/sanity/types";

// Base enriched asset type
interface EnrichedAsset {
  _ref: string;
  _type: "reference";
  _weak?: boolean;
  metadata?: SanityImageMetadata;
}

// Extend for Mux-specific properties
interface EnrichedMuxAsset extends EnrichedAsset {
  playbackId?: string;
  assetId?: string;
  status?: string;
}

export type BaseMediaItem = {
  source?: {
    asset?: EnrichedAsset | EnrichedMuxAsset;
  };
  width?: "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1/1";
  alt?: string;
  _key: string;
};

export type ImageItem = BaseMediaItem & {
  _type: "imageItem";
  source?: {
    asset?: EnrichedAsset;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
};

export type VideoItem = BaseMediaItem & {
  _type: "videoItem";
  source?: {
    asset?: EnrichedMuxAsset;
    _type: "mux.video";
  };
};

export type MediaItem = ImageItem | VideoItem;

// Gets first media from a CaseStudy (which has mediaGroups)
const getCaseStudyFirstMedia = (project: CaseStudy): MediaItem | null => {
  const firstMediaGroup = project.mediaGroups?.[0];
  if (!firstMediaGroup?.media?.length) return null;
  return firstMediaGroup.media[0] as MediaItem;
};

// Gets first media from a Preview (which has direct media array)
const getPreviewFirstMedia = (project: Preview): MediaItem | null => {
  return (project.media?.[0] as MediaItem) || null;
};

// Main utility function that handles both project types
export const getProjectFirstMedia = (
  project: Preview | CaseStudy,
): MediaItem | null => {
  if (project._type === "preview") {
    return getPreviewFirstMedia(project);
  } else {
    return getCaseStudyFirstMedia(project);
  }
};

// Used specifically for work index thumbnails
export const getWorkFirstMedia = (work: Work): MediaItem | null => {
  const firstProject = work.projects?.[0];
  if (!firstProject) return null;

  return getProjectFirstMedia(firstProject);
};

// Update the getMuxThumbnailUrl function to use the enriched type
export const getMuxThumbnailUrl = (media: VideoItem): string => {
  const playbackId = media.source?.asset?.playbackId;
  if (!playbackId) {
    console.warn("No playbackId found for video");
    return "";
  }
  return `https://image.mux.com/${playbackId}/thumbnail.jpg`;
};
