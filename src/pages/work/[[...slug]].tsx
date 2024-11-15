import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Work } from "@/sanity/types";
import { useRouter } from "next/router";
import { MediaRenderer } from "@/components/media-renderer";
import { getWorkFirstMedia } from "@/sanity/lib/media";
import ProjectSelector from "@/components/project/selector";
import ProjectPreview from "@/components/project/preview";
import ProjectCaseStudy from "@/components/project/case-study";
import { worksApi } from "@/sanity/lib/work";
import { Cross2Icon } from "@radix-ui/react-icons";
import { GetStaticPaths, GetStaticProps } from "next";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function WorkPage({ data }: { data: Work[] }) {
  const router = useRouter();
  const { slug } = router.query;
  const [clientSlug, projectSlug] = Array.isArray(slug)
    ? slug
    : [slug, undefined];

  // Find the current client based on the slug
  const currentClient = data.find(
    (client) => client.slug?.current === clientSlug,
  );

  // Check if the client has multiple projects
  const shouldUseProjectSlug =
    currentClient?.projects && currentClient.projects.length > 1;

  // Get the current project based on the routing logic
  const currentProject =
    shouldUseProjectSlug && projectSlug
      ? currentClient.projects?.find(
          (project) => project.category === projectSlug,
        )
      : currentClient?.projects?.[0];

  // Redirect if on a project route but client has only one project
  useEffect(() => {
    if (clientSlug && projectSlug && currentClient?.projects?.length === 1) {
      router.replace(`/work/${clientSlug}`, undefined, { shallow: true });
    }
  }, [clientSlug, projectSlug, currentClient, router]);

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.map((client) => {
          const mediaAsset = getWorkFirstMedia(client);
          if (!client.slug) return null;

          const layoutId = `container-${client.slug.current}`;
          const imageLayoutId = `image-${client.slug.current}`;
          const hasMultipleProjects =
            client.projects && client.projects.length > 1;

          return (
            <Dialog.Root
              key={client._id}
              open={clientSlug === client.slug.current}
              onOpenChange={(open) => {
                router.push(
                  open ? `/work/${client.slug?.current}` : "/work",
                  undefined,
                  { shallow: true },
                );
              }}
            >
              <Dialog.Trigger asChild>
                <motion.div
                  layoutId={layoutId}
                  className="group relative aspect-square w-full cursor-pointer rounded-2xl bg-white"
                >
                  <motion.div
                    layoutId={imageLayoutId}
                    className="aspect-square h-full w-full object-cover"
                  >
                    <MediaRenderer
                      media={mediaAsset}
                      className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </motion.div>
                </motion.div>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/30" />
                <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none">
                  <Dialog.Title className="sr-only">
                    {client.name} Project Details
                  </Dialog.Title>
                  <Dialog.Description className="sr-only">
                    View details about the {client.name} project.
                  </Dialog.Description>

                  <motion.div
                    layoutId={layoutId}
                    className={cn(
                      "bg-white",
                      "w-[90vw] rounded-[40px] p-8",
                      hasMultipleProjects && !projectSlug
                        ? "max-w-[800px]"
                        : "max-h-[90vh] max-w-[1016px] overflow-y-auto",
                    )}
                  >
                    {hasMultipleProjects && !projectSlug ? (
                      <ProjectSelector
                        data={client}
                        imageLayoutId={imageLayoutId}
                      />
                    ) : currentProject?._type === "preview" ? (
                      <ProjectPreview
                        data={client}
                        imageLayoutId={imageLayoutId}
                      />
                    ) : (
                      <ProjectCaseStudy
                        data={client}
                        imageLayoutId={imageLayoutId}
                      />
                    )}

                    <Dialog.Close className="absolute right-6 top-6 inline-flex size-[35px] appearance-none items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 focus:shadow-gray-400 focus:outline-none">
                      <Cross2Icon className="h-6 w-6" />
                    </Dialog.Close>
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          );
        })}
      </div>
    </div>
  );
}

// Generate static paths for all possible routes
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const works: Work[] = await worksApi.getAllWorks();

    // Create paths for all client/project combinations
    const paths = works.flatMap(
      (work) =>
        work.projects?.map((project) => ({
          params: {
            slug: [work.slug?.current || "", project.category || ""],
          },
        })) || [],
    );

    // Add the base path for /work
    paths.push({ params: { slug: [] } });

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error fetching works:", error);
    return { paths: [], fallback: "blocking" };
  }
};

// Fetch all work data at build time
export const getStaticProps: GetStaticProps = async () => {
  try {
    const data: Work[] = await worksApi.getAllWorks();
    return {
      props: { data },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error("Error fetching works:", error);
    return { props: { data: [] }, revalidate: 60 };
  }
};
