/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type Team = {
  _id: string;
  _type: "team";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  introduction?: string;
  teamMembers?: Array<{
    name?: string;
    role?: string;
    image?: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: "image";
    };
    bio?: string;
    _key: string;
  }>;
};

export type Settings = {
  _id: string;
  _type: "settings";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  description?: string;
  openGraphImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
};

export type Services = {
  _id: string;
  _type: "services";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  quotes?: Array<{
    name?: string;
    title?: string;
    quote?: string;
    _key: string;
  }>;
  logos?: Array<{
    image?: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: "image";
    };
    alt?: string;
    companyName?: string;
    url?: string;
    _key: string;
  }>;
  serviceCategories?: {
    brand?: {
      tabs?: Array<{
        heading?: string;
        title?: string;
        caption?: string;
        image?: {
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
        };
        _type: "tab";
        _key: string;
      }>;
    };
    product?: {
      tabs?: Array<{
        heading?: string;
        title?: string;
        caption?: string;
        image?: {
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
        };
        _type: "tab";
        _key: string;
      }>;
    };
    motion?: {
      tabs?: Array<{
        heading?: string;
        title?: string;
        caption?: string;
        image?: {
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
        };
        _type: "tab";
        _key: string;
      }>;
    };
    development?: {
      tabs?: Array<{
        heading?: string;
        title?: string;
        caption?: string;
        image?: {
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
        };
        _type: "tab";
        _key: string;
      }>;
    };
  };
};

