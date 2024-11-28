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
  console.log("Preview Data:", data); // Log entire data object
  console.log("All Projects:", data.projects); // Log all projects

  // Find the preview project and log the search process
  const project = data.projects?.find((p) => {
    console.log("Project type:", p._type); // Log each project's type
    return p._type === "preview";
  }) as Preview;

  console.log("Found Preview Project:", project); // Log the found project

  if (!project) {
    console.log("No preview project found");
    return null;
  }

  const mediaAsset = getProjectFirstMedia(project);
  console.log("Media Asset:", mediaAsset); // Log the media asset

  return (
    <div className="w-full p-4">
      <div className="pb-4">
        <h2 className="pb-4 text-3xl">{project.heading}</h2>
        <p className="text-zinc-500">{project.caption}</p>
      </div>
      <motion.div
        layout="preserve-aspect"
        layoutId={imageLayoutId}
        className="origin center aspect-square h-full w-full"
      >
        <MediaRenderer media={mediaAsset} autoPlay={true} />
      </motion.div>
    </div>
  );
}
