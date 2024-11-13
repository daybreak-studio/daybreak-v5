import { motion } from "framer-motion";
import { Preview, Work } from "@/sanity/types";
import { MediaRenderer } from "@/components/media-renderer";
import { getProjectFirstMedia } from "@/sanity/lib/media";

interface ProjectPreviewProps {
  data: Work;
  imageLayoutId: string;
}

export default function ProjectPreview({
  data,
  imageLayoutId,
}: ProjectPreviewProps) {
  const project = data.projects?.[0] as Preview;
  if (!project) return null;

  const mediaAsset = getProjectFirstMedia(project);

  return (
    <div className="w-full p-4">
      <div className="pb-4">
        <h2 className="pb-4 text-3xl">{project.heading}</h2>
        <p className="text-zinc-500">{project.caption}</p>
      </div>
      <motion.div layoutId={imageLayoutId} className="w-full">
        <MediaRenderer media={mediaAsset} className="w-full rounded-3xl" />
      </motion.div>
    </div>
  );
}
