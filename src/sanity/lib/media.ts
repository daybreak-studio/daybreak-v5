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
      _type: "reference";
      metadata?: SanityImageMetadata;
      playbackId?: string; // For mux videos
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
  };
  width?: string;
  alt?: string;
  _key: string;
};

export type VideoItem = MediaItem & {
  _type: "videoItem";
  source?: {
    _type: "mux.video";
    asset?: {
      playbackId?: string;
    };
  };
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
