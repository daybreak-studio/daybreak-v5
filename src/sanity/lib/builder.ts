import createImageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { buildFileUrl, SanityReference } from "@sanity/asset-utils";
import { dataset, projectId } from "../env";
// import { FileAsset } from "sanity";

// Image URL builder
const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export const imageUrlFor = (source: SanityImageSource) => {
  return imageBuilder.image(source);
};

export const fileUrlFor = (fileAsset: any) => {
  if (!fileAsset || !fileAsset.asset || !fileAsset.asset._ref) {
    return "";
  }
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileAsset.asset._ref
    .replace("file-", "")
    .replace("-mp4", ".mp4")}`;
};

// Auto-detect asset type and use appropriate URL builder
export const assetUrlFor = (asset: any) => {
  if (!asset) return "";

  if (asset._type === "image") {
    return imageUrlFor(asset).url();
  } else if (asset._type === "file" || asset._type === "video") {
    return fileUrlFor(asset);
  }

  // If asset type is not recognized, return an empty string
  return "";
};
