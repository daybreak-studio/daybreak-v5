import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor, getMuxThumbnailUrl } from "@/sanity/lib/image";
import { useLowPowerMode } from "@/hooks/useLowPowerMode";
import { MediaItem, VideoItem } from "@/sanity/lib/media";
import { cn } from "@/lib/utils";

interface MediaRendererProps {
  media: MediaItem | null;
  layoutId?: string;
  className?: string;
  autoPlay?: boolean;
  priority?: boolean;
  fill?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const isMuxVideo = (media: MediaItem): media is VideoItem => {
  return (
    media._type === "videoItem" &&
    media.source?._type === "mux.video" &&
    "playbackId" in (media.source?.asset || {})
  );
};

export function MediaRenderer({
  media,
  layoutId,
  className = "",
  autoPlay = false,
  priority = false,
  fill = false,
  onLoad,
  onError,
}: MediaRendererProps) {
  if (!media || !media.source?.asset) {
    return null;
  }

  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isLowPowerMode = useLowPowerMode();
  const videoRef = useRef<HTMLVideoElement>(null);

  const dimensions = media.source?.asset?.metadata?.dimensions;
  const lqip = media.source?.asset?.metadata?.lqip;

  const handleLoadSuccess = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
    onError?.();
  }, [onError]);

  const shouldShowThumbnail = isLowPowerMode || videoError;

  const renderImage = () => {
    if (fill) {
      return (
        <Image
          src={urlFor(media.source)}
          alt={media.alt || ""}
          className={cn("object-cover", className)}
          fill
          quality={95}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, (max-width: 1536px) 60vw, 2400px"
          onLoad={handleLoadSuccess}
          {...(lqip ? { placeholder: "blur", blurDataURL: lqip } : {})}
        />
      );
    }

    if (dimensions) {
      return (
        <Image
          src={urlFor(media.source)}
          alt={media.alt || ""}
          width={dimensions.width}
          height={dimensions.height}
          className={cn("object-cover", className)}
          quality={95}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, (max-width: 1536px) 60vw, 2400px"
          onLoad={handleLoadSuccess}
          {...(lqip ? { placeholder: "blur", blurDataURL: lqip } : {})}
        />
      );
    }

    // Fallback to fill mode if no dimensions available
    return (
      <Image
        src={urlFor(media.source)}
        alt={media.alt || ""}
        className={cn("object-cover", className)}
        fill
        quality={95}
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, (max-width: 1536px) 60vw, 2400px"
        onLoad={handleLoadSuccess}
        {...(lqip ? { placeholder: "blur", blurDataURL: lqip } : {})}
      />
    );
  };

  return (
    <motion.div
      layoutId={layoutId}
      className={fill ? "relative h-full w-full" : ""}
    >
      {isMuxVideo(media) ? (
        shouldShowThumbnail ? (
          renderImage()
        ) : (
          <video
            ref={videoRef}
            className={cn("h-full w-full object-cover", className)}
            autoPlay={autoPlay && !isLowPowerMode}
            muted
            playsInline
            loop
            poster={getMuxThumbnailUrl(media)}
            onError={handleVideoError}
            onLoadedMetadata={handleLoadSuccess}
            preload={priority ? "auto" : "metadata"}
          >
            <source
              src={`https://stream.mux.com/${media.source?.asset?.playbackId}/high.mp4`}
              type="video/mp4"
            />
          </video>
        )
      ) : (
        renderImage()
      )}
    </motion.div>
  );
}
