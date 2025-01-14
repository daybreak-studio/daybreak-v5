import { useState } from "react";
import { BaseWidget } from "../grid/base-widget";
import { QuotesWidgetTypes } from "../grid/types";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EASINGS } from "@/components/animations/easings";

interface QuotesProps {
  data: QuotesWidgetTypes;
}

export default function QuotesWidget({ data }: QuotesProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const testimonials = data.testimonials ?? [];

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setDirection("up");
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setDirection("down");
    setIndex((prev) => (prev - 1 < 0 ? testimonials.length - 1 : prev - 1));
  };

  const variants = {
    enter: (direction: "up" | "down") => ({
      y: direction === "up" ? 20 : -20,
      filter: "blur(10px)",
      opacity: 0,
    }),
    center: {
      y: 0,
      filter: "blur(0px)",
      opacity: 1,
    },
    exit: (direction: "up" | "down") => ({
      y: direction === "up" ? -20 : 20,
      filter: "blur(10px)",
      opacity: 0,
    }),
  };

  console.log(data);
  const renderContent = () => {
    switch (data.size) {
      case "1x1":
        return (
          <div className="frame-inner flex h-full w-full flex-col bg-white/50 p-6">
            <h1 className="text-xs text-stone-500">
              Please use a supported widget size: 2x2
            </h1>
          </div>
        );
      case "2x2":
        return (
          <div
            onClick={() => handleNext()}
            className="frame-inner flex h-full w-full flex-col justify-between bg-white/25 p-6"
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.4,
                  ease: EASINGS.easeInOutQuart,
                }}
              >
                <h1 className="text-xs text-stone-600 md:text-lg">
                  {testimonials[index]?.quote}
                </h1>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.4,
                  ease: EASINGS.easeInOutQuart,
                  delay: 0.05,
                }}
                className="flex flex-col"
              >
                <h1 className="text-xs font-medium text-stone-600 md:text-sm">
                  {testimonials[index]?.author}
                </h1>
                <h1 className="text-xs text-stone-500">
                  {testimonials[index]?.title}
                </h1>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-4 right-4 hidden flex-col gap-2 md:flex">
              <motion.button
                className="rounded-full bg-stone-200 p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronUp className="h-3 w-3 text-stone-500" />
              </motion.button>
              <motion.button
                className="rounded-full bg-stone-200 p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronDown className="h-3 w-3 text-stone-500" />
              </motion.button>
            </div>
          </div>
        );
      case "3x3":
        return (
          <div className="frame-inner flex h-full w-full flex-col bg-white/50 p-6">
            <h1 className="text-xs text-stone-500">
              Please use a supported widget size: 2x2
            </h1>
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
