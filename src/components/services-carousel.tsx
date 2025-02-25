import { Services } from "@/sanity/types";
import { useState, useEffect } from "react";
import { MediaRenderer } from "./media-renderer";
import { AnimatePresence, motion } from "framer-motion";
import { EASINGS } from "@/components/animations/easings";
import { cn } from "@/lib/utils";

interface ServicesCarouselProps {
  categories: NonNullable<Services["categories"]>;
}
import Image from "next/image";
type CategoryKey = "brand" | "development" | "product" | "motion";
const CATEGORY_ORDER: CategoryKey[] = [
  "brand",
  "development",
  "product",
  "motion",
];

export default function ServicesCarousel({
  categories,
}: ServicesCarouselProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("brand");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [shiftPressed, setShiftPressed] = useState(false);
  const [isCategoryChanging, setIsCategoryChanging] = useState(false);

  // Reset activeTabIndex when category changes
  useEffect(() => {
    setActiveTabIndex(0);
  }, [activeCategory]);

  // Update the category change handlers to set both states at once
  const handleCategoryChange = (category: CategoryKey) => {
    if (category !== activeCategory) {
      setIsCategoryChanging(true);
      setActiveCategory(category);
      setActiveTabIndex(0);
      // Reset the flag after animation duration
      setTimeout(() => setIsCategoryChanging(false), 1000);
    }
  };

  // First, let's update the keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle category changes with regular numbers
      if (!shiftPressed && e.key >= "1" && e.key <= "4") {
        const index = Number(e.key) - 1;
        if (index < CATEGORY_ORDER.length) {
          handleCategoryChange(CATEGORY_ORDER[index]);
        }
        return;
      }

      // Handle heading changes with shift + numbers
      if (shiftPressed) {
        const shiftKeys = { "!": 0, "@": 1, "#": 2, $: 3 };
        const index = shiftKeys[e.key as keyof typeof shiftKeys];

        if (index !== undefined) {
          const currentTabs = categories[activeCategory] || [];
          if (index < currentTabs.length) {
            setActiveTabIndex(index);
          }
        }
        return;
      }

      // Handle shift key press
      if (e.key === "Shift") {
        setShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [shiftPressed, activeCategory, categories]);

  console.log(categories);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-8">
      {/* Tabs */}
      <div className="relative h-full max-h-fit w-full max-w-[500px] lg:max-w-[500px] xl:max-w-[1100px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${activeTabIndex}`}
            layout
            layoutId="services-outer"
            className="frame-outer h-full shadow-xl shadow-stone-500/5"
            transition={{
              layout: {
                duration: 0.8,
                ease: EASINGS.easeOutQuart,
              },
            }}
          >
            <motion.div
              layoutId="services-inner"
              layout
              className="frame-inner h-full bg-white/30 backdrop-blur-2xl"
              transition={{
                layout: {
                  duration: 0.8,
                  ease: EASINGS.easeOutQuart,
                },
              }}
            >
              <div className="flex h-full flex-col items-center justify-center space-y-2 text-center text-sm text-stone-500 xl:flex-row xl:space-y-0">
                <div className="relative aspect-square h-full w-full xl:order-2 xl:w-7/12 xl:p-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`media-${activeCategory}-${activeTabIndex}`}
                      initial={{ opacity: 0, filter: "blur(8px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(8px)" }}
                      transition={{
                        duration: 1,
                        ease: EASINGS.easeOutQuart,
                      }}
                      className="h-full w-full"
                    >
                      <MediaRenderer
                        className="frame-inner size-full"
                        media={
                          categories[activeCategory]?.[activeTabIndex]
                            ?.media?.[0] ?? null
                        }
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex flex-col space-y-2 p-6 pt-0 xl:h-full xl:w-5/12 xl:justify-between xl:p-2 xl:text-left">
                  <nav className="flex justify-center xl:justify-start xl:space-x-4">
                    <AnimatePresence mode="wait">
                      {categories[activeCategory]?.map((item, index) => (
                        <motion.button
                          key={item._key}
                          initial={
                            isCategoryChanging ? { opacity: 0, y: 10 } : false
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{
                            duration: 0.8,
                            ease: EASINGS.easeOutQuart,
                            delay: isCategoryChanging ? index * 0.1 : 0,
                          }}
                          className={cn(
                            "xl:frame-inner flex items-center justify-center px-4 py-2 font-medium transition-colors duration-300 xl:bg-neutral-200/75 xl:p-8",
                            activeTabIndex === index
                              ? "text-stone-800"
                              : "text-stone-400/70 hover:text-stone-600",
                          )}
                          onClick={() => setActiveTabIndex(index)}
                        >
                          {item.heading}
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </nav>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`text-${activeCategory}-${activeTabIndex}`}
                      initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      exit={{ opacity: 0, filter: "blur(8px)", y: -10 }}
                      transition={{
                        duration: 1,
                        ease: EASINGS.easeOutQuart,
                        delay: 0.1,
                      }}
                      className="xl:space-y-4 xl:p-4"
                    >
                      <h1 className="hidden text-4xl xl:block">
                        {categories[activeCategory]?.[activeTabIndex]?.heading}
                      </h1>
                      <h2 className="text-pretty text-lg text-stone-400 xl:text-2xl">
                        {categories[activeCategory]?.[activeTabIndex]?.caption}
                      </h2>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Categories */}
      <div className="frame-outer mt-4 flex w-fit items-stretch justify-center overflow-hidden border-[1px] border-stone-300/25 p-1 shadow-2xl shadow-stone-500/15 backdrop-blur-3xl">
        <nav className="frame-inner relative flex justify-center bg-white/30 backdrop-blur-2xl">
          {CATEGORY_ORDER.map((category, index) => (
            <motion.button
              key={category}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative px-4 py-3 text-sm font-medium transition-colors duration-300",
                activeCategory === category
                  ? "text-stone-600"
                  : "text-stone-400 hover:text-stone-600",
              )}
              onClick={() => handleCategoryChange(category)}
            >
              <span className="relative z-10">
                <span className="mr-2 hidden text-xs text-stone-400 xl:block">
                  {index + 1}
                </span>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>

              {activeCategory === category && (
                <motion.span
                  layoutId="category-pill"
                  className="frame-inner absolute inset-0 z-0 border-[1px] border-stone-600/5 bg-white/30 shadow-lg shadow-stone-500/15 backdrop-blur-2xl"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                />
              )}
            </motion.button>
          ))}
        </nav>
      </div>
    </div>
  );
}
