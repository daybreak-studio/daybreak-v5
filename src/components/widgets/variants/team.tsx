import { BaseWidget } from "@/components/widgets/grid/base-widget";
import { TeamWidgetTypes } from "@/components/widgets/grid/types";
import { MediaRenderer } from "@/components/media-renderer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { About } from "@/sanity/types";
import { client } from "@/sanity/lib/client";
import { TEAM_QUERY } from "@/sanity/lib/queries";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
interface TeamProps {
  data: TeamWidgetTypes;
}

export default function TeamWidget({ data }: TeamProps) {
  const [teamData, setTeamData] = useState<About["team"]>();
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);

  useEffect(() => {
    const fetchTeamData = async () => {
      const teamData = await client.fetch(TEAM_QUERY);
      setTeamData(teamData.team);
    };
    fetchTeamData();
  }, []);

  // Rotate through team members every 5 seconds
  useEffect(() => {
    if (!teamData?.length) return;

    const interval = setInterval(() => {
      setCurrentMemberIndex((prev) => (prev + 1) % teamData.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [teamData]);

  const renderContent = () => {
    switch (data.size) {
      case "1x1":
      case "2x2":
      case "3x3":
        return (
          <Link href="/team">
            <div className="flex h-full w-full flex-col gap-1">
              <div className="relative h-full w-full bg-white/60">
                {/* Permanent edge glow */}
                <div className="absolute inset-0 z-20 rounded-[30px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,245,230,0)_0%,rgba(255,240,235,0)_25%,rgba(250,235,245,0)_50%,rgba(245,240,255,0)_50%,rgba(250,235,245,0.5)_75%,rgba(245,240,255,0.6)_90%,rgba(250,250,255,0.8)_100%)]" />
                {/* Hover fill glow */}
                <div className="absolute inset-0 z-20 rounded-[30px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,245,230,0.9)_0%,rgba(255,240,235,0.8)_25%,rgba(250,235,245,0.7)_50%,rgba(245,240,255,0.6)_75%,rgba(250,250,255,0.5)_100%)] opacity-0 mix-blend-overlay transition-opacity duration-500 hover:opacity-100" />
                <AnimatePresence mode="wait">
                  {teamData?.[currentMemberIndex]?.media?.[0] && (
                    <motion.div
                      key={currentMemberIndex}
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(10px)" }}
                      transition={{ duration: 0.5 }}
                      className="relative z-10 h-full w-full"
                    >
                      <MediaRenderer
                        className={cn(
                          `[object-position:50%_10% h-full w-full scale-110 object-cover blur-sm`,
                          data.size === "1x1" && "blur-none",
                        )}
                        media={teamData[currentMemberIndex].media[0]}
                        autoPlay={true}
                        disableThumbnails
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  className="absolute inset-0 z-30 rounded-[30px] bg-white/40 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.h1
                    className={cn(
                      `absolute z-[100] font-[450] text-neutral-400 mix-blend-multiply`,
                      data.size === "1x1" &&
                        "bottom-6 left-6 max-w-[4ch] text-2xl",
                      data.size === "2x2" && "bottom-8 left-8 text-3xl",
                      data.size === "3x3" && "bottom-12 left-12 text-4xl",
                    )}
                  >
                    Our Team
                  </motion.h1>
                </motion.div>
              </div>
            </div>
          </Link>
        );
    }
  };

  return (
    <BaseWidget position={data.position} size={data.size}>
      {renderContent()}
    </BaseWidget>
  );
}
