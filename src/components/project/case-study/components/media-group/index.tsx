import { motion, useInView } from "framer-motion";
import { MediaRenderer } from "@/components/media-renderer";
import { useEffect, useRef } from "react";
import { AnimationConfig } from "@/components/animations/AnimationConfig";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/sanity/lib/media";

interface MediaGroupProps {
  id: string;
  group: {
    heading?: string;
    caption?: string;
    media?: MediaItem[];
  };
  index: number;
  isActive: boolean;
  isZoomed: boolean;
  onScroll: (index: number) => void;
  onActivate: () => void;
  layoutId?: string;
}

export default function MediaGroup({
  id,
  group,
  index,
  isActive,
  isZoomed,
  onScroll,
  onActivate,
  layoutId,
}: MediaGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: "some",
    margin: "-45% 0px -45% 0px",
  });

  useEffect(() => {
    if (isInView) {
      onScroll(index);
    }
  }, [isInView, index, onScroll]);

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={false}
      animate={{
        opacity: isZoomed ? (isActive ? 1 : 0.2) : 1,
        scale: isZoomed ? (isActive ? 0.95 : 0.85) : 1,
      }}
      whileHover={{
        scale: isZoomed ? (isActive ? 0.95 : 0.88) : 0.99,
        opacity: isZoomed ? (isActive ? 1 : 0.3) : 1,
      }}
      transition={{
        duration: 0.6,
        ease: AnimationConfig.EASE_OUT,
      }}
      className={cn(
        "grid origin-center cursor-pointer gap-4",
        group.media?.length === 1
          ? "grid-cols-1"
          : "grid-cols-1 md:grid-cols-2",
      )}
      onClick={onActivate}
    >
      {group.media?.map((media, mediaIndex) => (
        <MediaRenderer
          className="max-h-[95vh] rounded-xl"
          key={`${index}-${mediaIndex}`}
          media={media}
          autoPlay={true}
          layoutId={index === 0 && mediaIndex === 0 ? layoutId : undefined}
        />
      ))}
    </motion.div>
  );
}
