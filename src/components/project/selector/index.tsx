import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Work } from "@/sanity/types";
import { useRouter } from "next/router";
import { MediaRenderer } from "@/components/media-renderer";
import { getProjectFirstMedia } from "@/sanity/lib/media";

export default function ProjectSelector({ data }: { data: Work }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {data.projects?.map((project) => {
        const mediaAsset = getProjectFirstMedia(project);
        if (!project.category) return null;

        const layoutId = `image-${data.slug?.current}-${project.category}`;

        return (
          <Dialog.Root
            key={project._key}
            onOpenChange={(open) => {
              router.push(
                open
                  ? `/work/${data.slug?.current}/${project.category}`
                  : `/work/${data.slug?.current}`,
                undefined,
                { shallow: true },
              );
            }}
          >
            <Dialog.Trigger asChild>
              <motion.div layoutId={layoutId} className="group cursor-pointer">
                <div className="overflow-hidden rounded-2xl">
                  <MediaRenderer
                    media={mediaAsset}
                    className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">{project.heading}</h3>
                  <p className="text-sm text-gray-500">{project.category}</p>
                </div>
              </motion.div>
            </Dialog.Trigger>
          </Dialog.Root>
        );
      })}
    </div>
  );
}
