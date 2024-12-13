import { BaseWidget } from "../widget-grid/base-widget";
import { MediaWidget } from "../widget-grid/types";
import { MediaRenderer } from "../media-renderer";

interface MediaProps {
  data: MediaWidget;
}

export default function Media({ data }: MediaProps) {
  const renderContent = () => {
    const mediaItem = data.media?.[0] ?? null;

    switch (data.size) {
      case "1x1":
        return (
          <MediaRenderer
            className="frame-inner"
            media={mediaItem}
            priority
            fill
          />
        );
      case "2x2":
        return (
          <MediaRenderer
            className="frame-inner"
            media={mediaItem}
            priority
            fill
            autoPlay
          />
        );
      case "3x3":
        return (
          <MediaRenderer
            className="frame-inner"
            media={mediaItem}
            priority
            fill
            autoPlay
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
