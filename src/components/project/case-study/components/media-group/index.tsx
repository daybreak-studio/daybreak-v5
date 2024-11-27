import { motion, useInView } from "framer-motion";
import { MediaRenderer } from "@/components/media-renderer";
import { useEffect, useRef } from "react";
import { AnimationConfig } from "@/components/animations/AnimationConfig";
import { cn } from "@/lib/utils";

interface MediaGroupProps {
  id: string;
  group: {
    media: any[];
    heading?: string;
    caption?: string;
  };
  index: number;
  isActive: boolean;
  isZoomed: boolean;
  isInfoVisible: boolean;
  onScroll: (index: number) => void;
  onActivate: () => void;
}

export default function MediaGroup({
  id,
  group,
  index,
  isActive,
  isZoomed,
  isInfoVisible,
  onScroll,
  onActivate,
}: MediaGroupProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.5,
    once: false,
    margin: "-10% 0px",
  });

  // Only track scroll position
  useEffect(() => {
    if (isInView) {
      onScroll(index);
    }
  }, [isInView, index, onScroll]);

  // Consider a group "active" if it's in view during zoomed mode
  const isActiveInView = isZoomed && isInView;

  return (
    <motion.div
      id={id}
      ref={ref}
      initial={false}
      animate={{
        opacity: isActiveInView ? 1 : isZoomed ? 0.3 : 1,
        scale: isActiveInView ? 1 : isZoomed ? 0.85 : 1,
      }}
      whileHover={
        !isActiveInView
          ? {
              scale: isZoomed ? 0.87 : 1.02,
              opacity: isZoomed ? 0.4 : 1,
            }
          : undefined
      }
      transition={{
        duration: 0.6,
        ease: AnimationConfig.EASE_OUT,
      }}
      className={cn(
        "grid cursor-pointer gap-4",
        group.media?.length === 1
          ? "grid-cols-1"
          : "grid-cols-1 md:grid-cols-2",
      )}
      onClick={() => {
        const element = ref.current as HTMLElement | null;
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        onActivate();
      }}
    >
      {group.media?.map((item, itemIndex) => (
        <div
          key={`${index}-${itemIndex}`}
          className="relative aspect-[16/9] overflow-hidden rounded-xl"
        >
          <MediaRenderer
            media={item}
            autoPlay={isActiveInView}
            className="absolute inset-0"
          />
        </div>
      ))}
    </motion.div>
  );
}
