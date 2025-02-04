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
    <div className="space-y-4">
      <motion.div
        transition={{
          duration: 1.2,
          ease: EASINGS.easeOutExpo,
        }}
        className="flex w-full items-center justify-center p-4 text-center"
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <h2 className="text-center text-3xl text-neutral-600">{data.name}</h2>
          <h2 className="text-center text-neutral-400">{data.description}</h2>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {data.projects?.map((project, index) => {
          const mediaAsset = getProjectFirstMedia(project);
          if (!project.category) return null;

          return (
            <motion.div
              whileHover={{
                scale: 0.99,
              }}
              key={project._key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: EASINGS.easeOutQuart,
                delay: 0.1 + index * 0.1,
              }}
              onClick={() => {
                router.push(
                  `/work/${data.slug?.current}/${project.category}`,
                  undefined,
                  { shallow: true },
                );
              }}
              className="cursor-pointer"
            >
              <div className="frame-inner flex items-center justify-center border border-neutral-400/10 bg-neutral-400/5 p-2 md:flex-col md:items-start md:p-1">
                <motion.div
                  {...IMAGE_ANIMATION}
                  layoutId={getMediaAssetId(mediaAsset) || undefined}
                  className="frame-inner relative aspect-square w-20 overflow-hidden md:w-full"
                >
                  <MediaRenderer
                    fill
                    media={mediaAsset}
                    autoPlay={false}
                    thumbnailTime={1}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
                <div className="flex w-full p-2 pl-4 md:flex-col md:p-4">
                  <div className="flex w-full items-center justify-between md:justify-start md:space-x-1 md:pb-2">
                    <h3 className="text-md capitalize text-neutral-500 md:text-xl md:font-medium">
                      {project.category}
                    </h3>
                    <ChevronRight className="h-4 w-4 text-neutral-500 md:h-5 md:w-5 md:pt-[3px]" />
                  </div>
                  <h4 className="hidden text-sm text-neutral-400 md:block">
                    {project.caption}
                  </h4>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
