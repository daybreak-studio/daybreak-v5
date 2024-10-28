import createImageUrlBuilder from "@sanity/image-url";
import { buildFileUrl } from "@sanity/asset-utils";
import { client } from "./client";
import { dataset, projectId } from "../env";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Define a more flexible asset type
type SanityReference = {
  _ref: string;
  _type?: string;
};

type AssetObject = {
  _type?: "file";
  asset: SanityReference;
};

type FileAsset = SanityReference | AssetObject;

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return imageBuilder.image(source).auto("format").fit("max");
};

export const fileBuilder = {
  file: (asset: FileAsset) => {
    const assetRef = "asset" in asset ? asset.asset._ref : asset._ref;
    const [, assetId, extension] = assetRef.split("-");

    return {
      url: () =>
        buildFileUrl({
          projectId,
          dataset,
          assetId,
          extension,
        }),
    };
  },
};
