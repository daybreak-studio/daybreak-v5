import { buildFileUrl } from "@sanity/asset-utils";
import { dataset, projectId } from "../env";

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

class FileBuilder {
  private asset: SanityReference | null = null;

  file(asset: FileAsset): FileBuilder {
    if ("asset" in asset) {
      this.asset = asset.asset;
    } else {
      this.asset = asset;
    }
    return this;
  }

  url(): string {
    if (!this.asset) {
      throw new Error("No file asset specified");
    }

    if (!projectId || !dataset) {
      throw new Error("Sanity project ID or dataset is not defined");
    }

    const assetRef = this.asset._ref;
    const [, assetId, extension] = assetRef.split("-");

    return buildFileUrl({
      projectId,
      dataset,
      assetId,
      extension,
    });
  }
}

export const fileBuilder = {
  file: (asset: FileAsset) => new FileBuilder().file(asset),
};
