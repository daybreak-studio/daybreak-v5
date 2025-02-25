import { BaseWidget } from "@/components/widgets/grid/base-widget";
import { MediaWidgetTypes } from "@/components/widgets/grid/types";
import { MediaRenderer } from "@/components/media-renderer";

interface MediaProps {
  data: MediaWidgetTypes;
}

export default function MediaWidget({ data }: MediaProps) {
  const renderContent = () => {
    const mediaItem = data.media?.[0] ?? null;
    const key = mediaItem?._key;

    switch (data.size) {
      case "1x1":
        return (
          <MediaRenderer
            key={`${key}-1x1`}
            media={mediaItem}
            priority
            autoPlay
            fill
          />
        );
      case "2x2":
        return (
          <MediaRenderer
            key={`${key}-2x2`}
            media={mediaItem}
            priority
            autoPlay
            fill
          />
        );
      case "3x3":
        return (
          <MediaRenderer
            key={`${key}-3x3`}
            media={mediaItem}
            priority
            autoPlay
            fill
          />
        );
    }
  };

  return (
    <BaseWidget position={data.position} size={data.size}>
      {renderContent()}
    </BaseWidget>
  );
}
