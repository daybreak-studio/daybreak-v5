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

  const handleProjectClick = (e: React.MouseEvent, projectCategory: string) => {
    e.preventDefault();
    e.stopPropagation();

    router.push(`/work/${data.slug?.current}/${projectCategory}`, undefined, {
      shallow: true,
    });
  };

  return (
    <div className="space-y-4 p-4">
      <motion.div
        transition={{
          duration: 0.8,
          ease: EASINGS.easeOutQuart,
        }}
        className="flex w-full items-center justify-center p-4 text-center"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.15,
              },
            },
          }}
          className="flex flex-col items-center justify-center space-y-2"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
              visible: {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: EASINGS.easeOutQuart,
                },
              },
            }}
            className="text-center text-2xl text-neutral-600 md:text-3xl"
          >
            {data.name}
          </motion.h2>
          <motion.h2
            variants={{
              hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
              visible: {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: EASINGS.easeOutQuart,
                },
              },
            }}
            className="text-center text-neutral-400"
          >
            {data.description}
          </motion.h2>
        </motion.div>
      </motion.div>
      <div className="grid grid-cols-1 gap-4 overflow-hidden md:grid-cols-3">
        {data.projects?.map((project, index) => {
          const mediaAsset = getProjectFirstMedia(project);
          if (!project.category) return null;

          return (
            <motion.div
              whileHover={{
                scale: 0.99,
              }}
              key={project._key}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                ease: EASINGS.easeOutQuart,
                delay: 0.2 + index * 0.12,
              }}
              onClick={(e) => handleProjectClick(e, project.category!)}
              className="cursor-pointer overflow-hidden"
            >
              <div className="frame-inner relative z-0 flex items-center justify-center overflow-hidden border border-neutral-400/10 bg-neutral-300/10 p-2 md:flex-col md:items-start md:p-1">
                <motion.div
                  {...IMAGE_ANIMATION}
                  layoutId={getMediaAssetId(mediaAsset) || undefined}
                  className="frame-inner relative z-10 aspect-square w-20 overflow-hidden md:w-full"
                >
                  <MediaRenderer
                    fill
                    media={mediaAsset}
                    autoPlay={false}
                    thumbnailTime={1}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
                <div className="relative z-10 flex w-full p-2 pl-4 md:flex-col md:p-4">
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
