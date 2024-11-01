import { client } from "@/sanity/lib/client";
import { Work } from "@/sanity/types";

export const worksApi = {
  // Get all works (used in /work/index.tsx)
  getAllWorks: async (): Promise<Work[]> => {
    const query = `*[_type == "work"][!(_id in path('drafts.**'))]`;
    return client.fetch<Work[]>(query);
  },

  // Get single work by slug (used in /work/[client]/index.tsx and /work/[client]/[project]/index.tsx)
  getWorkBySlug: async (slug: string): Promise<Work> => {
    const query = `*[_type == "work" && slug.current == $slug][0]`;
    return client.fetch<Work>(query, { slug });
  },

  // Get all client slugs (used in /work/[client]/index.tsx getStaticPaths)
  getAllClientSlugs: async (): Promise<string[]> => {
    const query = `*[_type == "work"]{slug}`;
    const data = await client.fetch<{ slug: { current: string } }[]>(query);
    return data.map((work) => work.slug.current);
  },

  // Get all client-project combinations (used in /work/[client]/[project]/index.tsx getStaticPaths)
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
