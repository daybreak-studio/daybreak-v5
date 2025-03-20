import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASINGS } from "@/components/animations/easings";
import { About } from "@/sanity/types";
import { PortableText, PortableTextProps } from "@portabletext/react";
import { memo, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Lenis from "lenis";

type JobPosting = NonNullable<NonNullable<About["jobs"]>[number]>;

interface JobPreviewProps {
  job?: JobPosting;
}

export default function JobPreview({ job }: JobPreviewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const scrim = scrimRef.current;
    if (!container || !scrim) return;

    const handleScrim = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      const bottomThreshold = 100; // pixels from bottom where we start fading

      // Only start fading when we're near the bottom
      const distanceFromBottom = maxScroll - scrollTop;
      const progress = Math.max(
        0,
        Math.min(1 - distanceFromBottom / bottomThreshold, 1),
      );

      scrim.style.opacity = String(1 - progress);
    };

    handleScrim();
    container.addEventListener("scroll", handleScrim);
    const resizeObserver = new ResizeObserver(handleScrim);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", handleScrim);
      resizeObserver.disconnect();
    };
  }, []);

  if (!job) return null;

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const lenis = new Lenis({
      wrapper: container,
      content: container,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  const components: PortableTextProps["components"] = {
    block: {
      h1: ({ children }) => (
        <h1 className="mb-4 text-2xl text-neutral-400 md:text-3xl">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="mb-4 text-2xl text-neutral-400">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="mb-4 text-lg text-neutral-400 md:text-xl">{children}</h3>
      ),
      normal: ({ children }) => (
        <p className="mb-4 text-base text-neutral-400 md:text-lg">{children}</p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="mb-4 border-l-4 border-neutral-200 pl-4 italic text-neutral-400">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="mb-4 list-disc pl-6 text-base text-neutral-400">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="mb-4 list-decimal pl-6 text-base text-neutral-400">
          {children}
        </ol>
      ),
    },
    marks: {
      link: ({ children, value }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 underline hover:text-neutral-600"
        >
          {children}
        </a>
      ),
      strong: ({ children }) => (
        <span className="font-bold text-neutral-400">{children}</span>
      ),
    },
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="hide-scrollbar h-[65vh] overflow-y-auto p-10 md:p-12"
      >
        {/* Top Gradient Scrim */}
        <div className="frame-inner pointer-events-none absolute left-0 right-0 top-0 h-[150px] bg-gradient-to-b from-white via-white/50 to-transparent" />

        <div className="mx-auto max-w-4xl">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 1,
                  ease: EASINGS.easeOutQuart,
                },
              },
            }}
            className="mb-4 space-y-2"
          >
            <h2 className="text-neutral-400">Daybreak Studio</h2>
            <h1 className="text-2xl text-neutral-400 md:text-4xl">
              {job.role}
            </h1>
          </motion.div>

          {/* Info Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASINGS.easeOutQuart }}
            className="mb-8"
          >
            <div className="flex gap-2">
              <div className="flex rounded-full border-[1px] border-neutral-300/25 bg-neutral-200/25 px-3 py-2 md:px-5 md:py-3">
                <span className="text-xs text-neutral-400 md:text-sm">
                  {job.commitment}
                </span>
              </div>
              <div className="flex rounded-full border-[1px] border-neutral-300/25 bg-neutral-200/25 px-3 py-2 md:px-5 md:py-3">
                <span className="text-xs text-neutral-400 md:text-sm">
                  {job.location}
                </span>
              </div>
              <div className="flex rounded-full border-[1px] border-neutral-300/25 bg-neutral-200/25 px-3 py-2 md:px-5 md:py-3">
                <span className="text-xs text-neutral-400 md:text-sm">
                  {job.compensation}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Job Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: EASINGS.easeOutQuart,
              delay: 0.2,
            }}
            className="prose prose-neutral max-w-none"
          >
            <PortableText value={job.body || []} components={components} />
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Scrim */}
      <div
        ref={scrimRef}
        className="frame-inner pointer-events-none absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-white via-white/50 to-transparent"
      />
    </div>
  );
}
