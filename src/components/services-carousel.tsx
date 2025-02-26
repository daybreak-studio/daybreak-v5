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
  console.log(categories);
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-2 text-center text-sm text-neutral-500 xl:flex-row xl:space-y-0">
      <div className="relative aspect-square h-full w-full xl:order-2 xl:w-7/12 xl:p-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={`media-${activeCategory}-${activeTabIndex}`}
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{
              duration: 0.8,
              ease: EASINGS.easeOutQuart,
            }}
            className="h-full w-full"
          >
            <MediaRenderer
              className="frame-inner size-full"
              media={
                categories[activeCategory]?.[activeTabIndex]?.media?.[0] ?? null
              }
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col space-y-2 p-6 pt-0 xl:h-full xl:w-5/12 xl:justify-between xl:p-2 xl:text-left">
        <nav className="flex justify-center xl:justify-start xl:space-x-2">
          {categories[activeCategory]?.map((item, index) => (
            <motion.button
              key={item._key}
              initial={{}}
              animate={{
                y: keyboardState.shiftPressed
                  ? keyboardState.pressedKeys.includes(index)
                    ? 3 // Full press
                    : 1 // Shift held
                  : 0, // Rest state
                scale: keyboardState.shiftPressed
                  ? keyboardState.pressedKeys.includes(index)
                    ? 0.97 // Full press
                    : 0.99 // Shift held
                  : 1, // Rest state
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
                mass: 0.3, // Even lighter for faster response
                restDelta: 0.001, // More precise resting point
              }}
              className={cn(
                "xl:frame-inner relative flex items-center justify-center overflow-hidden px-4 py-2 font-medium xl:h-32 xl:w-32 xl:p-4",
                "bg-neutral-200/15",
                activeTabIndex === index && "bg-neutral-100",
                "border border-neutral-200/80",
                activeTabIndex === index
                  ? "text-neutral-600"
                  : "text-neutral-400/70 hover:text-neutral-600",
              )}
              style={{
                transformOrigin: "center bottom",
              }}
              onClick={() => onTabChange(index)}
            >
              <span className="relative z-10 flex h-full w-full flex-col justify-between text-left">
                <span
                  className={cn(
                    "flex w-fit rounded-lg border-[1px] border-neutral-200 bg-neutral-200/25 px-2 py-1 text-xs font-normal text-neutral-400",
                    keyboardState.shiftPressed &&
                      keyboardState.pressedKeys.includes(index) &&
                      "text-neutral-600",
                  )}
                >
                  <span
                    className={cn(
                      "relative text-neutral-400",
                      keyboardState.shiftPressed && "text-neutral-600",
                    )}
                  >
                    Shift
                  </span>

                  <span className="mx-1">+</span>

                  {index + 1}
                </span>
                <span
                  className={cn(
                    "p-2 text-sm",
                    activeTabIndex === index
                      ? "text-neutral-600"
                      : "text-neutral-300",
                  )}
                >
                  {item.heading}
                </span>
              </span>
            </motion.button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <div
            key={`text-${activeCategory}-${activeTabIndex}`}
            className="xl:space-y-4 xl:p-4"
          >
            <motion.h1
              initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(8px)", y: -10 }}
              transition={{
                duration: 0.6,
                ease: EASINGS.easeOutQuart,
              }}
              className="hidden text-4xl xl:block"
            >
              {categories[activeCategory]?.[activeTabIndex]?.heading}
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(8px)", y: -10 }}
              transition={{
                duration: 0.6,
                ease: EASINGS.easeOutQuart,
                delay: 0.15, // Slight delay for second element
              }}
              className="text-pretty text-lg text-neutral-400 xl:text-2xl"
            >
              {categories[activeCategory]?.[activeTabIndex]?.caption}
            </motion.h2>
          </div>
        </AnimatePresence>
      </div>
    </div>
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
  const keyboardState = useKeyboardNavigation({
    onNumberKeyPress: (index) => {
      if (index < CATEGORY_ORDER.length) {
        onCategoryChange(CATEGORY_ORDER[index]);
      }
    },
    onNumberKeyRelease: (index, lastKey) => {
      if (lastKey !== null && lastKey < CATEGORY_ORDER.length) {
        onCategoryChange(CATEGORY_ORDER[lastKey]);
      }
    },
  });

  return (
    <div
      className={cn(
        "frame-outer mt-4 flex w-fit items-stretch justify-center overflow-hidden border-[1px] border-stone-300/25 p-1 shadow-2xl shadow-stone-500/15 backdrop-blur-3xl xl:absolute xl:left-8",
        className,
      )}
    >
      <nav className="frame-inner relative grid grid-cols-4 bg-white/30 backdrop-blur-2xl xl:grid-cols-2 xl:grid-rows-2 xl:gap-2 xl:p-2">
        {CATEGORY_ORDER.map((category, index) => (
          <motion.button
            key={category}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative text-sm font-medium transition-colors duration-300 xl:size-20",
              activeCategory === category
                ? "text-neutral-600"
                : "text-neutral-400 hover:text-neutral-600",
            )}
            onClick={() => onCategoryChange(category)}
          >
            <span className="relative z-10 flex flex-col">
              <motion.span
                className={cn(
                  "frame-inner hidden aspect-square items-center justify-center border border-neutral-200/80 bg-neutral-100/50 text-neutral-400 xl:flex xl:flex-col",
                  activeCategory === category && "bg-neutral-100",
                )}
                animate={{
                  y: keyboardState.pressedKeys.includes(index) ? 3 : 0,
                  scale: keyboardState.pressedKeys.includes(index) ? 0.97 : 1,
                  boxShadow: keyboardState.pressedKeys.includes(index)
                    ? "inset 0 3px 4px rgba(0,0,0,0.2), inset 0 0 2px rgba(0,0,0,0.15)"
                    : "0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -2px rgba(0,0,0,0.04), 0 0 2px 0 rgba(0,0,0,0.03)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  mass: 0.3, // Even lighter for faster response
                  restDelta: 0.001, // More precise resting point
                }}
                style={{
                  transformOrigin: "center bottom",
                }}
              >
                <span
                  className={cn(
                    "text-neutral-400",
                    (keyboardState.pressedKeys.includes(index) ||
                      activeCategory === category) &&
                      "text-neutral-500",
                  )}
                >
                  {index === 0 && "!"}
                  {index === 1 && "@"}
                  {index === 2 && "#"}
                  {index === 3 && "$"}
                </span>
                <span
                  className={cn(
                    "text-neutral-400",
                    keyboardState.pressedKeys.includes(index) ||
                      (activeCategory === category && "text-neutral-600"),
                  )}
                >
                  {index + 1}
                </span>
              </motion.span>
              <span
                className={cn(
                  "mt-1 block px-4 py-3 text-center text-neutral-400 xl:hidden",
                  activeCategory === category && "text-neutral-600",
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </span>

            {activeCategory === category && (
              <motion.span
                layoutId="category-pill"
                className="frame-inner absolute inset-0 z-0 border-[1px] border-stone-600/5 bg-white/30 shadow-lg shadow-stone-500/15 backdrop-blur-2xl xl:hidden"
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
    <div className="flex h-screen w-full flex-col items-center justify-center p-8">
      <div className="relative h-full max-h-fit w-full max-w-[500px] lg:max-w-[500px] xl:max-w-[1100px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            layout
            layoutId="services-outer"
            className="frame-outer h-full shadow-xl shadow-stone-500/5"
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
        </AnimatePresence>
      </div>

      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
    </div>
  );
}
