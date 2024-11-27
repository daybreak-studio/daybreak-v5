import { groq } from "next-sanity";

// Base media projection that handles both images and videos
const MEDIA_PROJECTION = `
  ...,
  _type,
  source {
    ...,
    _type,
    "asset": {
      "_ref": asset._ref,
      "_type": asset._type,
      ...asset->{
        playbackId,
        assetId,
        status,
        metadata {
          dimensions,
          lqip,
          palette,
          hasAlpha,
          isOpaque,
          blurHash
        }
      }
    }
  }
`;

// Main queries
export const WORKS_QUERY = groq`
  *[_type == "work"][!(_id in path('drafts.**'))] {
    ...,
    projects[] {
      ...,
      _type == "preview" => {
        media[] {
          ${MEDIA_PROJECTION}
        }
      },
      _type == "caseStudy" => {
        mediaGroups[] {
          ...,
          heading,
          caption,
          media[] {
            ${MEDIA_PROJECTION}
          }
        }
      }
    }
  }
`;

export const HOME_QUERY = groq`
  *[_type == "home"][!(_id in path('drafts.**'))][0] {
    ...,
    media[] {
      ${MEDIA_PROJECTION}
    },
    widgets[] {
      ...,
      media[] {
        ${MEDIA_PROJECTION}
      }
    }
  }
`;
