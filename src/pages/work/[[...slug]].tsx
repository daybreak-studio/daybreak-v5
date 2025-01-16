import * as Dialog from "@radix-ui/react-dialog";
import { motion, MotionProps, useAnimation } from "framer-motion";
import { Clients } from "@/sanity/types";
import { useRouter } from "next/router";
import { MediaRenderer } from "@/components/media-renderer";
import {
  getClientFirstMedia,
  getMediaAssetId,
  getProjectFirstMedia,
} from "@/sanity/lib/media";
import ProjectSelector from "@/components/project/selector";
import ProjectPreview from "@/components/project/preview";
import ProjectCaseStudy from "@/components/project/case-study";
import { Cross2Icon } from "@radix-ui/react-icons";
import { GetStaticPaths, GetStaticProps } from "next";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { CLIENTS_QUERY } from "@/sanity/lib/queries";
import { EASINGS } from "@/components/animations/easings";
import {
  CONTAINER_ANIMATION,
  IMAGE_ANIMATION,
} from "@/components/project/animations";
import { HoverCard } from "@/components/animations/hover";
import { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";

// Define modal variants
const MODAL_VARIANTS = {
  selector: {
    className: "w-[90vw] max-w-[1200px] p-4",
    type: "selector",
  },
  preview: {
    className:
      "w-[90vw] max-w-[600px] md:max-h-[80svh] md:max-w-[1000px] overflow-hidden",
    type: "preview",
  },
  caseStudy: {
    className:
      "h-[100svh] w-screen max-w-none overflow-y-auto rounded-none bg-white",
    type: "caseStudy",
  },
} as const;

// Helper function to determine modal variant
const getModalVariant = (client: Clients, projectSlug: string | undefined) => {
  // If the client has multiple projects and no project slug, show the selector
  if (client.projects && client.projects.length > 1 && !projectSlug) {
    return MODAL_VARIANTS.selector;
  }

  // Find the current project based on the slug or use the first one
  const currentProject = projectSlug
    ? client.projects?.find((project) => project.category === projectSlug)
    : client.projects?.[0];

  // Determine variant based on project type
  const variant =
    currentProject?._type === "preview"
      ? MODAL_VARIANTS.preview
      : MODAL_VARIANTS.caseStudy;

  return variant;
};

export default function WorkPage({ data }: { data: Clients[] }) {
  const router = useRouter();
  const { slug } = router.query;
  const [clientSlug, projectSlug] = Array.isArray(slug)
    ? slug
    : [slug, undefined];

  // Add state to track the active thumbnail during animation
  const [activeThumbId, setActiveThumbId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isInitialMount, setIsInitialMount] = useState(true);

  // First, let's add a state for controlling grid animation
  const [shouldShowGrid, setShouldShowGrid] = useState(false);

  // Find the current client based on the slug
  const currentClient = data.find(
    (client) => client.slug?.current === clientSlug,
  );

  // Force modal to be mounted when route includes client/project
  const shouldShowModal = Boolean(clientSlug);

  console.log("Route Debug:", {
    fullSlug: slug,
    clientSlug,
    projectSlug,
    currentClient,
    availableProjects: currentClient?.projects,
    modalVariant: currentClient
      ? getModalVariant(currentClient, projectSlug)
      : null,
  });

  // Update the useEffect to handle both cases
  useEffect(() => {
    if (isInitialMount) {
      if (clientSlug) {
        // If we have a clientSlug, delay the modal opening
        const timer = setTimeout(() => {
          setIsInitialMount(false);
        }, 600);
        return () => clearTimeout(timer);
      } else {
        // If we're on the index page, animate in the grid
        const timer = setTimeout(() => {
          setShouldShowGrid(true);
          setIsInitialMount(false);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [clientSlug, isInitialMount]);

  return (
    <div className="mx-auto p-8">
      <div className="relative grid grid-cols-1 gap-8 pt-24 md:grid-cols-2 lg:grid-cols-3">
        {data.map((client) => {
          const mediaAsset = getClientFirstMedia(client);
          const assetId = getMediaAssetId(mediaAsset);
          if (!client.slug) return null;

          const containerLayoutId = `container-${client.slug.current}`;
          const modalVariant = getModalVariant(client, projectSlug);

          const isOpen = shouldShowModal && clientSlug === client.slug.current;

          return (
            <Dialog.Root
              key={client._id}
              open={isOpen && !isInitialMount}
              onOpenChange={(open) => {
                setActiveThumbId(client.slug?.current || null);
                if (!open) {
                  router.push("/work", undefined, { shallow: true });
                } else {
                  router.push(`/work/${client.slug?.current}`, undefined, {
                    shallow: true,
                  });
                }
              }}
            >
              <Dialog.Trigger asChild>
                <motion.div
                  {...CONTAINER_ANIMATION}
                  layoutId={containerLayoutId}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: shouldShowGrid || !isInitialMount ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: EASINGS.easeOutQuart,
                    delay: isInitialMount ? 0.2 : 0,
                  }}
                  className={cn(
                    "relative aspect-square w-full origin-center cursor-pointer overflow-hidden",
                    isAnimating &&
                      activeThumbId === client.slug?.current &&
                      "z-50",
                  )}
                  onLayoutAnimationStart={() => setIsAnimating(true)}
                  onLayoutAnimationComplete={() => {
                    setIsAnimating(false);
                    setActiveThumbId(null);
                  }}
                >
                  <HoverCard>
                    <motion.div
                      {...IMAGE_ANIMATION}
                      layoutId={assetId || undefined}
                      className={cn(
                        "relative aspect-square h-full w-full origin-center object-cover",
                      )}
                    >
                      <MediaRenderer
                        className="frame-inner"
                        fill
                        media={mediaAsset}
                        autoPlay={true}
                      />
                    </motion.div>
                  </HoverCard>
                </motion.div>
              </Dialog.Trigger>

              <AnimatePresence>
                {isOpen && (
                  <Dialog.Portal forceMount>
                    <Dialog.Overlay asChild forceMount>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: EASINGS.easeOutQuart,
                          delay: isInitialMount ? 0.3 : 0,
                        }}
                        className="fixed inset-0 bg-white/70 backdrop-blur-3xl"
                      />
                    </Dialog.Overlay>
                    <Dialog.Content
                      asChild
                      forceMount
                      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: EASINGS.easeOutQuart,
                          delay: isInitialMount ? 0.4 : 0,
                        }}
                        className="z-50 focus:outline-none"
                      >
                        <Dialog.Title className="sr-only">
                          {client.name} Project Details
                        </Dialog.Title>
                        <Dialog.Description className="sr-only">
                          View details about the {client.name} project.
                        </Dialog.Description>

                        <motion.div
                          {...CONTAINER_ANIMATION}
                          layoutId={containerLayoutId}
                          className={cn(
                            "frame-outer origin-center overflow-y-auto border-[1px] border-stone-200/50 bg-white/80 drop-shadow-xl",
                            modalVariant.className,
                          )}
                        >
                          {modalVariant.type === "selector" && (
                            <ProjectSelector data={client} />
                          )}
                          {modalVariant.type === "preview" && (
                            <ProjectPreview data={client} />
                          )}
                          {modalVariant.type === "caseStudy" && (
                            <ProjectCaseStudy data={client} />
                          )}

                          <Dialog.Close asChild>
                            <motion.button
                              onClick={(e) => {
                                e.preventDefault();
                                if (projectSlug) {
                                  router.push(
                                    `/work/${clientSlug}`,
                                    undefined,
                                    {
                                      shallow: true,
                                    },
                                  );
                                } else {
                                  router.push("/work", undefined, {
                                    shallow: true,
                                  });
                                }
                              }}
                              initial={{ scale: 1 }}
                              whileHover={{ scale: 0.95 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{
                                duration: 0.2,
                                ease: EASINGS.easeOutQuart,
                              }}
                              className="frame-inner absolute right-6 top-6 z-30 inline-flex size-12 appearance-none items-center justify-center border-2 border-stone-600/5 bg-white text-stone-500 transition-colors duration-300 hover:bg-stone-50 focus:outline-none"
                            >
                              <Cross2Icon className="h-4 w-4" />
                            </motion.button>
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
    const works: Clients[] = await client.fetch(CLIENTS_QUERY);
    const paths = [];

    // 1. Add base /work path
    paths.push({ params: { slug: [] } });

    // 2. Add paths for each client and their projects
    works.forEach((work) => {
      if (!work.slug?.current) return;

      // Add client-level path
      paths.push({
        params: { slug: [work.slug.current] },
      });

      // Add project category paths if client has multiple projects
      if (work.projects && work.projects.length > 1) {
        work.projects.forEach((project) => {
          if (project.category) {
            paths.push({
              params: {
                slug: [work.slug?.current, project.category],
              },
            });
          }
        });
      }
    });

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return { paths: [], fallback: "blocking" };
  }
};

// Update getStaticProps
export const getStaticProps: GetStaticProps = async () => {
  try {
    const data: Clients[] = await client.fetch(CLIENTS_QUERY);
    return {
      props: { data },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error("Error fetching works:", error);
    return { props: { data: [] }, revalidate: 60 };
  }
};

// Update generateMetadata function
export async function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}): Promise<Metadata> {
  try {
    const data: Clients[] = await client.fetch(CLIENTS_QUERY);
    const [clientSlug, projectSlug] = params.slug || [];

    // Base metadata for /work index
    if (!clientSlug) {
      const firstClient = data[0];
      const firstProject = firstClient?.projects?.[0];
      const mediaAsset = firstProject
        ? getProjectFirstMedia(firstProject)
        : null;
      const ogImage = mediaAsset ? urlFor(mediaAsset.source) : "/og-work.jpg";

      return {
        title: "Our Work | Daybreak Studio",
        description:
          "Explore our portfolio of creative projects and collaborations.",
        openGraph: {
          title: "Our Work | Daybreak Studio",
          description:
            "Explore our portfolio of creative projects and collaborations.",
          type: "website",
          images: [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: "Daybreak Studio Work",
            },
          ],
        },
      };
    }

    // Find current client
    const currentClient = data.find(
      (client) => client.slug?.current === clientSlug,
    );

    if (!currentClient) {
      return generateMetadata({ params: {} }); // Fallback to base metadata
    }

    // Get first project and its media
    const firstProject = currentClient.projects?.[0];
    const mediaAsset = firstProject ? getProjectFirstMedia(firstProject) : null;
    const ogImage = mediaAsset ? urlFor(mediaAsset.source) : undefined;

    // If we have a client but no specific project
    if (!projectSlug) {
      const projectCount = currentClient.projects?.length || 0;
      const description =
        projectCount > 1
          ? `Explore our ${projectCount} projects with ${currentClient.name}`
          : `Discover our work with ${currentClient.name}`;

      return {
        title: `${currentClient.name} | Daybreak Studio`,
        description,
        openGraph: {
          title: `${currentClient.name} | Daybreak Studio`,
          description,
          type: "website",
          images: ogImage
            ? [
                {
                  url: ogImage,
                  width: 1200,
                  height: 630,
                  alt: `${currentClient.name} project by Daybreak Studio`,
                },
              ]
            : undefined,
        },
      };
    }

    // For specific project
    const project = currentClient.projects?.find(
      (p) => p.category === projectSlug,
    );
    if (!project) {
      return generateMetadata({ params: { slug: [clientSlug] } }); // Fallback to client-level metadata
    }

    const projectMedia = getProjectFirstMedia(project);
    const projectOgImage = projectMedia ? urlFor(projectMedia.source) : ogImage;

    const projectTitle =
      project.heading || `${currentClient.name} - ${project.category}`;
    const projectDescription =
      project.caption ||
      `Explore our ${project.category} work with ${currentClient.name}`;

    return {
      title: `${projectTitle} | Daybreak Studio`,
      description: projectDescription,
      openGraph: {
        title: `${projectTitle} | Daybreak Studio`,
        description: projectDescription,
        type: "article",
        images: projectOgImage
          ? [
              {
                url: projectOgImage,
                width: 1200,
                height: 630,
                alt: `${projectTitle} by Daybreak Studio`,
              },
            ]
          : undefined,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Our Work | Daybreak Studio",
      description:
        "Explore our portfolio of creative projects and collaborations.",
    };
  }
}
