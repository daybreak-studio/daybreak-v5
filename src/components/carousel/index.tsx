// src/components/carousel/index.tsx
"use client";

import { memo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { MediaRenderer } from "@/components/media-renderer";
import { MediaItem } from "@/sanity/lib/media";
import { useRef } from "react";
import { HoverCard } from "../hover-card";
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
  const [emblaRef, embla] = useEmblaCarousel(
    { align: "start", loop: false, skipSnaps: true },
    [WheelGesturesPlugin()],
  );

  return (
    <div className={`relative col-span-full ${className} xl:py-16`}>
      <div
        className="hide-scrollbar cursor-ew-resize overflow-x-scroll"
        ref={emblaRef}
      >
        <div className="mx-8 flex items-start gap-4 md:mx-16 xl:mx-36 xl:gap-8">
          {media.map((item) => {
            const widthClass =
              sizeOptions[item.width as CarouselWidth] || "md:w-full";

            return (
              <div
                key={item._key}
                className={`my-8 h-[400px] min-w-[85%] lg:h-[500px] lg:min-w-0 lg:max-w-[600px] lg:flex-shrink-0 ${widthClass}`}
              >
                <HoverCard>
                  <MediaRenderer
                    className="frame-inner"
                    fill
                    media={item}
                    autoPlay={true}
                  />
                </HoverCard>
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
