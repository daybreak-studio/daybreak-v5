import { motion, useInView } from "framer-motion";
import { MediaRenderer } from "@/components/media-renderer";
import { useEffect, useRef } from "react";
import { AnimationConfig } from "@/components/animations/AnimationConfig";
import { cn } from "@/lib/utils";
import { MediaItem } from "@/sanity/lib/media";
import { CaseStudy } from "@/sanity/types";

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
    amount: 0.5,
    margin: "-10% 0px -10% 0px",
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
        opacity: isZoomed
          ? isActive
            ? 1
            : 0.2 // More contrast between active/inactive
          : 1,
        scale: isZoomed
          ? isActive
            ? 0.95
            : 0.85 // Active slightly smaller, inactive even smaller
          : 1,
        y: isZoomed
          ? isActive
            ? 0
            : 20 // Add slight vertical offset for inactive
          : 0,
      }}
      whileHover={{
        scale: isZoomed
          ? isActive
            ? 0.95
            : 0.88 // Subtle hover effect
          : 1.02,
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
        <div
          key={`${index}-${mediaIndex}`}
          className="relative aspect-[16/9] overflow-hidden rounded-xl"
        >
          <MediaRenderer
            media={media}
            autoPlay={true}
            className="absolute inset-0"
            layoutId={index === 0 && mediaIndex === 0 ? layoutId : undefined}
          />
        </div>
      ))}
    </motion.div>
  );
}
