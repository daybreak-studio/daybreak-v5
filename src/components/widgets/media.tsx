import { motion } from "framer-motion";
import { MediaRenderer } from "@/components/media-renderer";
import type { MediaItem } from "@/sanity/lib/media";

interface MediaWidgetProps {
  media: MediaItem;
}

export default function MediaWidget({ media }: MediaWidgetProps) {
  console.log(media);
  return (
    <motion.div className="relative h-full w-full overflow-hidden">
      <MediaRenderer
        media={media}
        priority
        className="transition-transform duration-700 hover:scale-105"
        autoPlay={true}
      />
    </motion.div>
  );
}