export type CaseStudy = {
  _type: "caseStudy";
  category?: "brand" | "product" | "web" | "motion";
  heading?: string;
  mediaGroups?: Array<{
    heading?: string;
    caption?: string;
    media?: Array<
      | {
          source?: {
            asset?: {
              _ref: string;
              _type: "reference";
              _weak?: boolean;
              [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
            };
            hotspot?: SanityImageHotspot;
            crop?: SanityImageCrop;
            _type: "image";
          };
          width?: "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1/1";
          alt?: string;
          _type: "imageItem";
          _key: string;
        }
      | {
          source?: MuxVideo;
          width?: "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1/1";
          alt?: string;
          _type: "videoItem";
          _key: string;
        }
    >;
    _type: "mediaGroup";
    _key: string;
  }>;
  credits?: Array<{
    role?: string;
    names?: Array<string>;
    _key: string;
  }>;
};

export type Preview = {
  _type: "preview";
  category?: "brand" | "product" | "web" | "motion";
  heading?: string;
  caption?: string;
  media?: Array<
    | {
        source?: {
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
        };
        width?: "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1/1";
        alt?: string;
        _type: "imageItem";
        _key: string;
      }
    | {
        source?: MuxVideo;
        width?: "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1/1";
        alt?: string;
        _type: "videoItem";
        _key: string;
      }
  >;
  link?: string;
  date?: string;
};

export type Work = {
  _id: string;
  _type: "work";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug?: Slug;
  projects?: Array<
    | ({
        _key: string;
      } & Preview)
    | ({
        _key: string;
      } & CaseStudy)
  >;
};

export type Slug = {
  _type: "slug";
  current?: string;
  source?: string;
};

export type Home = {
  _id: string;
  _type: "home";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  widgets?: Array<
    | {
        position?: {
          x?: number;
          y?: number;
        };
        size?: "1x1" | "2x2";
        tweet?: string;
        author?: string;
        link?: string;
        media?: Array<{
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
          _key: string;
        }>;
        _type: "twitterWidget";
        _key: string;
      }
    | {
        position?: {
          x?: number;
          y?: number;
        };
        size?: "2x2" | "3x3";
        media?: Array<
          | {
              source?: {
                asset?: {
                  _ref: string;
                  _type: "reference";
                  _weak?: boolean;
                  [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
                };
                hotspot?: SanityImageHotspot;
                crop?: SanityImageCrop;
                _type: "image";
              };
              width?: "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1/1";
              alt?: string;
              _type: "imageItem";
              _key: string;
            }
          | {
              source?: MuxVideo;
              width?: "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1/1";
              alt?: string;
              _type: "videoItem";
              _key: string;
            }
        >;
        _type: "mediaWidget";
        _key: string;
      }
  >;
  missionStatement?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  media?: Array<
    | {
        source?: {
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
        };
        width?: "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1/1";
        alt?: string;
        _type: "imageItem";
        _key: string;
      }
    | {
        source?: MuxVideo;
        width?: "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1/1";
        alt?: string;
        _type: "videoItem";
        _key: string;
      }
  >;
  aboutUs?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  newsfeed?: Array<{
    media?: Array<
      | {
          source?: {
            asset?: {
              _ref: string;
              _type: "reference";
              _weak?: boolean;
              [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
            };
            hotspot?: SanityImageHotspot;
            crop?: SanityImageCrop;
            _type: "image";
          };
          width?: "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1/1";
          alt?: string;
          _type: "imageItem";
          _key: string;
        }
      | {
          source?: MuxVideo;
          width?: "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1/1";
          alt?: string;
          _type: "videoItem";
          _key: string;
        }
    >;
    date?: string;
    title?: string;
    description?: string;
    link?: string;
    _type: "article";
    _key: string;
  }>;
};

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type MuxVideo = {
  _type: "mux.video";
  asset?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "mux.videoAsset";
  };
};

export type MuxVideoAsset = {
  _type: "mux.videoAsset";
  status?: string;
  assetId?: string;
  playbackId?: string;
  filename?: string;
  thumbTime?: number;
  data?: MuxAssetData;
};

export type MuxAssetData = {
  _type: "mux.assetData";
  resolution_tier?: string;
  upload_id?: string;
  created_at?: string;
  id?: string;
  status?: string;
  max_stored_resolution?: string;
  passthrough?: string;
  encoding_tier?: string;
  master_access?: string;
  aspect_ratio?: string;
  duration?: number;
  max_stored_frame_rate?: number;
  mp4_support?: string;
  max_resolution_tier?: string;
  tracks?: Array<
    {
      _key: string;
    } & MuxTrack
  >;
  playback_ids?: Array<
    {
      _key: string;
    } & MuxPlaybackId
  >;
  static_renditions?: MuxStaticRenditions;
};

export type MuxStaticRenditions = {
  _type: "mux.staticRenditions";
  status?: string;
  files?: Array<
    {
      _key: string;
    } & MuxStaticRenditionFile
  >;
};

export type MuxStaticRenditionFile = {
  _type: "mux.staticRenditionFile";
  ext?: string;
  name?: string;
  width?: number;
  bitrate?: number;
  filesize?: number;
  height?: number;
};

export type MuxPlaybackId = {
  _type: "mux.playbackId";
  id?: string;
  policy?: string;
};

export type MuxTrack = {
  _type: "mux.track";
  id?: string;
  type?: string;
  max_width?: number;
  max_frame_rate?: number;
  duration?: number;
  max_height?: number;
};

export type AllSanitySchemaTypes =
  | SanityImagePaletteSwatch
  | SanityImagePalette
  | SanityImageDimensions
  | SanityFileAsset
  | Geopoint
  | Team
  | Settings
  | Services
  | CaseStudy
  | Preview
  | Work
  | Slug
  | Home
  | SanityImageCrop
  | SanityImageHotspot
  | SanityImageAsset
  | SanityAssetSourceData
  | SanityImageMetadata
  | MuxVideo
  | MuxVideoAsset
  | MuxAssetData
  | MuxStaticRenditions
  | MuxStaticRenditionFile
  | MuxPlaybackId
  | MuxTrack;
export declare const internalGroqTypeReferenceTo: unique symbol;
// Source: ./src/sanity/lib/queries.ts
// Variable: WORKS_QUERY
// Query: *[_type == "work"][!(_id in path('drafts.**'))] {    ...,    projects[] {      ...,      _type == "preview" => {        media[] {            ...,  _type,  source {    ...,    _type,    "asset": {      "_ref": asset._ref,      "_type": asset._type,      ...asset->{        playbackId,        assetId,        status,        metadata {          dimensions,          lqip,          palette,          hasAlpha,          isOpaque,          blurHash        }      }    }  }        }      },      _type == "caseStudy" => {        mediaGroups[] {          ...,          heading,          caption,          media[] {              ...,  _type,  source {    ...,    _type,    "asset": {      "_ref": asset._ref,      "_type": asset._type,      ...asset->{        playbackId,        assetId,        status,        metadata {          dimensions,          lqip,          palette,          hasAlpha,          isOpaque,          blurHash        }      }    }  }          }        }      }    }  }
export type WORKS_QUERYResult = Array<{
  _id: string;
  _type: "work";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug?: Slug;
  projects: Array<
    | {
        _key: string;
        _type: "caseStudy";
        category?: "brand" | "motion" | "product" | "web";
        heading?: string;
        mediaGroups: Array<{
          heading: string | null;
          caption: string | null;
          media: Array<
            | {
                source: {
                  asset:
                    | {
                        _ref: string | null;
                        _type: "reference" | null;
                        playbackId: null;
                        assetId: string | null;
                        status: null;
                        metadata: {
                          dimensions: SanityImageDimensions | null;
                          lqip: string | null;
                          palette: SanityImagePalette | null;
                          hasAlpha: boolean | null;
                          isOpaque: boolean | null;
                          blurHash: string | null;
                        } | null;
                      }
                    | {
                        _ref: string | null;
                        _type: "reference" | null;
                      };
                  hotspot?: SanityImageHotspot;
                  crop?: SanityImageCrop;
                  _type: "image";
                } | null;
                width?: "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4";
                alt?: string;
                _type: "imageItem";
                _key: string;
              }
            | {
                source: {
                  _type: "mux.video";
                  asset: {
                    _ref: string | null;
                    _type: "reference" | null;
                  };
                } | null;
                width?: "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4";
                alt?: string;
                _type: "videoItem";
                _key: string;
              }
          > | null;
          _type: "mediaGroup";
          _key: string;
        }> | null;
        credits?: Array<{
          role?: string;
          names?: Array<string>;
          _key: string;
        }>;
      }
    | {
        _key: string;
        _type: "preview";
        category?: "brand" | "motion" | "product" | "web";
        heading?: string;
        caption?: string;
        media: Array<
          | {
              source: {
                asset:
                  | {
                      _ref: string | null;
                      _type: "reference" | null;
                      playbackId: null;
                      assetId: string | null;
                      status: null;
                      metadata: {
                        dimensions: SanityImageDimensions | null;
                        lqip: string | null;
                        palette: SanityImagePalette | null;
                        hasAlpha: boolean | null;
                        isOpaque: boolean | null;
                        blurHash: string | null;
                      } | null;
                    }
                  | {
                      _ref: string | null;
                      _type: "reference" | null;
                    };
                hotspot?: SanityImageHotspot;
                crop?: SanityImageCrop;
                _type: "image";
              } | null;
              width?: "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4";
              alt?: string;
              _type: "imageItem";
              _key: string;
            }
          | {
              source: {
                _type: "mux.video";
                asset: {
                  _ref: string | null;
                  _type: "reference" | null;
                };
              } | null;
              width?: "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4";
              alt?: string;
              _type: "videoItem";
              _key: string;
            }
        > | null;
        link?: string;
        date?: string;
      }
  > | null;
}>;
// Variable: HOME_QUERY
// Query: *[_type == "home"][!(_id in path('drafts.**'))][0] {    ...,    media[] {        ...,  _type,  source {    ...,    _type,    "asset": {      "_ref": asset._ref,      "_type": asset._type,      ...asset->{        playbackId,        assetId,        status,        metadata {          dimensions,          lqip,          palette,          hasAlpha,          isOpaque,          blurHash        }      }    }  }    },    widgets[] {      ...,      media[] {          ...,  _type,  source {    ...,    _type,    "asset": {      "_ref": asset._ref,      "_type": asset._type,      ...asset->{        playbackId,        assetId,        status,        metadata {          dimensions,          lqip,          palette,          hasAlpha,          isOpaque,          blurHash        }      }    }  }      }    },    newsfeed[] {      ...,      media[] {          ...,  _type,  source {    ...,    _type,    "asset": {      "_ref": asset._ref,      "_type": asset._type,      ...asset->{        playbackId,        assetId,        status,        metadata {          dimensions,          lqip,          palette,          hasAlpha,          isOpaque,          blurHash        }      }    }  }      }    }  }
export type HOME_QUERYResult = {
  _id: string;
  _type: "home";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  widgets: Array<
    | {
        position?: {
          x?: number;
          y?: number;
        };
        size?: "2x2" | "3x3";
        media: Array<
          | {
              source: {
                asset:
                  | {
                      _ref: string | null;
                      _type: "reference" | null;
                      playbackId: null;
                      assetId: string | null;
                      status: null;
                      metadata: {
                        dimensions: SanityImageDimensions | null;
                        lqip: string | null;
                        palette: SanityImagePalette | null;
                        hasAlpha: boolean | null;
                        isOpaque: boolean | null;
                        blurHash: string | null;
                      } | null;
                    }
                  | {
                      _ref: string | null;
                      _type: "reference" | null;
                    };
                hotspot?: SanityImageHotspot;
                crop?: SanityImageCrop;
                _type: "image";
              } | null;
              width?: "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4";
              alt?: string;
              _type: "imageItem";
              _key: string;
            }
          | {
              source: {
                _type: "mux.video";
                asset: {
                  _ref: string | null;
                  _type: "reference" | null;
                };
              } | null;
              width?: "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4";
              alt?: string;
              _type: "videoItem";
              _key: string;
            }
        > | null;
        _type: "mediaWidget";
        _key: string;
      }
    | {
        position?: {
          x?: number;
          y?: number;
        };
        size?: "1x1" | "2x2";
        tweet?: string;
        author?: string;
        link?: string;
        media: Array<{
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
          _key: string;
          source: null;
        }> | null;
        _type: "twitterWidget";
        _key: string;
      }
  > | null;
  missionStatement?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  media: Array<
    | {
        source: {
          asset:
            | {
                _ref: string | null;
                _type: "reference" | null;
                playbackId: null;
                assetId: string | null;
                status: null;
                metadata: {
                  dimensions: SanityImageDimensions | null;
                  lqip: string | null;
                  palette: SanityImagePalette | null;
                  hasAlpha: boolean | null;
                  isOpaque: boolean | null;
                  blurHash: string | null;
                } | null;
              }
            | {
                _ref: string | null;
                _type: "reference" | null;
              };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
        } | null;
        width?: "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4";
        alt?: string;
        _type: "imageItem";
        _key: string;
      }
    | {
        source: {
          _type: "mux.video";
          asset: {
            _ref: string | null;
            _type: "reference" | null;
          };
        } | null;
        width?: "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4";
        alt?: string;
        _type: "videoItem";
        _key: string;
      }
  > | null;
  aboutUs?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  newsfeed: Array<{
    media: Array<
      | {
          source: {
            asset:
              | {
                  _ref: string | null;
                  _type: "reference" | null;
                  playbackId: null;
                  assetId: string | null;
                  status: null;
                  metadata: {
                    dimensions: SanityImageDimensions | null;
                    lqip: string | null;
                    palette: SanityImagePalette | null;
                    hasAlpha: boolean | null;
                    isOpaque: boolean | null;
                    blurHash: string | null;
                  } | null;
                }
              | {
                  _ref: string | null;
                  _type: "reference" | null;
                };
            hotspot?: SanityImageHotspot;
            crop?: SanityImageCrop;
            _type: "image";
          } | null;
          width?: "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4";
          alt?: string;
          _type: "imageItem";
          _key: string;
        }
      | {
          source: {
            _type: "mux.video";
            asset: {
              _ref: string | null;
              _type: "reference" | null;
            };
          } | null;
          width?: "1/1" | "1/2" | "1/3" | "1/4" | "2/3" | "3/4";
          alt?: string;
          _type: "videoItem";
          _key: string;
        }
    > | null;
    date?: string;
    title?: string;
    description?: string;
    link?: string;
    _type: "article";
    _key: string;
  }> | null;
} | null;
