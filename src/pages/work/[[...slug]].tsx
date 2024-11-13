import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Work } from "@/sanity/types";
import { useRouter } from "next/router";
import { MediaRenderer } from "@/components/media-renderer";
import { getWorkFirstMedia } from "@/sanity/lib/media";
import ProjectSelector from "@/components/project/selector";
import ProjectPreview from "@/components/project/preview";
import ProjectCaseStudy from "@/components/project/case-study";
import { worksApi } from "@/sanity/lib/work";
import { Cross1Icon, Cross2Icon } from "@radix-ui/react-icons";
import { GetStaticPaths, GetStaticProps } from "next";
import { cn } from "@/lib/utils";

export default function WorkPage({ data }: { data: Work[] }) {
  const router = useRouter();
  const { slug } = router.query;
  const [clientSlug, projectSlug] = Array.isArray(slug)
    ? slug
    : [slug, undefined];

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.map((client) => {
          const mediaAsset = getWorkFirstMedia(client);
          if (!client.slug) return null;

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
                  layoutId={`image-${client.slug.current}`}
                  className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-2xl bg-white"
                >
                  <MediaRenderer
                    media={mediaAsset}
                    className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                  />
                </motion.div>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/30 backdrop-blur-sm" />
                <Dialog.Content
                  className={cn(
                    "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                    "bg-white focus:outline-none",
                    "data-[state=open]:animate-contentShow",
                    "shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]",
                    "w-[90vw] rounded-[40px] p-8",
                    // Adjust max-width and height constraints
                    client.projects && client.projects.length > 1
                      ? "max-w-[800px]"
                      : client.projects?.[0]._type === "preview"
                        ? "max-h-[90vh] max-w-[1016px] overflow-y-auto" // Add max-height and scroll
                        : "min-h-screen max-w-none",
                  )}
                >
                  <div className="w-full">
                    {client.projects && client.projects.length > 1 ? (
                      <ProjectSelector data={client} />
                    ) : client.projects?.[0]._type === "preview" ? (
                      <ProjectPreview data={client} />
                    ) : (
                      <ProjectCaseStudy data={client} />
                    )}
                  </div>

                  <Dialog.Close className="absolute right-6 top-6 inline-flex size-[35px] appearance-none items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 focus:shadow-[0_0_0_2px] focus:shadow-gray-400 focus:outline-none">
                    <Cross2Icon className="h-6 w-6" />
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          );
        })}
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const works: Work[] = await worksApi.getAllWorks();

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

export const getStaticProps: GetStaticProps = async () => {
  try {
    const data: Work[] = await worksApi.getAllWorks();
    return {
      props: { data },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching works:", error);
    return { props: { data: [] }, revalidate: 60 };
  }
};
