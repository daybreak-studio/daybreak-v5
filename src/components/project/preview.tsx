import { motion } from "framer-motion";
import { Preview, Clients } from "@/sanity/types";
import { MediaRenderer } from "@/components/media-renderer";
import { getProjectFirstMedia } from "@/sanity/lib/media";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectPreviewProps {
  data: Clients;
  imageLayoutId: string;
}

export default function ProjectPreview({
  data,
  imageLayoutId,
}: ProjectPreviewProps) {
  const project = data.projects?.find((p) => {
    return p._type === "preview";
  }) as Preview;

  if (!project) {
    return null;
  }
  console.log(project);

  const mediaAsset = getProjectFirstMedia(project);

  return (
    <div className="flex flex-col p-8 md:flex-row md:space-x-8">
      <motion.div
        className="order-2 w-2/3 pt-4 md:order-1 md:pt-0"
        layout
        layoutId={imageLayoutId}
      >
        <MediaRenderer
          className="frame-inner"
          media={mediaAsset}
          autoPlay={true}
        />
      </motion.div>
      <div className="order-1 flex w-1/3 flex-col justify-between md:order-2">
        <div className="hidden items-center space-x-2 md:flex">
          <ChevronLeft className="h-4 w-4 text-stone-500" />
          {project.media?.map((media) => {
            return (
              <div key={media._key}>
                <MediaRenderer media={media} className="h-5 w-5 rounded-md" />
              </div>
            );
          })}
          <ChevronRight className="h-4 w-4 text-stone-300" />
        </div>
        <div className="flex flex-col space-y-2 self-end md:space-y-4">
          <h2 className="text-2xl">{project.heading}</h2>
          <p className="pb-2 text-xs text-stone-500 md:text-base">
            {project.caption}
          </p>
          <div className="flex items-center justify-between rounded-2xl bg-stone-100 p-4">
            <p className="text-xs text-stone-600">{project.link}</p>
            <ArrowUpRight className="h-4 w-4 text-stone-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
