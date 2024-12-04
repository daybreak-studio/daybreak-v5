import { motion } from "framer-motion";
import { MediaRenderer } from "@/components/media-renderer";
import type { MediaItem } from "@/sanity/lib/media";

interface MediaWidgetProps {
  media?: MediaItem;
}

export default function MediaWidget({ media }: MediaWidgetProps) {
  if (!media) return null;

  return (
    <motion.div className="relative h-full w-full">
      <MediaRenderer
        className="frame-inner"
        media={media}
        priority
        fill
        autoPlay={true}
      />
    </motion.div>
  );
}
