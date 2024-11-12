import { MediaRenderer } from "@/components/media-renderer";
import * as Modal from "@/components/modal";
import { getProjectFirstMedia } from "@/sanity/lib/media";
import { Preview, Work } from "@/sanity/types";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function ProjectPreview({ data }: { data: Work }) {
  const router = useRouter();
  const project = data.projects?.[0] as Preview;
  const mediaAsset = getProjectFirstMedia(project);

  // Generate layoutId based on whether we're coming from works grid or selector
  const layoutId = router.query.project
    ? `image-${data.slug?.current}-${router.query.project}`
    : `image-${data.slug?.current}`;

  return (
    <div className="relative space-y-6">
      {/* Media Section */}
      <Modal.Item id={layoutId} className="overflow-hidden rounded-2xl">
        <MediaRenderer media={mediaAsset} className="h-full w-full" />
      </Modal.Item>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {/* Header */}
        <div>
          <h2 className="text-2xl font-medium">{project.heading}</h2>
          <p className="text-gray-500">{project.category}</p>
        </div>

        {/* Description */}
        {project.caption && (
          <div className="prose max-w-none">
            <p>{project.caption}</p>
          </div>
        )}

        {/* Additional Media */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {project.media?.slice(1).map((media, index) => (
            <div key={media._key} className="overflow-hidden rounded-lg">
              <MediaRenderer media={media} className="h-full w-full" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
