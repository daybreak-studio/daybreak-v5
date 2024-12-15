import { BaseWidget } from "../grid/base-widget";
import { TwitterWidget } from "../grid/types";
import TwitterLogo from "/public/icons/twitter.svg";

interface TwitterProps {
  data: TwitterWidget;
}

export default function Twitter({ data }: TwitterProps) {
  console.log(data);
  const renderContent = () => {
    switch (data.size) {
      case "1x1":
        return (
          <div className="frame-inner flex h-full w-full flex-col bg-white/50 p-6">
            <h1 className="text-xs text-zinc-500">
              Please use a supported widget size: 2x2, 3x3
            </h1>
          </div>
        );
      case "2x2":
      case "3x3":
        return (
          <a href={data.link} target="_blank" rel="noopener noreferrer">
            <div className="frame-inner flex h-full w-full flex-col bg-white/50 p-6 text-zinc-500 transition-colors duration-200 hover:text-zinc-400">
              <p className="line-clamp-8 mb-2">{data.tweet}</p>
              <div className="mt-auto flex justify-between">
                <p className="">{data.author}</p>
                <div className="h-auto w-4">
                  <TwitterLogo className="h-full w-full fill-current" />
                </div>
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
