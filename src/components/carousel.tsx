// src/components/carousel/index.tsx
"use client";

import { memo, useEffect, useRef } from "react";
import { MediaRenderer } from "@/components/media-renderer";
import { MediaItem } from "@/sanity/lib/media";
import { HoverCard } from "@/components/animations/hover";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

interface CarouselProps {
  media: MediaItem[];
  className?: string;
}

const CarouselComponent = memo(({ media, className }: CarouselProps) => {
  return (
    <div className={`relative col-span-full ${className} xl:py-16`}>
      <div className="mx-8 md:mx-16 xl:mx-36">
        <Swiper
          modules={[FreeMode, Mousewheel]}
          spaceBetween={32}
          slidesPerView="auto"
          freeMode={{
            enabled: true,
            sticky: false,
            momentumBounce: true,
            momentumBounceRatio: 0.25,
          }}
          mousewheel={{
            enabled: true,
            forceToAxis: true,
            sensitivity: 0.5,
          }}
          className="!overflow-visible"
        >
          {media.map((item) => {
            return (
              <SwiperSlide
                key={item._key}
                className="!h-[400px] !w-[85%] hover:cursor-grab active:cursor-grabbing lg:!h-[600px] lg:!w-[600px]"
              >
                <HoverCard>
                  <MediaRenderer
                    className="frame-inner"
                    fill
                    media={item}
                    autoPlay={true}
                  />
                </HoverCard>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
});

export default CarouselComponent;

CarouselComponent.displayName = "CarouselComponent";
