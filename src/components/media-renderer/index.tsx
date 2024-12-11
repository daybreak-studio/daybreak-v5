import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor, getMuxThumbnailUrl } from "@/sanity/lib/image";
import { useLowPowerMode } from "@/hooks/useLowPowerMode";
import { MediaItem, VideoItem } from "@/sanity/lib/media";
import { cn } from "@/lib/utils";

interface MediaRendererProps {
  media: MediaItem | null;
  layout?: boolean | "position" | "size" | "preserve-aspect";
  layoutId?: string;
  className?: string;
  autoPlay?: boolean;
  priority?: boolean;
  fill?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const isMuxVideo = (media: MediaItem): media is VideoItem => {
  return media._type === "videoItem" && media.source?._type === "mux.video";
};

export function MediaRenderer({
  media,
  layout,
  layoutId,
  className = "",
  autoPlay = false,
  priority = false,
  fill = false,
  onLoad,
  onError,
}: MediaRendererProps) {
  const [videoError, setVideoError] = useState(false);
  const isLowPowerMode = useLowPowerMode();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoad = useCallback(() => {
    onLoad?.();
  }, [onLoad]);

  if (!media?.source?.asset) return null;

  const { dimensions } = media.source.asset.metadata || {};
  const imageProps = {
    quality: 95,
    priority,
    className: cn("object-cover", className),
    onLoad: handleLoad,
    alt: media.alt || "",
    sizes:
      "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, (max-width: 1536px) 60vw, 2400px",
  };

  return (
    <motion.div
      layout={layout}
      layoutId={layoutId}
      className={fill ? "relative h-full w-full will-change-transform" : ""}
    >
      {isMuxVideo(media) && !isLowPowerMode && !videoError ? (
        <video
          ref={videoRef}
          className={cn("h-full w-full object-cover", className)}
          autoPlay={autoPlay && !isLowPowerMode}
          muted
          playsInline
          loop
          poster={getMuxThumbnailUrl(media)}
          onError={() => {
            setVideoError(true);
            onError?.();
          }}
          onLoadedMetadata={handleLoad}
          preload={priority ? "auto" : "metadata"}
        >
          <source
            src={`https://stream.mux.com/${media.source.asset.playbackId}/high.mp4`}
            type="video/mp4"
          />
        </video>
      ) : (
        <Image
          src={
            isMuxVideo(media) ? getMuxThumbnailUrl(media) : urlFor(media.source)
          }
          {...imageProps}
          {...(fill
            ? { fill: true }
            : {
                width: dimensions?.width || 1920,
                height: dimensions?.height || 1080,
              })}
          {...(media.source.asset.metadata?.lqip
            ? {
                placeholder: "blur",
                blurDataURL: media.source.asset.metadata.lqip,
              }
            : {})}
        />
      )}
    </motion.div>
  );
}
