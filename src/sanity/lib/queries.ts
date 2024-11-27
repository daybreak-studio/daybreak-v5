import { groq } from "next-sanity";

const MEDIA_ARRAY_PROJECTION = `
  media[] {
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
          status
        }
      }
    }
  }
`;

export const HOME_QUERY = groq`
  *[_type == "home"][!(_id in path('drafts.**'))][0] {
    ...,
    ${MEDIA_ARRAY_PROJECTION},
    widgets[] {
      ...,
      ${MEDIA_ARRAY_PROJECTION}
    }
  }
`;
