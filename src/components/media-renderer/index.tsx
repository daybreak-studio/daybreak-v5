import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { urlFor, getMuxThumbnailUrl } from "@/sanity/lib/image";
import { useLowPowerMode } from "@/hooks/useLowPowerMode";
import { MediaItem, VideoItem, ImageItem } from "@/sanity/lib/media";

interface MediaRendererProps {
  media: MediaItem | null;
  layoutId?: string;
  className?: string;
  autoPlay?: boolean;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

// Utils
const isMuxVideo = (media: MediaItem): media is VideoItem => {
  return (
    media._type === "videoItem" &&
    media.source?._type === "mux.video" &&
    !!media.source?.asset?._ref
  );
};

const isValidMedia = (media: MediaItem | null): media is MediaItem => {
  if (!media) {
    console.log("Invalid media: media is null");
    return false;
  }

  if (!media.source) {
    console.log("Invalid media: missing source", { media });
    return false;
  }

  if (!media.source.asset) {
    console.log("Invalid media: missing asset", {
      media,
      source: media.source,
    });
    return false;
  }

  if (!media.source.asset._ref) {
    console.log("Invalid media: missing asset._ref", {
      media,
      source: media.source,
      asset: media.source.asset,
    });
    return false;
  }

  return true;
};

const getMediaUrl = (media: MediaItem): string => {
  if (!media.source?.asset?._ref) {
    console.warn("Missing asset reference", media);
    return "";
  }

  if (isMuxVideo(media)) {
    return getMuxThumbnailUrl(media);
  }

  return urlFor(media.source);
};

// Components
const OptimizedImage = ({
  media,
  className = "",
  priority = false,
  alt = "",
  onLoad,
}: {
  media: MediaItem;
  className?: string;
  priority?: boolean;
  alt?: string;
  onLoad?: () => void;
}) => (
  <div className="relative h-full w-full">
    <Image
      src={getMediaUrl(media)}
      alt={alt || media.alt || ""}
      className={`object-cover ${className}`}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onLoad={onLoad}
    />
  </div>
);

const VideoPlayer = ({
  media,
  className = "",
  autoPlay = false,
  isInView = false,
  priority = false,
  poster,
  onError,
  onLoad,
}: {
  media: VideoItem;
  className?: string;
  autoPlay?: boolean;
  isInView?: boolean;
  priority?: boolean;
  poster: string;
  onError?: () => void;
  onLoad?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackId = media.source?.asset?.playbackId;

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !autoPlay || !isInView) return;

    const playVideo = async () => {
      try {
        await videoElement.play();
      } catch (error) {
        console.warn("Autoplay prevented:", error);
        onError?.();
      }
    };

    playVideo();

    return () => {
      videoElement.pause();
      videoElement.src = "";
      videoElement.load();
    };
  }, [isInView, autoPlay, onError]);

  if (!playbackId) return null;

  return (
    <video
      ref={videoRef}
      className={`h-full w-full object-cover ${className}`}
      autoPlay={autoPlay && isInView}
      muted
      playsInline
      loop
      poster={poster}
      onError={() => onError?.()}
      onLoadedData={() => onLoad?.()}
      preload={priority ? "auto" : "metadata"}
    >
      <source
        src={`https://stream.mux.com/${playbackId}/high.mp4`}
        type="video/mp4"
      />
    </video>
  );
};

// Main Component
export function MediaRenderer({
  media,
  layoutId,
  className = "",
  autoPlay = false,
  priority = false,
  onLoad,
  onError,
}: MediaRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const isLowPowerMode = useLowPowerMode();

  const handleLoadSuccess = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
    onError?.();
  }, [onError]);

  if (!isValidMedia(media)) return null;

  const shouldShowThumbnail = isLowPowerMode || videoError;

  return (
    <motion.div
      ref={containerRef}
      layoutId={layoutId}
      className={`relative h-full w-full overflow-hidden ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-100" />
      )}

      {isMuxVideo(media) ? (
        <div className="relative h-full w-full">
          {shouldShowThumbnail ? (
            <OptimizedImage
              media={media}
              className="rounded-xl"
              priority={priority}
              onLoad={handleLoadSuccess}
            />
          ) : (
            <VideoPlayer
              media={media}
              className="rounded-xl"
              autoPlay={autoPlay}
              isInView={isInView}
              priority={priority}
              poster={getMediaUrl(media)}
              onError={handleVideoError}
              onLoad={handleLoadSuccess}
            />
          )}
        </div>
      ) : (
        <OptimizedImage
          media={media}
          className="rounded-xl"
          priority={priority}
          onLoad={handleLoadSuccess}
        />
      )}
    </motion.div>
  );
}
