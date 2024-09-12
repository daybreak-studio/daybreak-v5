import React, { useEffect, useRef, useState, useCallback } from "react";

interface DrawerProps {
  children: React.ReactNode;
  scrollY: number;
  windowHeight: number;
  onScroll: (delta: number) => void;
}

const Drawer: React.FC<DrawerProps> = React.memo(
  ({ children, scrollY, windowHeight, onScroll }) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
      const drawerY = Math.max(0, windowHeight - scrollY - windowHeight * 0.03);
      const expanded = drawerY === 0;

      if (drawerRef.current) {
        drawerRef.current.style.transform = `translateY(${drawerY}px)`;
      }

      setIsExpanded(expanded);
    }, [scrollY, windowHeight]);

    const handleScroll = useCallback(
      (deltaY: number) => {
        const contentElement = contentRef.current;
        if (!contentElement) return;

        const { scrollTop, scrollHeight, clientHeight } = contentElement;
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

        if (!isExpanded || (deltaY < 0 && isAtTop)) {
          onScroll(deltaY);
        } else if (!isAtBottom || (deltaY < 0 && !isAtTop)) {
          contentElement.scrollTop += deltaY;
        }
      },
      [isExpanded, onScroll],
    );

    const handleWheel = useCallback(
      (e: React.WheelEvent<HTMLDivElement>) => {
        handleScroll(e.deltaY);
      },
      [handleScroll],
    );

    const handleTouchStart = useCallback(
      (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          drawerRef.current?.setAttribute(
            "data-touch-start-y",
            touch.clientY.toString(),
          );
        }
      },
      [],
    );

    const handleTouchMove = useCallback(
      (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        const touchStartY = Number(
          drawerRef.current?.getAttribute("data-touch-start-y") || 0,
        );
        const deltaY = touchStartY - touch.clientY;
        handleScroll(deltaY);
        drawerRef.current?.setAttribute(
          "data-touch-start-y",
          touch.clientY.toString(),
        );
      },
      [handleScroll],
    );

    return (
      <div
        ref={drawerRef}
        className={`fixed inset-x-0 bottom-0 z-20 overflow-hidden bg-white transition-all duration-300 ease-out ${
          isExpanded ? "rounded-t-none" : "rounded-t-[24px]"
        }`}
        style={{
          height: windowHeight,
          willChange: "transform",
        }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div
          ref={contentRef}
          className={`h-full transition-opacity duration-300 ease-out ${
            isExpanded ? "overflow-y-auto" : "overflow-hidden"
          }`}
        >
          {children}
        </div>
      </div>
    );
  },
);

Drawer.displayName = "Drawer";

export default Drawer;
