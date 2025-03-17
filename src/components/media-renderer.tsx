import { memo, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor, getMuxThumbnailUrl } from "@/sanity/lib/image";
import { MediaItem } from "@/sanity/lib/media";
import { cn } from "@/lib/utils";

interface MediaRendererProps {
  media: MediaItem | null;
  className?: string;
  // Video props
  autoPlay?: boolean;
  thumbnailTime?: number;
  // Image props
  priority?: boolean;
  fill?: boolean;
  loading?: "lazy" | "eager";
}

// Video events for controlling playback across components
export const VIDEO_EVENTS = {
  PAUSE_ALL: "PAUSE_ALL_VIDEOS",
  RESUME_ALL: "RESUME_ALL_VIDEOS",
} as const;

// Optimize image loading with better defaults
const DEFAULT_IMAGE_PROPS = {
  sizes:
    "(max-width: 640px) 640px, (max-width: 1024px) 1024px, (max-width: 1920px) 1920px, 2560px",
  quality: 90,
} as const;

export const MediaRenderer = memo(
  function MediaRenderer({
    media,
    className,
    autoPlay = false,
    thumbnailTime,
    priority = false,
    fill = false,
    loading,
  }: MediaRendererProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Essential video control
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handlePause = () => video.pause();
      const handleResume = () => autoPlay && video.play().catch(() => {});

      window.addEventListener(VIDEO_EVENTS.PAUSE_ALL, handlePause);
      window.addEventListener(VIDEO_EVENTS.RESUME_ALL, handleResume);

      return () => {
        window.removeEventListener(VIDEO_EVENTS.PAUSE_ALL, handlePause);
        window.removeEventListener(VIDEO_EVENTS.RESUME_ALL, handleResume);
      };
    }, [autoPlay]);

    if (!media?.source?.asset) return null;

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <motion.div className={fill ? "relative h-full w-full" : ""}>
        {children}
      </motion.div>
    );

    // Handle videos
    if (media._type === "videoItem" && media.source._type === "mux.video") {
      const playbackId = media.source.asset.playbackId;
      if (!playbackId) return null;

      return (
        <Wrapper>
          <video
            ref={videoRef}
            className={cn("h-full w-full object-cover", className)}
            src={`https://stream.mux.com/${playbackId}/high.mp4`}
            poster={getMuxThumbnailUrl(media, thumbnailTime)}
            autoPlay={autoPlay}
            muted
            playsInline
            loop
          />
        </Wrapper>
      );
    }

    // Handle images
    if (media.source.asset._ref.startsWith("image-")) {
      const imageUrl = urlFor(media.source).toString();

      // Use higher default dimensions for high-res displays
      const defaultWidth = 2560; // Matches our largest breakpoint
      const defaultHeight = Math.round(defaultWidth * (9 / 16)); // Maintain aspect ratio

      return (
        <Wrapper>
          <Image
            src={imageUrl}
            alt={media.alt || ""}
            className={cn("object-cover", className)}
            {...(fill
              ? { fill: true }
              : {
                  width:
                    media.source.asset.metadata?.dimensions?.width ||
                    defaultWidth,
                  height:
                    media.source.asset.metadata?.dimensions?.height ||
                    defaultHeight,
                })}
            priority={priority}
            loading={loading}
            placeholder={media.source.asset.metadata?.lqip ? "blur" : undefined}
            blurDataURL={media.source.asset.metadata?.lqip}
            {...DEFAULT_IMAGE_PROPS}
          />
        </Wrapper>
      );
    }

    return null;
  },
  (prevProps, nextProps) => {
    // Improve memoization to prevent unnecessary rerenders
    return (
      prevProps.media?._key === nextProps.media?._key &&
      prevProps.autoPlay === nextProps.autoPlay &&
      prevProps.priority === nextProps.priority &&
      prevProps.loading === nextProps.loading
    );
  },
);
