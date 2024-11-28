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
    amount: "some",
    margin: "-45% 0px -45% 0px",
  });

  useEffect(() => {
    if (isInView) {
      onScroll(index);
    }
  }, [isInView, index, onScroll]);

  return (
    <>
      {/* Debug visualization of the detection zone */}
      <div
        className="pointer-events-none fixed left-0 right-0 z-50"
        style={{
          top: "45%",
          height: "10%", // 100% - (45% * 2) = 10% detection zone
          background: "rgba(0, 0, 255, 0.1)",
          border: "1px dashed blue",
        }}
      >
        <div className="absolute left-2 top-0 text-xs text-blue-500">
          Detection Zone
        </div>
      </div>

      <motion.div
        ref={ref}
        id={id}
        initial={false}
        animate={{
          opacity: isZoomed ? (isActive ? 1 : 0.2) : 1,
          scale: isZoomed ? (isActive ? 0.95 : 0.85) : 1,
          border: isActive ? "4px solid blue" : "4px solid transparent",
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
          isInView && "relative",
        )}
        onClick={onActivate}
      >
        {isActive && (
          <div className="absolute -top-8 left-0 z-50 bg-blue-500 px-2 py-1 text-xs text-white">
            Active Group {index}
          </div>
        )}
        {isInView && (
          <div className="absolute -top-8 left-0 z-50 bg-blue-500 px-2 py-1 text-xs text-white">
            In View: Group {index}
          </div>
        )}
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
    </>
  );
}
