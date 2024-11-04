import { Preview, CaseStudy, Work } from "@/sanity/types";

type MediaItem = {
  asset?: {
    _ref: string;
    _type: "reference";
  };
  _type: "image" | "video" | "file";
  _key: string;
};

// Gets first media from a CaseStudy (which has mediaGroups)
const getCaseStudyFirstMedia = (project: CaseStudy): MediaItem | null => {
  const firstMediaGroup = project.media?.[0];
  if (!firstMediaGroup?.items?.length) return null;
  return firstMediaGroup.items[0];
};

// Gets first media from a Preview (which has direct media array)
const getPreviewFirstMedia = (project: Preview): MediaItem | null => {
  return project.media?.[0] || null;
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
