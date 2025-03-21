import { BaseWidget } from "@/components/widgets/grid/base-widget";
import { CTAWidgetTypes } from "@/components/widgets/grid/types";
import { MediaRenderer } from "@/components/media-renderer";
import Link from "next/link";

interface CTAProps {
  data: CTAWidgetTypes;
}

export default function CTAWidget({ data }: CTAProps) {
  const renderContent = () => {
    switch (data.size) {
      case "1x1":
      case "2x2":
        return (
          <div className="flex h-full w-full flex-col gap-1">
            {/* <Link href="/contact" className="block h-1/2">
              <div className="frame-inner relative flex h-full w-full cursor-pointer overflow-hidden bg-pink-500/15 transition-all duration-300 ease-in-out hover:bg-pink-500/30">
                <div className="absolute left-0 top-0 h-full w-4 bg-pink-600/80" />
                <div className="flex flex-col gap-1 pl-7 pt-3">
                  <h1 className="text-2xl font-medium text-pink-700">
                    Meeting with Daybreak Studio 🖇️
                  </h1>
                  <h2 className="text-xl text-pink-700">12 - 1 PM</h2>
                </div>
              </div>
            </Link>
            <Link href="/contact" className="block h-1/2">
              <div className="frame-inner relative flex h-full w-full cursor-pointer overflow-hidden bg-sky-500/15 transition-all duration-300 ease-in-out hover:bg-sky-500/30">
                <div className="absolute left-0 top-0 h-full w-4 bg-sky-600/80" />
                <div className="flex flex-col gap-1 pl-7 pt-3">
                  <h1 className="text-2xl font-medium text-sky-700">
                    Get in Touch 📨
                  </h1>
                  <h2 className="text-xl text-sky-700">1 - 2 PM</h2>
                </div>
              </div>
            </Link> */}
          </div>
        );
      case "3x3":
        return <div>CTA</div>;
    }
  };

  return (
    <BaseWidget position={data.position} size={data.size}>
      {renderContent()}
    </BaseWidget>
  );
}
