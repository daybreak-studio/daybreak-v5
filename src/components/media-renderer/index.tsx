import Image from "next/image";
import { useRef } from "react";
import { easeInOut, motion } from "framer-motion";
import { assetUrlFor } from "@/sanity/lib/builder";
import { useNextSanityImage } from "next-sanity-image";
import { client } from "@/sanity/lib/client";
import { AnimationConfig } from "../animations/AnimationConfig";

type MediaItem = {
  asset?: {
    _ref: string;
    _type: "reference";
  };
  _type: "image" | "video" | "file";
  _key: string;
};

interface MediaRendererProps {
  media: MediaItem | null;
  layoutId?: string;
  className?: string;
  autoPlay?: boolean;
  isExiting?: boolean; // Add this prop to control exit animations
}

// Separate component for images that uses the hook
function SanityImage({
  media,
  className,
}: {
  media: MediaItem;
  className?: string;
}) {
  const imageProps = useNextSanityImage(client, media);

  return <Image {...imageProps} alt="" className={className} />;
}

interface MediaRendererProps {
  media: MediaItem | null;
  layoutId?: string;
  className?: string;
  autoPlay?: boolean;
}

export function MediaRenderer({
  media,
  layoutId,
  className = "",
  autoPlay = false,
}: MediaRendererProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!media?.asset) return null;
  const mediaUrl = assetUrlFor(media);
  if (!mediaUrl) return null;

  return (
    <motion.div
      layoutId={layoutId}
      className={`relative overflow-hidden ${className} h-full w-full`}
    >
      {media._type === "image" && (
        <SanityImage
          media={media}
          className="h-full w-full rounded-xl object-cover"
        />
      )}
      {(media._type === "video" || media._type === "file") && (
        <video
          ref={videoRef}
          className="h-full w-full rounded-xl object-cover"
          autoPlay={autoPlay}
          muted
          playsInline
          loop
        >
          <source src={mediaUrl} type="video/mp4" />
        </video>
      )}
    </motion.div>
  );
}
