import { BaseWidget } from "../grid/base-widget";
import { MediaWidgetTypes } from "../grid/types";
import { MediaRenderer } from "../../media-renderer";

interface MediaProps {
  data: MediaWidgetTypes;
}

export default function MediaWidget({ data }: MediaProps) {
  const renderContent = () => {
    const mediaItem = data.media?.[0] ?? null;

    switch (data.size) {
      case "1x1":
        return <MediaRenderer media={mediaItem} priority autoPlay fill />;
      case "2x2":
        return <MediaRenderer media={mediaItem} priority autoPlay fill />;
      case "3x3":
        return <MediaRenderer media={mediaItem} priority autoPlay fill />;
    }
  };

  return (
    <BaseWidget position={data.position} size={data.size}>
      {renderContent()}
    </BaseWidget>
  );
}
