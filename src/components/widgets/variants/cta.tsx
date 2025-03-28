import { BaseWidget } from "@/components/widgets/grid/base-widget";
import { CTAWidgetTypes } from "@/components/widgets/grid/types";
import { MediaRenderer } from "@/components/media-renderer";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CTAProps {
  data: CTAWidgetTypes;
}

export default function CTAWidget({ data }: CTAProps) {
  const renderContent = () => {
    switch (data.size) {
      case "1x1":
      case "2x2":
        return (
          <Link href="/contact">
            <motion.div className="relative flex h-full w-full flex-col gap-1 bg-white/60">
              <video
                className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-plus-darker blur-md"
                src="/videos/iridescent-1.mp4"
                autoPlay
                muted
                loop
              />
              <h1
                className={cn(
                  `absolute w-3/4 text-xl font-[450] text-neutral-400 mix-blend-multiply`,
                  data.size === "1x1" &&
                    "bottom-4 left-4 text-sm md:bottom-6 md:left-6 md:text-2xl",
                )}
              >
                Get in touch
              </h1>
            </motion.div>
          </Link>
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
