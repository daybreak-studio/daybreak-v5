import { memo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor, getMuxThumbnailUrl } from "@/sanity/lib/image";
import { useLowPowerMode } from "@/lib/hooks/use-low-power-mode";
import { MediaItem } from "@/sanity/lib/media";
import { cn } from "@/lib/utils";

interface MediaRendererProps {
  media: MediaItem | null;
  layout?: boolean | "position" | "size" | "preserve-aspect";
  layoutId?: string;
  className?: string;
  autoPlay?: boolean;
  priority?: boolean;
  fill?: boolean;
  thumbnailTime?: number;
  disableThumbnail?: boolean;
  loading?: "lazy" | "eager";
  forcedVideoPlayback?: boolean;
  playsInline?: boolean;
  muted?: boolean;
  loop?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  transition?: {
    duration?: number;
    ease?: number[] | string;
    delay?: number;
  };
  quality?: number;
  width?: number;
  height?: number;
  sizes?: string;
}

interface ImageProps {
  priority: boolean;
  fill: boolean;
  className?: string;
  onError?: () => void;
  onLoad?: () => void;
}

interface VideoProps {
  autoPlay: boolean;
  className?: string;
  onError?: () => void;
  onLoad?: () => void;
  disableThumbnail: boolean;
  forcedVideoPlayback: boolean;
  playsInline?: boolean;
  muted?: boolean;
  loop?: boolean;
}

const isMuxVideo = (media: MediaItem): boolean => {
  return media._type === "videoItem" && media.source?._type === "mux.video";
};

export const MediaRenderer = memo(
  function MediaRenderer({
    media,
    layout,
    layoutId,
    className = "",
    autoPlay = false,
    priority = false,
    fill = false,
    thumbnailTime,
    disableThumbnail = false,
    loading,
    forcedVideoPlayback = false,
    playsInline = true,
    muted = true,
    loop = true,
    onLoad,
    onError,
    transition,
    quality = 95,
    width,
    height,
    sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, (max-width: 1536px) 60vw, 2400px",
  }: MediaRendererProps) {
    const isLowPowerMode = useLowPowerMode();
    const [error, setError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleVisibilityChange = () => {
        if (document.hidden) {
          video.play().catch(() => {});
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () =>
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
    }, []);

    if (!media?.source?.asset) return null;

    const shouldShowVideo =
      isMuxVideo(media) && (forcedVideoPlayback || !isLowPowerMode) && !error;

    const handleError = () => {
      setError(true);
      onError?.();
    };

    // For thumbnails of videos, use Mux thumbnail URL
    if (isMuxVideo(media) && !shouldShowVideo) {
      return (
        <motion.figure
          layout={layout}
          layoutId={layoutId}
          className={fill ? "relative h-full w-full will-change-transform" : ""}
          transition={transition}
        >
          <Image
            src={getMuxThumbnailUrl(media)}
            alt={media.alt || ""}
            className={cn("object-cover", className)}
            {...(fill
              ? { fill: true }
              : {
                  width: width || 40,
                  height: height || 40,
                })}
            priority={priority}
            loading={loading}
            quality={quality}
            sizes={sizes}
            onError={handleError}
            onLoad={onLoad}
          />
        </motion.figure>
      );
    }

    if (shouldShowVideo) {
      return (
        <motion.figure
          layout={layout}
          layoutId={layoutId}
          className={fill ? "relative h-full w-full will-change-transform" : ""}
          transition={transition}
        >
          <video
            ref={videoRef}
            className={cn("h-full w-full object-cover", className)}
            src={`https://stream.mux.com/${media.source?.asset?.playbackId}/high.mp4`}
            poster={
              !disableThumbnail
                ? getMuxThumbnailUrl(media, thumbnailTime)
                : undefined
            }
            autoPlay={forcedVideoPlayback ? true : autoPlay && !isLowPowerMode}
            muted={muted}
            playsInline={playsInline}
            loop={loop}
            onError={handleError}
            onLoadedMetadata={onLoad}
          />
        </motion.figure>
      );
    }

    // For images, ensure we have a valid Sanity image reference
    if (!media.source?.asset?._ref?.startsWith("image-")) {
      console.warn("Invalid image asset reference:", media);
      return null;
    }

    return (
      <motion.figure
        layout={layout}
        layoutId={layoutId}
        className={fill ? "relative h-full w-full will-change-transform" : ""}
        transition={transition}
      >
        <Image
          src={urlFor(media.source)}
          alt={media.alt || ""}
          className={cn("object-cover", className)}
          {...(fill
            ? { fill: true }
            : {
                width:
                  width ||
                  media.source?.asset?.metadata?.dimensions?.width ||
                  2000,
                height:
                  height ||
                  media.source?.asset?.metadata?.dimensions?.height ||
                  2000,
              })}
          priority={priority}
          loading={loading}
          quality={quality}
          sizes={sizes}
          placeholder={media.source?.asset?.metadata?.lqip ? "blur" : undefined}
          blurDataURL={media.source?.asset?.metadata?.lqip}
          onError={handleError}
          onLoad={onLoad}
        />
      </motion.figure>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if these props change
    return (
      prevProps.media?._key === nextProps.media?._key &&
      prevProps.autoPlay === nextProps.autoPlay &&
      prevProps.className === nextProps.className &&
      prevProps.layout === nextProps.layout &&
      prevProps.layoutId === nextProps.layoutId
    );
  },
);
