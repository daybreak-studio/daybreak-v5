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
export const CLIENTS_QUERY = groq`
  *[_type == "clients"][!(_id in path('drafts.**'))] {
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
    },
    newsfeed[] {
      ...,
      media[] {
        ${MEDIA_PROJECTION}
      }
    }
  }
`;

export const SERVICES_QUERY = groq`
  *[_type == "services"][!(_id in path('drafts.**'))][0] {
    ...,
    categories {
      brand[] {
        ...,
        media[] {
          ${MEDIA_PROJECTION}
        }
      },
      product[] {
        ...,
        media[] {
          ${MEDIA_PROJECTION}
        }
      },
      motion[] {
        ...,
        media[] {
          ${MEDIA_PROJECTION}
        }
      },
      development[] {
        ...,
        media[] {
          ${MEDIA_PROJECTION}
        }
      }
    }
  }
`;

export const ABOUT_QUERY = groq`
  *[_type == "about"][!(_id in path('drafts.**'))][0] {
    ...,
    team[] {
      ...,
      media[] {
        ${MEDIA_PROJECTION}
      }
    }
  }
`;
