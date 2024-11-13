import { motion } from "framer-motion";
import { Preview, Work } from "@/sanity/types";
import { MediaRenderer } from "@/components/media-renderer";
import { getProjectFirstMedia } from "@/sanity/lib/media";

export default function ProjectPreview({ data }: { data: Work }) {
  const project = data.projects?.[0] as Preview;
  if (!project) return null;

  const mediaAsset = getProjectFirstMedia(project);
  const layoutId = `image-${data.slug?.current}`;

  return (
    <div className="w-full">
      {/* Wrapper to control aspect ratio */}
      <div className="relative w-full">
        <motion.div layoutId={layoutId} className="w-full">
          <MediaRenderer media={mediaAsset} className="w-full rounded-2xl" />
        </motion.div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-medium">{project.heading}</h2>
        <p className="mt-2 text-gray-600">{project.caption}</p>
      </div>
    </div>
  );
}
