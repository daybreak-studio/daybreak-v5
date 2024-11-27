import { Preview, CaseStudy, Work } from "@/sanity/types";
import { MuxVideo, SanityImageCrop, SanityImageHotspot } from "@/sanity/types";

export type BaseMediaItem = {
  source?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
    };
  };
  width?: "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1/1";
  alt?: string;
  _key: string;
};

export type ImageItem = BaseMediaItem & {
  _type: "imageItem";
  source?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
};

export type VideoItem = BaseMediaItem & {
  _type: "videoItem";
  source?: MuxVideo;
};

export type MediaItem = ImageItem | VideoItem;

// Define the enriched asset type that includes queried fields
interface EnrichedMuxAsset {
  _ref: string;
  _type: "reference";
  _weak?: boolean;
  playbackId?: string;
  assetId?: string;
  status?: string;
  metadata?: {
    dimensions?: any;
    lqip?: string;
    palette?: any;
    hasAlpha?: boolean;
    isOpaque?: boolean;
    blurHash?: string;
  };
}

// Extend the VideoItem type to include the enriched asset
export interface EnrichedVideoItem extends Omit<VideoItem, "source"> {
  source?: {
    asset?: EnrichedMuxAsset;
  } & MuxVideo;
}

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
export const getMuxThumbnailUrl = (media: EnrichedVideoItem): string => {
  const playbackId = media.source?.asset?.playbackId;
  if (!playbackId) {
    console.warn("No playbackId found for video");
    return "";
  }
  return `https://image.mux.com/${playbackId}/thumbnail.jpg`;
};
