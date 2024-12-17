import { BaseWidget } from "../grid/base-widget";
import { MediaWidget } from "../grid/types";
import { MediaRenderer } from "../../media-renderer";
import { HoverCard } from "@/components/animations/hover";

interface MediaProps {
  data: MediaWidget;
}

export default function Media({ data }: MediaProps) {
  const renderContent = () => {
    const mediaItem = data.media?.[0] ?? null;

    switch (data.size) {
      case "1x1":
        return <MediaRenderer media={mediaItem} priority />;
      case "2x2":
        return <MediaRenderer media={mediaItem} priority autoPlay />;
      case "3x3":
        return <MediaRenderer media={mediaItem} priority autoPlay />;
    }
  };

  return (
    <BaseWidget position={data.position} size={data.size}>
      {renderContent()}
    </BaseWidget>
  );
}
