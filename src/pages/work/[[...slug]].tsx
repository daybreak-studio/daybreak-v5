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
import { useCallback, useEffect, Suspense, useRef } from "react";
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
import { VIDEO_EVENTS } from "@/components/media-renderer";
import WorksGrid from "@/components/works-grid";
import Image from "next/image";
import Footer from "@/components/footer";
import Lenis from "lenis";

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
      "h-[100dvh] w-screen max-w-none overflow-y-auto rounded-none bg-white",
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

// Add this helper function at the top of the file
const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Update this helper function to return hidden for case studies
const shouldShowCloseButton = (modalType: string) => {
  if (modalType === "caseStudy") {
    return "hidden"; // Hide for case studies
  }
  return "inline-flex"; // Show for all other modal types
};

export default function WorkPage({ data }: { data: Clients[] }) {
  const router = useRouter();
  const { slug } = router.query;
  const [clientSlug, projectSlug] = Array.isArray(slug)
    ? slug
    : [slug, undefined];

  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis
  useEffect(() => {
    lenisRef.current = new Lenis();
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  // Handle modal open/close
  const handleOpenChange = useCallback(
    (open: boolean, client: Clients) => {
      if (!open) {
        window.dispatchEvent(new Event(VIDEO_EVENTS.RESUME_ALL));
        document.body.style.overflow = "";
        lenisRef.current?.start();
      } else {
        window.dispatchEvent(new Event(VIDEO_EVENTS.PAUSE_ALL));
        // Only lock scrolling for preview and selector modals
        const currentProject = projectSlug
          ? client.projects?.find((project) => project.category === projectSlug)
          : client.projects?.[0];

        const isCaseStudy = currentProject?._type !== "preview";

        if (!isCaseStudy) {
          document.body.style.overflow = "hidden";
          lenisRef.current?.stop();
        }
      }
    },
    [projectSlug],
  );

  return (
    <main className="relative flex flex-col items-center justify-center space-y-48 p-4 pt-48 lg:space-y-52">
      <section className="flex h-full w-full flex-col items-center justify-center space-y-1">
        <motion.h1
          initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: 0.3,
            duration: 1,
            ease: EASINGS.easeOutQuart,
          }}
          className="w-8/12 text-center text-3xl font-[450] text-neutral-700/25 lg:text-3xl 2xl:text-4xl"
        >
          Design that feels right.
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: 0.4,
            duration: 1,
            ease: EASINGS.easeOutQuart,
          }}
          className="w-8/12 text-center text-3xl font-[450] text-neutral-700/25 lg:text-3xl 2xl:text-4xl"
        >
          Tech that works well.
        </motion.h1>

        <WorksGrid data={data}>
          {(client, index) => {
            const mediaAsset = getClientFirstMedia(client);
            const assetId = getMediaAssetId(mediaAsset);
            if (!client.slug) return null;

            const containerLayoutId = `${client.slug.current}`;
            const modalVariant = getModalVariant(client, projectSlug);
            const isOpen =
              Boolean(clientSlug) && clientSlug === client.slug.current;

            return (
              <Dialog.Root
                key={client._id}
                open={isOpen}
                onOpenChange={(open) => {
                  if (!open) {
                    // If we're in a preview/case-study and have a selector (multiple projects)
                    if (
                      projectSlug &&
                      client.projects &&
                      client.projects.length > 1
                    ) {
                      // Go back to selector
                      router.push(`/work/${clientSlug}`, undefined, {
                        shallow: true,
                      });
                    } else {
                      // Otherwise close the entire modal (we're either at selector level or single project)
                      router.push("/work", undefined, { shallow: true });
                    }
                    handleOpenChange(open, client);
                  } else {
                    if (!router.query.slug?.[0]) {
                      router.push(`/work/${client.slug?.current}`, undefined, {
                        shallow: true,
                      });
                    }
                    handleOpenChange(open, client);
                  }
                }}
                modal={modalVariant.type !== "caseStudy"}
              >
                <Dialog.Title className="sr-only">
                  {client.name} Project Details
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  View details about the {client.name} project.
                </Dialog.Description>
                <Dialog.Trigger asChild>
                  <motion.div
                    {...CONTAINER_ANIMATION}
                    layoutId={containerLayoutId}
                    className="relative aspect-square w-full origin-center cursor-pointer"
                  >
                    <HoverCard>
                      <motion.div
                        {...IMAGE_ANIMATION}
                        layoutId={assetId || ""}
                        className="frame-inner relative h-full w-full overflow-hidden"
                      >
                        <MediaRenderer
                          fill
                          media={mediaAsset}
                          autoPlay={true}
                          priority={true}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="absolute bottom-6 left-6 hidden items-center gap-3 lg:flex"
                      >
                        <Suspense fallback={<div>Loading...</div>}>
                          <div className="relative aspect-square size-10 overflow-hidden rounded-lg bg-neutral-100/25">
                            <Image
                              className=""
                              src={urlFor(client.logo)}
                              alt={client.name || ""}
                              fill
                            />
                          </div>
                          <div className="flex flex-col">
                            <h2 className="text-shadow text-xs font-medium text-neutral-50/90 [text-shadow:_0_1px_0_rgb(0_0_0_/30%)]">
                              {client.name}
                            </h2>
                            {client.projects && (
                              <h2 className="text-xs font-medium text-neutral-50/75 [text-shadow:_0_1px_0_rgb(0_0_0_/20%)]">
                                {client.projects
                                  .map((project) =>
                                    capitalizeFirstLetter(
                                      project.category || "",
                                    ),
                                  )
                                  .join(", ")}
                              </h2>
                            )}
                          </div>
                        </Suspense>
                      </motion.div>
                    </HoverCard>
                  </motion.div>
                </Dialog.Trigger>

                <AnimatePresence
                  mode="popLayout"
                  onExitComplete={() => {
                    document.body.style.overflow = "";
                  }}
                >
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
                          }}
                          className="fixed inset-0 z-[60] bg-white/70 backdrop-blur-3xl"
                        />
                      </Dialog.Overlay>

                      <Dialog.Content asChild forceMount>
                        <motion.div
                          {...CONTAINER_ANIMATION}
                          layoutId={containerLayoutId}
                          className={cn(
                            "fixed bottom-0 left-0 right-0 top-0 z-[70] m-auto h-fit w-fit",
                            "frame-outer origin-center border-[1px] border-neutral-200/50 bg-white",
                            modalVariant.className,
                            modalVariant.type === "caseStudy"
                              ? "overflow-hidden"
                              : "overflow-y-auto",
                          )}
                        >
                          {modalVariant.type === "selector" && (
                            <ProjectSelector data={client} />
                          )}
                          {modalVariant.type === "preview" && (
                            <ProjectPreview data={client} />
                          )}
                          {modalVariant.type === "caseStudy" && (
                            <div className="h-full w-full overflow-hidden">
                              <ProjectCaseStudy data={client} />
                            </div>
                          )}

                          {/* Single Dialog.Close component for all modal types */}
                          <Dialog.Close asChild>
                            <motion.button
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenChange(false, client);
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
                              className={cn(
                                "frame-inner absolute right-6 top-6 size-10 cursor-pointer appearance-none items-center justify-center border-2 border-neutral-600/5 bg-white/50 text-neutral-500 backdrop-blur-lg transition-colors duration-300 focus:outline-none",
                                shouldShowCloseButton(modalVariant.type),
                              )}
                            >
                              <Cross2Icon className="h-4 w-4" />
                            </motion.button>
                          </Dialog.Close>
                        </motion.div>
                      </Dialog.Content>
                    </Dialog.Portal>
                  )}
                </AnimatePresence>
              </Dialog.Root>
            );
          }}
        </WorksGrid>
      </section>
      <Footer />
    </main>
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
