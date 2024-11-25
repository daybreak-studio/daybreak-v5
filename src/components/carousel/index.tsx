// src/components/carousel/index.tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";
import { MediaRenderer } from "@/components/media-renderer";
import type { MediaItem } from "@/components/media-renderer";

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
  media: Array<
    MediaItem & {
      alt?: string;
      width?: CarouselWidth;
    }
  >;
  className?: string;
}

export default function CarouselComponent({ media, className }: CarouselProps) {
  const [emblaRef] = useEmblaCarousel({ align: "start" });

  return (
    <div className={`relative col-span-full ${className} xl:py-16`}>
      <div
        className="hide-scrollbar cursor-ew-resize overflow-x-scroll"
        ref={emblaRef}
      >
        <div className="mx-6 flex items-start gap-4 md:mx-12 xl:gap-6">
          {media.map((item) => {
            const widthClass =
              sizeOptions[item.width as CarouselWidth] || "md:w-full";

            return (
              <div
                className={`mx-auto min-w-[85%] snap-center xl:min-w-0 xl:max-w-[600px] xl:flex-shrink-0 ${widthClass}`}
                key={item._key}
              >
                <div className="h-[400px] w-full pb-2 md:h-[600px]">
                  {/* Set a fixed height */}
                  <MediaRenderer
                    media={item}
                    autoPlay={item._type === "video"}
                    className="h-full w-full object-cover" // Use object-cover to fill the container
                  />
                </div>
                {item.alt && <h5>{item.alt}</h5>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
