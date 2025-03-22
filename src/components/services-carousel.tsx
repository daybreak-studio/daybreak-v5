import { Services } from "@/sanity/types";
import { useState, useEffect, useCallback } from "react";
import { MediaRenderer } from "./media-renderer";
import { AnimatePresence, motion } from "framer-motion";
import { EASINGS } from "@/components/animations/easings";
import { cn } from "@/lib/utils";

type CategoryKey = "brand" | "product" | "motion" | "web";
const CATEGORY_ORDER: CategoryKey[] = ["brand", "product", "motion", "web"];

interface ServicesCarouselProps {
  categories: NonNullable<Services["categories"]>;
}

interface KeyboardState {
  shiftPressed: boolean;
  pressedKeys: number[];
  pressedIndex: number | null;
}

// Custom hook for keyboard handling
function useKeyboardNavigation({
  onNumberKeyPress,
  onShiftNumberKeyPress,
  onNumberKeyRelease,
  onShiftKeyToggle,
}: {
  onNumberKeyPress?: (index: number) => void;
  onShiftNumberKeyPress?: (index: number) => void;
  onNumberKeyRelease?: (index: number, lastKey: number | null) => void;
  onShiftKeyToggle?: (isPressed: boolean) => void;
}) {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    shiftPressed: false,
    pressedKeys: [],
    pressedIndex: null,
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Handle number keys (1-4)
      if (e.key >= "1" && e.key <= "4") {
        const index = Number(e.key) - 1;

        if (keyboardState.shiftPressed) {
          // Handle Shift + number keys
          if (onShiftNumberKeyPress) {
            setKeyboardState((prev) => ({
              ...prev,
              pressedKeys: [
                ...prev.pressedKeys.filter((k) => k !== index),
                index,
              ],
              pressedIndex: index,
            }));
            onShiftNumberKeyPress(index);
          }
        } else if (onNumberKeyPress) {
          // Handle regular number keys
          setKeyboardState((prev) => ({
            ...prev,
            pressedKeys: [
              ...prev.pressedKeys.filter((k) => k !== index),
              index,
            ],
            pressedIndex: index,
          }));
          onNumberKeyPress(index);
        }
      }

      // Handle Shift+number keys directly (!, @, #, $)
      const shiftKeys = { "!": 0, "@": 1, "#": 2, $: 3 };
      if (e.key in shiftKeys && onShiftNumberKeyPress) {
        const index = shiftKeys[e.key as keyof typeof shiftKeys];
        setKeyboardState((prev) => ({
          ...prev,
          pressedKeys: [...prev.pressedKeys.filter((k) => k !== index), index],
          pressedIndex: index,
        }));
        onShiftNumberKeyPress(index);
      }

      // Handle Shift key
      if (e.key === "Shift") {
        setKeyboardState((prev) => ({ ...prev, shiftPressed: true }));
        if (onShiftKeyToggle) {
          onShiftKeyToggle(true);
        }
      }
    },
    [
      keyboardState.shiftPressed,
      onNumberKeyPress,
      onShiftNumberKeyPress,
      onShiftKeyToggle,
    ],
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      // Handle number keys release
      if (e.key >= "1" && e.key <= "4") {
        const index = Number(e.key) - 1;

        // Calculate the new state first
        const newPressedKeys = keyboardState.pressedKeys.filter(
          (k) => k !== index,
        );
        const lastPressedKey = newPressedKeys[newPressedKeys.length - 1];

        setKeyboardState((prev) => ({
          ...prev,
          pressedKeys: newPressedKeys,
          pressedIndex: lastPressedKey ?? null,
        }));

        if (onNumberKeyRelease) {
          onNumberKeyRelease(index, lastPressedKey ?? null);
        }
      }

      // Handle Shift+number keys release (!, @, #, $)
      const shiftKeys = { "!": 0, "@": 1, "#": 2, $: 3 };
      if (e.key in shiftKeys && onNumberKeyRelease) {
        const index = shiftKeys[e.key as keyof typeof shiftKeys];

        // Calculate the new state first
        const newPressedKeys = keyboardState.pressedKeys.filter(
          (k) => k !== index,
        );
        const lastPressedKey = newPressedKeys[newPressedKeys.length - 1];

        setKeyboardState((prev) => ({
          ...prev,
          pressedKeys: newPressedKeys,
          pressedIndex: lastPressedKey ?? null,
        }));

        if (onNumberKeyRelease) {
          onNumberKeyRelease(index, lastPressedKey ?? null);
        }
      }

      // Handle Shift key release
      if (e.key === "Shift") {
        setKeyboardState({
          shiftPressed: false,
          pressedKeys: [],
          pressedIndex: null,
        });
        if (onShiftKeyToggle) {
          onShiftKeyToggle(false);
        }
      }
    },
    [keyboardState.pressedKeys, onNumberKeyRelease, onShiftKeyToggle],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return keyboardState;
}

