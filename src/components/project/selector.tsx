import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Clients } from "@/sanity/types";
import { useRouter } from "next/router";
import { MediaRenderer } from "@/components/media-renderer";
import { getProjectFirstMedia, getMediaAssetId } from "@/sanity/lib/media";
import { ChevronRight } from "lucide-react";
import { IMAGE_ANIMATION } from "@/components/project/animations";
import { EASINGS } from "@/components/animations/easings";

interface ProjectSelectorProps {
  data: Clients;
}

export default function ProjectSelector({ data }: ProjectSelectorProps) {
  const router = useRouter();

  return (
    <div className="space-y-4 md:space-y-8">
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{
          duration: 1.2,
          ease: EASINGS.easeOutExpo,
        }}
        className="flex w-full items-center justify-center p-4 text-center"
      >
        <h2 className="text-center text-3xl text-stone-600">{data.name}</h2>
      </motion.div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {data.projects?.map((project, index) => {
          const mediaAsset = getProjectFirstMedia(project);
          const assetId = getMediaAssetId(mediaAsset);
          if (!project.category) return null;

          return (
            <motion.div
              key={project._key}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 1,
                ease: EASINGS.easeOutExpo,
                delay: 0.1 + index * 0.1,
              }}
              onClick={() => {
                router.push(
                  `/work/${data.slug?.current}/${project.category}`,
                  undefined,
                  { shallow: true },
                );
              }}
              className="cursor-pointer overflow-hidden"
            >
              <motion.div className="flex items-center justify-center rounded-2xl bg-stone-100 p-2 md:flex-col md:items-start md:p-1">
                <motion.div
                  {...IMAGE_ANIMATION}
                  layoutId={assetId || undefined}
                  className="relative aspect-square w-20 md:w-full"
                >
                  <MediaRenderer
                    fill
                    media={mediaAsset}
                    autoPlay={false}
                    thumbnailTime={1}
                    className="rounded-xl duration-300 group-hover:scale-105"
                  />
                </motion.div>
                <div className="flex w-full p-2 pl-4 md:flex-col md:p-4">
                  <div className="flex w-full items-center justify-between md:justify-start md:space-x-1 md:pb-2">
                    <h3 className="text-md capitalize text-stone-700 md:text-xl md:font-medium">
                      {project.category}
                    </h3>
                    <ChevronRight className="h-4 w-4 text-stone-500 md:h-5 md:w-5 md:pt-[3px]" />
                  </div>
                  <h4 className="hidden text-sm text-stone-500 md:block">
                    {project.caption}
                  </h4>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
