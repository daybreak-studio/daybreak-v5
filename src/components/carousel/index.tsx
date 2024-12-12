// src/components/carousel/index.tsx
"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { MediaRenderer } from "@/components/media-renderer";
import { MediaItem } from "@/sanity/lib/media";
type CarouselWidth = "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "1/1";

const sizeOptions: Record<CarouselWidth, string> = {
  "1/4": "md:w-[25vw]",
  "1/3": "md:w-[33vw]",
  "1/2": "md:w-[50vw]",
  "2/3": "md:w-[66vw]",
  "3/4": "md:w-[75vw]",
  "1/1": "md:w-[100vw]",
};

interface CarouselProps {
  media: MediaItem[];
  className?: string;
}

const CarouselComponent = memo(({ media, className }: CarouselProps) => {
  const [emblaRef] = useEmblaCarousel({ align: "start" });

  return (
    <div className={`relative col-span-full ${className} xl:py-16`}>
      <div
        className="hide-scrollbar cursor-ew-resize overflow-x-scroll"
        ref={emblaRef}
      >
        <div className="flex items-start gap-4 pl-8">
          {media.map((item) => {
            const widthClass =
              sizeOptions[item.width as CarouselWidth] || "md:w-full";

            return (
              <div
                className={`h-[400px] min-w-[85%] snap-center overflow-hidden rounded-xl md:min-w-0 md:max-w-[600px] lg:h-[500px] xl:flex-shrink-0 ${widthClass}`}
                key={item._key}
              >
                <MediaRenderer fill media={item} autoPlay={true} />
                {/* {item.alt && <h5>{item.alt}</h5>} */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default CarouselComponent;

CarouselComponent.displayName = "CarouselComponent";
