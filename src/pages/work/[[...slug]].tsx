import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Work } from "@/sanity/types";
import { useRouter } from "next/router";
import { MediaRenderer } from "@/components/media-renderer";
import { getWorkFirstMedia } from "@/sanity/lib/media";
import ProjectSelector from "@/components/project/selector";
import ProjectPreview from "@/components/project/preview";
import ProjectCaseStudy from "@/components/project/case-study";
import { Cross2Icon } from "@radix-ui/react-icons";
import { GetStaticPaths, GetStaticProps } from "next";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { WORKS_QUERY } from "@/sanity/lib/queries";

// Define modal variants
const MODAL_VARIANTS = {
  selector: {
    className: "max-w-[800px]",
    type: "selector",
  },
  preview: {
    className: "max-h-[90vh] max-w-[1016px] overflow-y-auto",
    type: "preview",
  },
  caseStudy: {
    className: "h-screen w-screen max-w-none overflow-y-auto rounded-none",
    type: "caseStudy",
  },
} as const;

// Helper function to determine modal variant
const getModalVariant = (client: Work, projectSlug: string | undefined) => {
  // If the client has multiple projects and no project slug, show the selector
  if (client.projects && client.projects.length > 1 && !projectSlug) {
    return MODAL_VARIANTS.selector;
  }

  // Find the current project based on the slug or use the first one
  const currentProject = projectSlug
    ? client.projects?.find((project) => project.category === projectSlug)
    : client.projects?.[0];

  const variant =
    currentProject?._type === "preview"
      ? MODAL_VARIANTS.preview
      : MODAL_VARIANTS.caseStudy;

  return variant;
};

export default function WorkPage({ data }: { data: Work[] }) {
  const router = useRouter();
  const { slug } = router.query;
  const [clientSlug, projectSlug] = Array.isArray(slug)
    ? slug
    : [slug, undefined];

  // Add state to track the active thumbnail during animation
  const [activeThumbId, setActiveThumbId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

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
    <div className="mx-auto p-8">
      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.map((client) => {
          const mediaAsset = getWorkFirstMedia(client);
          if (!client.slug) return null;

          const layoutId = `container-${client.slug.current}`;
          const imageLayoutId = `image-${client.slug.current}`;
          const hasMultipleProjects =
            client.projects && client.projects.length > 1;

          const modalVariant = getModalVariant(client, projectSlug);

          return (
            <Dialog.Root
              key={client._id}
              open={clientSlug === client.slug.current}
              onOpenChange={(open) => {
                // Set the active thumbnail ID when dialog state changes
                setActiveThumbId(client.slug?.current || null);
                router.push(
                  open ? `/work/${client.slug?.current}` : "/work",
                  undefined,
                  { shallow: true },
                );
              }}
            >
              <Dialog.Trigger asChild>
                <motion.div
                  layout
                  layoutId={layoutId}
                  className={cn(
                    "group relative aspect-square w-full origin-center cursor-pointer overflow-hidden rounded-2xl bg-white",
                    isAnimating &&
                      activeThumbId === client.slug?.current &&
                      "z-40",
                  )}
                  onLayoutAnimationStart={() => setIsAnimating(true)}
                  onLayoutAnimationComplete={() => {
                    setIsAnimating(false);
                    setActiveThumbId(null);
                  }}
                >
                  <motion.div
                    layout="preserve-aspect"
                    layoutId={imageLayoutId}
                    className={cn(
                      "aspect-square h-full w-full origin-center object-cover",
                      isAnimating &&
                        activeThumbId === client.slug?.current &&
                        "relative z-50",
                    )}
                  >
                    <MediaRenderer
                      media={mediaAsset}
                      autoPlay={false}
                      className="duration-300 group-hover:scale-105"
                    />
                  </motion.div>
                </motion.div>
              </Dialog.Trigger>

              <AnimatePresence>
                {clientSlug === client.slug?.current && (
                  <Dialog.Portal forceMount>
                    <Dialog.Overlay asChild>
                      <motion.div
                        className="fixed inset-0 z-30 bg-white/50 backdrop-blur-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    </Dialog.Overlay>
                    <Dialog.Content asChild>
                      <motion.div
                        className="hide-scrollbar fixed left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Dialog.Title className="sr-only">
                          {client.name} Project Details
                        </Dialog.Title>
                        <Dialog.Description className="sr-only">
                          View details about the {client.name} project.
                        </Dialog.Description>

                        <motion.div
                          layout
                          layoutId={layoutId}
                          className={cn(
                            "w-[90vw] origin-center rounded-3xl bg-white p-8",
                            "shadow-2xl",
                            modalVariant.className,
                          )}
                        >
                          {modalVariant.type === "selector" && (
                            <ProjectSelector
                              data={client}
                              imageLayoutId={imageLayoutId}
                            />
                          )}
                          {modalVariant.type === "preview" && (
                            <ProjectPreview
                              data={client}
                              imageLayoutId={imageLayoutId}
                            />
                          )}
                          {modalVariant.type === "caseStudy" && (
                            <ProjectCaseStudy
                              data={client}
                              imageLayoutId={imageLayoutId}
                            />
                          )}

                          <Dialog.Close className="absolute right-6 top-6 inline-flex size-12 appearance-none items-center justify-center rounded-xl bg-white text-gray-600 shadow-md hover:bg-zinc-100 focus:shadow-gray-400 focus:outline-none">
                            <Cross2Icon className="h-6 w-6" />
                          </Dialog.Close>
                        </motion.div>
                      </motion.div>
                    </Dialog.Content>
                  </Dialog.Portal>
                )}
              </AnimatePresence>
            </Dialog.Root>
          );
        })}
      </div>
    </div>
  );
}

// Update getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const works: Work[] = await client.fetch(WORKS_QUERY);

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

// Update getStaticProps
export const getStaticProps: GetStaticProps = async () => {
  try {
    const data: Work[] = await client.fetch(WORKS_QUERY);
    return {
      props: { data },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error("Error fetching works:", error);
    return { props: { data: [] }, revalidate: 60 };
  }
};