function ServiceContent({
  categories,
  activeCategory,
  activeTabIndex,
  keyboardState,
  onTabChange,
}: {
  categories: NonNullable<Services["categories"]>;
  activeCategory: CategoryKey;
  activeTabIndex: number;
  keyboardState: KeyboardState;
  onTabChange: (index: number) => void;
}) {
  return (
    <section className="relative flex h-full w-full flex-col 2xl:flex-row">
      <div className="relative h-full w-full 2xl:order-2 2xl:w-7/12">
        <AnimatePresence mode="wait">
          <motion.div
            key={`media-${activeCategory}-${activeTabIndex}`}
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{
              duration: 0.6,
              ease: EASINGS.easeOutQuart,
            }}
            className="aspect-square min-h-[400px] w-full 2xl:h-[640px] 2xl:p-4"
          >
            <MediaRenderer
              className="frame-inner"
              fill
              autoPlay
              media={
                categories[activeCategory]?.[activeTabIndex]?.media?.[0] ?? null
              }
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-4 pb-6 2xl:order-1 2xl:w-5/12 2xl:p-2 2xl:text-left">
        <nav className="flex justify-center gap-2 text-sm md:text-base 2xl:justify-start 2xl:gap-0 2xl:space-x-2">
          {categories[activeCategory]?.map((item, index) => (
            <div key={item._key} className="relative">
              {/* Mobile Version */}
              <motion.button
                initial={{}}
                whileTap={{
                  scale: 0.99,
                  y: 2,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  mass: 0.3,
                  restDelta: 0.001,
                }}
                className={cn(
                  "relative flex items-center justify-center overflow-hidden font-[450]",
                  activeTabIndex === index
                    ? "text-neutral-500"
                    : "text-neutral-400/70 hover:text-neutral-500",
                  "2xl:hidden",
                )}
                style={{
                  transformOrigin: "center bottom",
                }}
                onClick={() => onTabChange(index)}
              >
                <span className="p-2">{item.heading}</span>
              </motion.button>

              {/* Desktop Version */}
              <motion.button
                initial={{}}
                animate={{
                  y: keyboardState.shiftPressed
                    ? keyboardState.pressedKeys.includes(index)
                      ? 3
                      : 1
                    : 0,
                  scale: keyboardState.shiftPressed
                    ? keyboardState.pressedKeys.includes(index)
                      ? 0.97
                      : 0.99
                    : 1,
                  boxShadow: keyboardState.shiftPressed
                    ? keyboardState.pressedKeys.includes(index)
                      ? "inset 0 3px 4px rgba(0,0,0,0.2), inset 0 0 2px rgba(0,0,0,0.15)"
                      : "inset 0 1px 2px rgba(0,0,0,0.3)"
                    : "0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -2px rgba(0,0,0,0.04), 0 0 2px 0 rgba(0,0,0,0.03)",
                }}
                whileTap={{
                  scale: 0.97,
                  y: 3,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  mass: 0.3,
                  restDelta: 0.001,
                }}
                className={cn(
                  "frame-inner hidden h-32 w-32 items-center justify-center overflow-hidden p-4 font-[450]",
                  activeTabIndex === index && "bg-neutral-100",
                  "border border-neutral-200/80",
                  activeTabIndex === index
                    ? "text-neutral-500"
                    : "text-neutral-400/70 hover:text-neutral-500",
                  "2xl:flex",
                )}
                style={{
                  transformOrigin: "center bottom",
                }}
                onClick={() => onTabChange(index)}
              >
                <div className="relative z-10 flex h-full w-full flex-col justify-between text-left">
                  <div className="flex items-center">
                    <span
                      className={cn(
                        "w-fit rounded-lg border-[1px] border-neutral-200 bg-neutral-200/25 px-2 py-1 text-xs font-normal text-neutral-400",
                        keyboardState.shiftPressed &&
                          keyboardState.pressedKeys.includes(index) &&
                          "text-neutral-500",
                      )}
                    >
                      <span
                        className={cn(
                          "relative text-neutral-400",
                          keyboardState.shiftPressed && "text-neutral-500",
                        )}
                      >
                        Shift
                      </span>
                    </span>

                    <span className="mx-1 text-neutral-300">+</span>

                    <span
                      className={cn(
                        "w-fit rounded-lg border-[1px] border-neutral-200 bg-neutral-200/25 px-2 py-1 text-xs font-normal text-neutral-400",
                        keyboardState.shiftPressed &&
                          keyboardState.pressedKeys.includes(index) &&
                          "text-neutral-500",
                      )}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <span className="p-2">{item.heading}</span>
                </div>
              </motion.button>
            </div>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <div
            key={`text-${activeCategory}-${activeTabIndex}`}
            className="flex flex-col items-center justify-center text-center 2xl:items-start 2xl:space-y-4 2xl:p-4 2xl:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(8px)", y: -10 }}
              transition={{
                duration: 0.4,
                ease: EASINGS.easeOutQuart,
              }}
              className="hidden text-3xl text-neutral-500 2xl:block"
            >
              {categories[activeCategory]?.[activeTabIndex]?.heading}
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(8px)", y: -10 }}
              transition={{
                duration: 0.4,
                ease: EASINGS.easeOutQuart,
                delay: 0.15,
              }}
              className="text-pretty text-neutral-400 md:w-10/12 md:text-lg 2xl:text-xl"
            >
              {categories[activeCategory]?.[activeTabIndex]?.caption}
            </motion.h2>
          </div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function CategoryNav({
  className,
  activeCategory,
  onCategoryChange,
}: {
  className?: string;
  activeCategory: CategoryKey;
  onCategoryChange: (category: CategoryKey) => void;
}) {
  return (
    <div
      className={cn(
        "frame-outer mt-4 flex w-fit items-stretch justify-center p-1 2xl:absolute 2xl:left-8 2xl:border-[1px] 2xl:border-stone-300/25 2xl:shadow-2xl 2xl:shadow-stone-500/15 2xl:backdrop-blur-3xl",
        className,
      )}
    >
      <nav className="frame-inner relative grid grid-cols-4 bg-white/30 backdrop-blur-2xl 2xl:grid-cols-2 2xl:grid-rows-2 2xl:gap-2 2xl:p-2">
        {CATEGORY_ORDER.map((category, index) => (
          <motion.button
            key={category}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative rounded-2xl text-sm font-[450] transition-colors duration-300",
              activeCategory === category
                ? "text-neutral-500"
                : "text-neutral-400 hover:text-neutral-500",
            )}
            onClick={() => onCategoryChange(category)}
          >
            <span className="relative z-10 flex flex-col">
              <motion.span
                className={cn(
                  "hidden aspect-[4/5] items-start justify-end border-dotted border-neutral-200/80 p-4 text-neutral-400 2xl:flex 2xl:flex-col",
                )}
                animate={{
                  scale: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                }}
                style={{
                  transformOrigin: "center bottom",
                }}
              >
                <span
                  className={cn(
                    "text-neutral-400",
                    activeCategory === category && "text-neutral-500",
                  )}
                >
                  {index === 0 && "Brand"}
                  {index === 1 && "Product"}
                  {index === 2 && "Motion"}
                  {index === 3 && "Web"}
                </span>
              </motion.span>
              <span
                className={cn(
                  "mt-1 block px-4 py-3 text-center text-neutral-400 2xl:hidden",
                  activeCategory === category && "text-neutral-500",
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </span>

            {activeCategory === category && (
              <motion.span
                layoutId="category-pill"
                className="frame-inner frame-inner absolute inset-0 z-0 border-[1px] border-stone-600/5 bg-white/30 shadow-lg shadow-stone-500/15 backdrop-blur-2xl 2xl:rounded-2xl"
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
  );
}

export default function ServicesCarousel({
  categories,
}: ServicesCarouselProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("brand");
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Reset tab index when category changes
  useEffect(() => {
    setActiveTabIndex(0);
  }, [activeCategory]);

  const keyboardState = useKeyboardNavigation({
    onNumberKeyPress: (index) => {
      if (index < CATEGORY_ORDER.length) {
        setActiveCategory(CATEGORY_ORDER[index]);
        setActiveTabIndex(0);
      }
    },
    onShiftNumberKeyPress: (index) => {
      const currentTabs = categories[activeCategory] || [];
      if (index < currentTabs.length) {
        setActiveTabIndex(index);
      }
    },
    onNumberKeyRelease: (index, lastKey) => {
      // Only handle when shift is pressed
      if (keyboardState.shiftPressed && lastKey !== null) {
        setActiveTabIndex(lastKey);
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        delay: 0.4,
        duration: 1,
        ease: EASINGS.easeOutQuart,
      }}
      className="flex w-full flex-col items-center justify-center p-4"
    >
      <motion.div
        key={activeCategory}
        layout
        layoutId="services-outer"
        className="frame-outer relative h-full w-full max-w-[calc(100vw-2rem)] shadow-xl shadow-stone-500/5 md:max-w-[450px] 2xl:max-w-[1100px]"
        transition={{
          layout: { duration: 0.8, ease: EASINGS.easeOutQuart },
        }}
      >
        <motion.div
          layoutId="services-inner"
          layout
          className="frame-inner h-full bg-white/30 backdrop-blur-2xl"
          transition={{
            layout: { duration: 0.8, ease: EASINGS.easeOutQuart },
          }}
        >
          <ServiceContent
            categories={categories}
            activeCategory={activeCategory}
            activeTabIndex={activeTabIndex}
            keyboardState={keyboardState}
            onTabChange={setActiveTabIndex}
          />
        </motion.div>
      </motion.div>
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
    </motion.div>
  );
}
