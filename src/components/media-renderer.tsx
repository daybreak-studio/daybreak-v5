import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor, getMuxThumbnailUrl } from "@/sanity/lib/image";
import { useLowPowerMode } from "@/lib/hooks/use-low-power-mode";
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
  transition?: {
    duration?: number;
    ease?: number[] | string;
    delay?: number;
  };
}

interface ImageProps {
  priority: boolean;
  fill: boolean;
  className?: string;
}

interface VideoProps {
  autoPlay: boolean;
  className?: string;
}

const isMuxVideo = (media: MediaItem): media is VideoItem => {
  return media._type === "videoItem" && media.source?._type === "mux.video";
};

const useMediaProps = (media: MediaItem | null, props: MediaRendererProps) => {
  const isLowPowerMode = useLowPowerMode();
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getImageProps = ({ priority, fill, className = "" }: ImageProps) => {
    if (!media) return null;
    const dimensions = media.source?.asset?.metadata?.dimensions;
    const lqip = media.source?.asset?.metadata?.lqip;

    return {
      src: isMuxVideo(media) ? getMuxThumbnailUrl(media) : urlFor(media.source),
      alt: media.alt || "",
      className: cn("object-cover", className),
      ...(fill
        ? { fill: true }
        : {
            width: dimensions?.width || 2000,
            height: dimensions?.height || 2000,
          }),
      priority,
      quality: 95,
      sizes:
        "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, (max-width: 1536px) 60vw, 2400px",
      ...(lqip && {
        placeholder: "blur" as const,
        blurDataURL: lqip,
      }),
      onError: () => {
        setError(true);
        props.onError?.();
      },
      onLoad: () => props.onLoad?.(),
    };
  };

  const getVideoProps = ({ autoPlay, className = "" }: VideoProps) => {
    if (!media) return null;

    return {
      ref: videoRef,
      className: cn("h-full w-full object-cover", className),
      src: `https://stream.mux.com/${media.source?.asset?.playbackId}/high.mp4`,
      type: "video/mp4",
      autoPlay: autoPlay && !isLowPowerMode,
      muted: true,
      playsInline: true,
      loop: true,
      poster: getMuxThumbnailUrl(media),
      onError: () => {
        setError(true);
        props.onError?.();
      },
      onLoadedMetadata: () => props.onLoad?.(),
    };
  };

  return {
    isLowPowerMode,
    error,
    getImageProps,
    getVideoProps,
  } as const;
};

export function MediaRenderer(props: MediaRendererProps) {
  const {
    media,
    layout,
    layoutId,
    className = "",
    autoPlay = false,
    priority = false,
    fill = false,
    onLoad,
    onError,
    transition,
  } = props;

  const { isLowPowerMode, error, getImageProps, getVideoProps } = useMediaProps(
    media,
    props,
  );

  if (!media?.source?.asset) return null;

  const shouldShowVideo = isMuxVideo(media) && !isLowPowerMode && !error;
  const imageProps = getImageProps({ priority, fill, className });
  const videoProps = getVideoProps({ autoPlay, className });

  if (!imageProps || !videoProps) return null;

  return (
    <motion.figure
      layout={layout}
      layoutId={layoutId}
      className={fill ? "relative h-full w-full will-change-transform" : ""}
      role="img"
      transition={transition}
    >
      {shouldShowVideo ? <video {...videoProps} /> : <Image {...imageProps} />}
    </motion.figure>
  );
}
