import { HoverCard } from "@/components/animations/hover";
import { BaseWidget } from "../grid/base-widget";
import { TwitterWidget } from "../grid/types";
import TwitterLogo from "/public/icons/twitter.svg";

interface TwitterProps {
  data: TwitterWidget;
}

export default function TwitterWidget({ data }: TwitterProps) {
  const renderContent = () => {
    switch (data.size) {
      case "1x1":
        return (
          <div className="frame-inner flex h-full w-full flex-col bg-white/50 p-6">
            <h1 className="text-xs text-stone-500">
              Please use a supported widget size: 2x2, 3x3
            </h1>
          </div>
        );
      case "2x2":
      case "3x3":
        return (
          <a
            className="flex h-full w-full flex-col justify-between p-6 text-stone-500 transition-colors duration-200 hover:text-stone-400"
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="mb-2 line-clamp-[7] text-xs md:line-clamp-[8] xl:text-base">
              {data.tweet}
            </p>
            <div className="flex justify-between">
              <p className="text-xs xl:text-base">{data.author}</p>
              <div className="h-auto w-4">
                <TwitterLogo className="h-full w-full fill-current" />
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
