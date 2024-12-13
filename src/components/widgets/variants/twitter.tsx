import { BaseWidget } from "../grid/base-widget";
import { TwitterWidget } from "../grid/types";

interface TwitterProps {
  data: TwitterWidget;
}

export default function Twitter({ data }: TwitterProps) {
  const renderContent = () => {
    switch (data.size) {
      case "1x1":
        return (
          <div className="frame-inner flex h-full w-full flex-col bg-white/50 p-4">
            <p className="mb-2 line-clamp-3 text-sm text-zinc-500">
              {data.tweet}
            </p>
            <div className="mt-auto">
              <p className="text-xs text-zinc-500">{data.author}</p>
            </div>
          </div>
        );
      case "2x2":
        return (
          <div className="frame-inner flex h-full w-full flex-col bg-white/50 p-6">
            <p className="mb-2 line-clamp-6 text-base text-zinc-500">
              {data.tweet}
            </p>
            <div className="mt-auto">
              <p className="text-sm text-zinc-500">{data.author}</p>
            </div>
          </div>
        );
      case "3x3":
        return (
          <div className="frame-inner flex h-full w-full flex-col bg-white/50 p-8">
            <p className="mb-4 text-lg text-zinc-500">{data.tweet}</p>
            <div className="mt-auto">
              <p className="text-base text-zinc-500">{data.author}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <BaseWidget position={data.position} size={data.size}>
      {renderContent()}
    </BaseWidget>
  );
}
