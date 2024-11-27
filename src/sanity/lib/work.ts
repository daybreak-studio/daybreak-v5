import { client } from "@/sanity/lib/client";
import { Work } from "@/sanity/types";

export const MEDIA_PROJECTION = `
  "media": *[]{
    ...,
    _type,
    source {
      ...,
      asset-> {
        ...,
        metadata {
          dimensions,
          lqip,
          palette,
          hasAlpha,
          isOpaque,
          blurHash
        },
        playbackId,
        assetId,
        filename,
        url
      }
    }
  }
`;

export const worksApi = {
  // Get all works
  getAllWorks: async (): Promise<Work[]> => {
    const query = `*[_type == "work"][!(_id in path('drafts.**'))] {
      ${MEDIA_PROJECTION}
    }`;
    return client.fetch<Work[]>(query);
  },

  // Get single work by slug
  getWorkBySlug: async (slug: string): Promise<Work> => {
    const query = `*[_type == "work" && slug.current == $slug][0] {
      ${MEDIA_PROJECTION}
    }`;
    return client.fetch<Work>(query, { slug });
  },

  // These queries don't need media data
  getAllClientSlugs: async (): Promise<string[]> => {
    const query = `*[_type == "work"]{slug}`;
    const data = await client.fetch<{ slug: { current: string } }[]>(query);
    return data.map((work) => work.slug.current);
  },

  getAllClientProjectPaths: async (): Promise<
    Array<{ client: string; project: string }>
  > => {
    const works = await worksApi.getAllWorks();
    return works.flatMap(
      (work) =>
        work.projects?.map((project) => ({
          client: work.slug?.current || "",
          project: project.category || "",
        })) || [],
    );
  },
};
