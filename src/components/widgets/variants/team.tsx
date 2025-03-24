import { BaseWidget } from "@/components/widgets/grid/base-widget";
import { TeamWidgetTypes } from "@/components/widgets/grid/types";
import { MediaRenderer } from "@/components/media-renderer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Team } from "@/sanity/types";

interface TeamProps {
  data: TeamWidgetTypes;
}

export default function TeamWidget({ data }: TeamProps) {
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const teamData = data.team?.team;

  // Randomize initial index when component mounts
  useEffect(() => {
    if (teamData?.length) {
      setCurrentMemberIndex(Math.floor(Math.random() * teamData.length));
    }
  }, [teamData]);

  // Rotate through team members every 5 seconds
  useEffect(() => {
    if (!teamData?.length) return;

    const interval = setInterval(() => {
      setCurrentMemberIndex((prev) => (prev + 1) % teamData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [teamData]);

  const renderContent = () => {
    switch (data.size) {
      case "1x1":
      case "2x2":
        return (
          <div className="flex h-full w-full flex-col gap-1">
            <div className="h-full w-full bg-white/60">
              {teamData?.[currentMemberIndex]?.media?.[0] && (
                <MediaRenderer
                  className="h-full w-full object-cover"
                  media={teamData[currentMemberIndex].media[0]}
                  autoPlay={true}
                  disableThumbnails
                />
              )}
            </div>
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
