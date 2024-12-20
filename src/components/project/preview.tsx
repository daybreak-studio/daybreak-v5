import { motion } from "framer-motion";
import { Preview, Clients } from "@/sanity/types";
import { MediaRenderer } from "@/components/media-renderer";
import { getProjectFirstMedia } from "@/sanity/lib/media";

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

  const mediaAsset = getProjectFirstMedia(project);

  return (
    <div className="w-full p-4">
      <div className="pb-4">
        <h2 className="pb-4 text-3xl">{project.heading}</h2>
        <p className="text-stone-500">{project.caption}</p>
      </div>
      <motion.div
        layout
        layoutId={imageLayoutId}
        className="origin center aspect-square h-full w-full"
      >
        <MediaRenderer media={mediaAsset} autoPlay={true} />
      </motion.div>
    </div>
  );
}
