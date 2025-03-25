import { BaseWidget } from "../grid/base-widget";
import { TwitterWidgetTypes } from "../grid/types";
import TwitterLogo from "/public/icons/twitter.svg";

interface TwitterProps {
  data: TwitterWidgetTypes;
}

export default function TwitterWidget({ data }: TwitterProps) {
  const renderContent = () => {
    switch (data.size) {
      case "1x1":
        return (
          <div className="frame-inner flex h-full w-full flex-col bg-white/50 p-6">
            <h1 className="text-xs text-neutral-500">
              Please use a supported widget size: 2x2, 3x3
            </h1>
          </div>
        );
      case "2x2":
      case "3x3":
        return (
          <a
            className="frame-inner flex h-full w-full flex-col justify-between bg-white/40 p-6 text-neutral-500 transition-colors duration-200 hover:bg-white/50"
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="mb-2 line-clamp-[7] text-xs text-neutral-500 md:line-clamp-[8] xl:text-base 2xl:text-2xl">
              {data.tweet}
            </p>
            <div className="flex justify-between">
              <p className="text-sm text-neutral-500/80 xl:text-base 2xl:text-lg">
                {data.author}
              </p>
              <div className="h-auto w-4">
                <TwitterLogo className="h-full w-full fill-current text-neutral-500/80" />
              </div>
            </div>
          </a>
        );
    }
  };

  return (
    <BaseWidget position={data.position} size={data.size}>
      {renderContent()}
    </BaseWidget>
  );
}
