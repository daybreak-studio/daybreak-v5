import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNextSanityImage } from "next-sanity-image";
import { client } from "@/sanity/lib/client";
import { useInView } from "framer-motion";

export type MediaItem = {
  asset?: {
    _ref: string;
    _type: "reference";
  };
  _type: "image" | "mux.video";
  _key: string;
  playbackId?: string;
  alt?: string;
};

interface MediaRendererProps {
  media: MediaItem | null;
  layoutId?: string;
  className?: string;
  autoPlay?: boolean;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

// Custom hook for detecting low power mode
const useLowPowerMode = () => {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  useEffect(() => {
    // Check battery status if available
    if ("getBattery" in navigator) {
      // @ts-ignore - getBattery() is not in the typescript definitions
      navigator.getBattery().then((battery) => {
        const updatePowerMode = () => {
          setIsLowPowerMode(battery.charging === false && battery.level <= 0.2);
        };

        updatePowerMode();
        battery.addEventListener("levelchange", updatePowerMode);
        battery.addEventListener("chargingchange", updatePowerMode);

        return () => {
          battery.removeEventListener("levelchange", updatePowerMode);
          battery.removeEventListener("chargingchange", updatePowerMode);
        };
      });
    }

    // Check for reduced motion/data preference
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce), (prefers-reduced-data: reduce)",
    );
    const handleChange = (e: MediaQueryListEvent) =>
      setIsLowPowerMode(e.matches);

    setIsLowPowerMode(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isLowPowerMode;
};

// Mux thumbnail component
const MuxThumbnail = ({
  playbackId,
  className = "",
  priority = false,
  alt = "",
  onLoad,
}: {
  playbackId: string;
  className?: string;
  priority?: boolean;
  alt?: string;
  onLoad?: () => void;
}) => {
  return (
    <div className="relative h-full w-full">
      <Image
        src={`https://image.mux.com/${playbackId}/thumbnail.jpg`}
        alt={alt}
        className={`object-cover ${className}`}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={onLoad}
      />
    </div>
  );
};

// Sanity image component
const SanityImage = ({
  media,
  className = "",
  priority = false,
  onLoad,
}: {
  media: MediaItem;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}) => {
  const imageProps = useNextSanityImage(client, media);

  return (
    <div className="relative h-full w-full">
      <Image
        {...imageProps}
        alt={media.alt || ""}
        className={`object-cover ${className}`}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={onLoad}
      />
    </div>
  );
};

export function MediaRenderer({
  media,
  layoutId,
  className = "",
  autoPlay = false,
  priority = false,
  onLoad,
  onError,
}: MediaRendererProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isLowPowerMode = useLowPowerMode();
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const handleVideoError = useCallback(() => {
    setVideoError(true);
    onError?.();
  }, [onError]);

  const handleLoadSuccess = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  // Cleanup video resources when component unmounts
  useEffect(() => {
    const videoElement = videoRef.current;
    return () => {
      if (videoElement) {
        videoElement.pause();
        videoElement.src = "";
        videoElement.load();
      }
    };
  }, []);

  // Handle autoplay when in view
  useEffect(() => {
    if (!isInView || !autoPlay || isLowPowerMode || videoError) return;

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const playVideo = async () => {
      try {
        await videoElement.play();
      } catch (error) {
        console.warn("Autoplay prevented:", error);
        handleVideoError();
      }
    };

    playVideo();
  }, [isInView, autoPlay, isLowPowerMode, videoError, handleVideoError]);

  if (!media?.asset) return null;

  return (
    <motion.div
      ref={containerRef}
      layoutId={layoutId}
      className={`relative h-full w-full overflow-hidden ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-100" />
      )}

      {media._type === "image" && (
        <SanityImage
          media={media}
          className="rounded-xl"
          priority={priority}
          onLoad={handleLoadSuccess}
        />
      )}

      {media._type === "mux.video" && media.playbackId && (
        <div className="relative h-full w-full">
          {isLowPowerMode || videoError ? (
            <MuxThumbnail
              playbackId={media.playbackId}
              className="rounded-xl"
              priority={priority}
              alt={media.alt || ""}
              onLoad={handleLoadSuccess}
            />
          ) : (
            <video
              ref={videoRef}
              className="h-full w-full rounded-xl object-cover"
              autoPlay={autoPlay && isInView}
              muted
              playsInline
              loop
              poster={`https://image.mux.com/${media.playbackId}/thumbnail.jpg`}
              onError={handleVideoError}
              onLoadedData={handleLoadSuccess}
              preload={priority ? "auto" : "metadata"}
            >
              <source
                src={`https://stream.mux.com/${media.playbackId}/medium.mp4`}
                type="video/mp4"
              />
            </video>
          )}
        </div>
      )}
    </motion.div>
  );
}
