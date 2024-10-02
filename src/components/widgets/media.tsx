import { useWidgetGridContext } from "@/components/grid/hooks";
import Image from "next/image";
import { client } from "@/sanity/lib/client";

export default function MediaWidget({ media }: { media: any }) {
  const { size } = useWidgetGridContext();

  if (media._type === "image") {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <Image
          priority
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          src={media.asset.url}
          width={media.asset.metadata.dimensions.width}
          height={media.asset.metadata.dimensions.height}
          alt={media.alt || "Media content"}
          placeholder="blur"
          blurDataURL={media.asset.metadata.lqip}
        />
      </div>
    );
  } else if (media._type === "file" && media.asset.url) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <video
          controls
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        >
          <source src={media.asset.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return null;
}
