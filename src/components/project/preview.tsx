import { motion } from "framer-motion";
import { Preview, Clients } from "@/sanity/types";
import { MediaRenderer } from "@/components/media-renderer";
import { getProjectFirstMedia, getMediaAssetId } from "@/sanity/lib/media";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { IMAGE_ANIMATION } from "./animations";
import { EASINGS } from "../animations/easings";

interface ProjectPreviewProps {
  data: Clients;
}

export default function ProjectPreview({ data }: ProjectPreviewProps) {
  const project = data.projects?.find((p) => {
    return p._type === "preview";
  }) as Preview;

  if (!project) {
    return null;
  }

  const mediaAsset = getProjectFirstMedia(project);
  const assetId = getMediaAssetId(mediaAsset);

  return (
    <div className="flex flex-col p-8 md:flex-row md:space-x-8">
      <motion.div
        className="order-2 pt-4 md:order-1 md:w-2/3 md:pt-0"
        {...IMAGE_ANIMATION}
        layout
        layoutId={assetId || undefined}
      >
        <MediaRenderer
          className="frame-inner"
          media={mediaAsset}
          autoPlay={true}
        />
      </motion.div>
      <motion.div className="order-1 flex flex-col justify-between md:order-2 md:w-1/3">
        <motion.div
          initial={{ filter: "blur(10px)" }}
          animate={{ filter: "blur(0px)" }}
          transition={{ duration: 0.4, ease: EASINGS.easeOutQuart }}
          className="hidden items-center space-x-2 md:flex"
        >
          <ChevronLeft className="h-4 w-4 text-stone-500" />
          {project.media?.map((media) => {
            return (
              <div key={media._key}>
                <MediaRenderer media={media} className="h-5 w-5 rounded-md" />
              </div>
            );
          })}
          <ChevronRight className="h-4 w-4 text-stone-300" />
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
              },
            },
          }}
          transition={{ duration: 0.4, ease: EASINGS.easeOutQuart }}
          className="flex flex-col space-y-2 self-end md:space-y-4"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
              visible: {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: { duration: 1, ease: EASINGS.easeOutQuart },
              },
            }}
            className="text-2xl"
          >
            {project.heading}
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
              visible: {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: { duration: 1, ease: EASINGS.easeOutQuart },
              },
            }}
            className="pb-2 text-xs text-stone-500 md:text-base"
          >
            {project.caption}
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
              visible: {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: { duration: 1, ease: EASINGS.easeOutQuart },
              },
            }}
            className="flex items-center justify-between rounded-2xl bg-stone-100 p-4"
          >
            <p className="text-xs text-stone-600">{project.link}</p>
            <ArrowUpRight className="h-4 w-4 text-stone-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
