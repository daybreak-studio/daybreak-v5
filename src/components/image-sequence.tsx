import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

// Define types for our configuration
interface SequenceConfig {
  totalFrames: number;
  modulo: number;
  base: string;
  pad: number;
  ext: string;
  size: {
    w: number;
    h: number;
  };
}

interface ImageSequenceConfig {
  desktop: SequenceConfig;
  mobile: SequenceConfig;
}

type DeviceType = "desktop" | "mobile";

interface ImageSequenceProps {
  height?: number;
  frameRate?: number;
  config?: ImageSequenceConfig;
}

// Default configuration
const DEFAULT_CONFIG: ImageSequenceConfig = {
  desktop: {
    totalFrames: 250,
    modulo: 8,
    base: "/frames/desktop/",
    pad: 3,
    ext: "webp",
    size: { w: 1920, h: 1080 },
  },
  mobile: {
    totalFrames: 250,
    modulo: 12,
    base: "/frames/mobile/",
    pad: 3,
    ext: "webp",
    size: { w: 1080, h: 1920 },
  },
};

interface ScrollConfig {
  duration: number; // Viewport heights to scroll (e.g., 200 = 2 screens)
  frameRate: number; // Target frame rate (e.g., 30)
}

const calculateScrollConfig = (
  totalFrames: number,
  duration: number,
  frameRate: number = 30,
): { modulo: number } => {
  // Calculate how many frames to skip based on scroll duration and frame rate
  const scrollTime = (duration * 1000) / frameRate; // milliseconds to scroll
  const modulo = Math.max(1, Math.floor(totalFrames / scrollTime));

  return { modulo };
};

const useImageSequence = (config: ImageSequenceConfig) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const images = useRef<Record<DeviceType, (HTMLImageElement | null)[]>>({
    desktop: [],
    mobile: [],
  });
  const config_ref = useRef(config);

  const loadSequence = async (type: DeviceType): Promise<number> => {
    const cfg = config_ref.current[type];
    let loadedCount = 0;

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        const paddedIndex = String(index).padStart(cfg.pad, "0");
        img.src = `${cfg.base}${paddedIndex}.${cfg.ext}`;

        img.onload = () => {
          if (images.current) {
            images.current[type][index] = img;
            loadedCount++;
            resolve();
          }
        };

        img.onerror = () => {
          console.error(`Failed to load image ${index} for ${type}`);
          images.current[type][index] = null;
          resolve();
        };
      });
    };

    // Load priority frames first
    const priorityLoads = Array.from(
      { length: Math.ceil(cfg.totalFrames / cfg.modulo) },
      (_, i) => loadImage(i * cfg.modulo),
    );

    await Promise.all(priorityLoads);

    // Load remaining frames in the background
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(async () => {
        for (let i = 0; i < cfg.totalFrames; i++) {
          if (!images.current[type][i]) {
            await loadImage(i);
          }
        }
        setIsLoaded(true);
      });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(async () => {
        for (let i = 0; i < cfg.totalFrames; i++) {
          if (!images.current[type][i]) {
            await loadImage(i);
          }
        }
        setIsLoaded(true);
      }, 0);
    }

    return loadedCount;
  };

  return { images: images.current, loadSequence, isLoaded };
};

const ImageSequence: React.FC<ImageSequenceProps> = ({
  height = 200,
  frameRate = 60,
  config = DEFAULT_CONFIG,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { images, loadSequence, isLoaded } = useImageSequence(config);
  const [isMobile, setIsMobile] = useState(false);
  const lastFrameTime = useRef<number>(0);
  const frameInterval = useRef<number>(1000 / frameRate);

  // Calculate optimal modulo based on scroll configuration
  const scrollConfig = calculateScrollConfig(
    config.desktop.totalFrames,
    height,
    frameRate,
  );

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const currentFrame = useTransform(
    scrollYProgress,
    [0, 1],
    [0, config[isMobile ? "mobile" : "desktop"].totalFrames - 1],
  );

  useEffect(() => {
    const type: DeviceType = isMobile ? "mobile" : "desktop";
    const cfg = config[type];

    // Load sequence first
    loadSequence(type);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    canvas.width = cfg.size.w;
    canvas.height = cfg.size.h;

    let currentFrameValue = 0;
    let rafId: number;
    let lastDrawnFrame: number | null = null;

    const render = () => {
      const frameIndex = Math.round(currentFrameValue);

      // Only redraw if frame has changed
      if (frameIndex !== lastDrawnFrame) {
        const image = images[type][frameIndex];

        if (image) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0);
          lastDrawnFrame = frameIndex;
        }
      }

      rafId = requestAnimationFrame(render);
    };

    const unsubscribe = currentFrame.on("change", (frame: number) => {
      currentFrameValue = frame;
    });

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      unsubscribe();
    };
  }, [isMobile, config]);

  return (
    <motion.div
      ref={containerRef}
      style={{ height: `${height}vh` }}
      data-frame-rate={frameRate}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="h-full w-full object-cover" />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-white">Loading...</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ImageSequence;
